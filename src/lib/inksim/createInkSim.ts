import * as twgl from "twgl.js";
import advectFrag from "./shaders/advect.frag";
import clearFrag from "./shaders/clear.frag";
import divergenceFrag from "./shaders/divergence.frag";
import dyeFrag from "./shaders/dye.frag";
import gradientFrag from "./shaders/gradient.frag";
import gridVert from "./shaders/grid.vert";
import interiorVert from "./shaders/interior.vert";
import jacobiFrag from "./shaders/jacobi.frag";
import splatFrag from "./shaders/splat.frag";
import vorticityFrag from "./shaders/vorticity.frag";
import vorticityForceFrag from "./shaders/vorticityForce.frag";

/**
 * GPU ink-in-water fluid simulation (Navier–Stokes, dye field), ported from
 * Volcomix/ink-drop (MIT) off its global singletons into a self-contained
 * factory: pass a <canvas>, get a `splat()` you can drive from scroll, plus
 * pause/resume/destroy. The dye render is re-tinted to navy ink on marble
 * (see shaders/dye.frag). Returns null if WebGL2 + float render targets aren't
 * available (caller shows a static fallback).
 */

export interface InkSimOptions {
  dyeColor?: [number, number, number];
  splatRadius?: number;
  vorticity?: number;
  gridResolution?: number;
  solverIterations?: number;
}

export interface InkSim {
  /** position in CSS px (origin top-left); movement in px since last splat. */
  splat: (x: number, y: number, dx: number, dy: number) => void;
  pause: () => void;
  resume: () => void;
  destroy: () => void;
}

interface Splat {
  position: [number, number];
  movement: [number, number];
}

export function createInkSim(
  canvas: HTMLCanvasElement,
  options: InkSimOptions = {},
): InkSim | null {
  const ctx = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
  });
  if (!ctx) return null;
  twgl.addExtensionsToContext(ctx);
  if (!ctx.getExtension("EXT_color_buffer_float")) return null;
  const gl: WebGL2RenderingContext = ctx;

  const config = {
    dyeColor: options.dyeColor ?? ([1, 1, 1] as [number, number, number]),
    splatRadius: options.splatRadius ?? 36,
    viscosity: 0,
    vorticity: options.vorticity ?? 0.22,
    gridResolution: options.gridResolution ?? 256,
    solverIterations: options.solverIterations ?? 28,
  };

  const clearProgram = twgl.createProgramInfo(gl, [gridVert, clearFrag]);
  const advectProgram = twgl.createProgramInfo(gl, [interiorVert, advectFrag]);
  const splatProgram = twgl.createProgramInfo(gl, [interiorVert, splatFrag]);
  const vorticityProgram = twgl.createProgramInfo(gl, [interiorVert, vorticityFrag]);
  const vorticityForceProgram = twgl.createProgramInfo(gl, [interiorVert, vorticityForceFrag]);
  const jacobiProgram = twgl.createProgramInfo(gl, [interiorVert, jacobiFrag]);
  const divergenceProgram = twgl.createProgramInfo(gl, [interiorVert, divergenceFrag]);
  const gradientProgram = twgl.createProgramInfo(gl, [interiorVert, gradientFrag]);
  const dyeProgram = twgl.createProgramInfo(gl, [gridVert, dyeFrag]);

  const gridBuffer = twgl.createBufferInfoFromArrays(gl, {
    a_coord: [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1],
    a_texCoord: [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1],
  });

  const getGridSize = () => ({
    width: Math.round(config.gridResolution * Math.min(gl.canvas.width / gl.canvas.height, 1)),
    height: Math.round(config.gridResolution * Math.min(gl.canvas.height / gl.canvas.width, 1)),
  });

  const createGrid = (internalFormat: number) => {
    const attachments = [{ internalFormat }];
    const { width, height } = getGridSize();
    return {
      current: twgl.createFramebufferInfo(gl, attachments, width, height),
      get size() {
        return [this.current.width, this.current.height] as [number, number];
      },
      resize() {
        const s = getGridSize();
        twgl.resizeFramebufferInfo(gl, this.current, attachments, s.width, s.height);
      },
    };
  };

  const createSwappableGrid = (internalFormat: number) => {
    const attachments = [{ internalFormat }];
    const { width, height } = getGridSize();
    return {
      current: twgl.createFramebufferInfo(gl, attachments, width, height),
      next: twgl.createFramebufferInfo(gl, attachments, width, height),
      get size() {
        return [this.current.width, this.current.height] as [number, number];
      },
      resize() {
        const s = getGridSize();
        twgl.resizeFramebufferInfo(gl, this.current, attachments, s.width, s.height);
        twgl.resizeFramebufferInfo(gl, this.next, attachments, s.width, s.height);
      },
      swap() {
        const temp = this.current;
        this.current = this.next;
        this.next = temp;
      },
    };
  };

  const dye = createSwappableGrid(gl.RGBA16F);
  const velocity = createSwappableGrid(gl.RG16F);
  const pressure = createSwappableGrid(gl.R16F);
  const vorticity = createGrid(gl.R16F);
  const divergence = createGrid(gl.R16F);

  const queue: Splat[] = [];
  const splat = (x: number, y: number, dx: number, dy: number) => {
    // CSS px (top-left origin) → device px with y up (matches the sim).
    const sx = (canvas.width / canvas.clientWidth) * x;
    const sy = canvas.height - (canvas.height / canvas.clientHeight) * y;
    const sdx = (canvas.width / canvas.clientWidth) * dx;
    const sdy = -(canvas.height / canvas.clientHeight) * dy;
    queue.push({ position: [sx, sy], movement: [sdx, sdy] });
  };

  let previousTime = performance.now();
  let raf = 0;
  let paused = false;
  let destroyed = false;

  function addForces(timeStep: number) {
    if (!queue.length) return;
    gl.useProgram(splatProgram.program);
    twgl.setBuffersAndAttributes(gl, splatProgram, gridBuffer);
    for (const s of queue) {
      twgl.setUniforms(splatProgram, {
        u_resolution: [gl.canvas.width, gl.canvas.height],
        u_mousePosition: s.position,
        u_radius: config.splatRadius,
      });
      twgl.bindFramebufferInfo(gl, velocity.next);
      twgl.setUniforms(splatProgram, {
        u_gridSize: velocity.size,
        u_quantity: [
          velocity.size[0] * (s.movement[0] / gl.canvas.width / timeStep),
          velocity.size[1] * (s.movement[1] / gl.canvas.height / timeStep),
          0,
        ],
        u_currentQuantity: velocity.current.attachments[0],
      });
      twgl.drawBufferInfo(gl, gridBuffer);

      twgl.bindFramebufferInfo(gl, dye.next);
      twgl.setUniforms(splatProgram, {
        u_gridSize: dye.size,
        u_quantity: config.dyeColor,
        u_currentQuantity: dye.current.attachments[0],
      });
      twgl.drawBufferInfo(gl, gridBuffer);

      velocity.swap();
      dye.swap();
    }
    queue.length = 0;
  }

  function advect(timeStep: number) {
    gl.useProgram(advectProgram.program);
    twgl.setBuffersAndAttributes(gl, advectProgram, gridBuffer);
    twgl.setUniforms(advectProgram, {
      u_scale: [timeStep / velocity.size[0], timeStep / velocity.size[1]],
      u_velocity: velocity.current.attachments[0],
    });
    twgl.bindFramebufferInfo(gl, velocity.next);
    twgl.setUniforms(advectProgram, {
      u_gridSize: velocity.size,
      u_currentQuantity: velocity.current.attachments[0],
    });
    twgl.drawBufferInfo(gl, gridBuffer);
    twgl.bindFramebufferInfo(gl, dye.next);
    twgl.setUniforms(advectProgram, {
      u_gridSize: dye.size,
      u_currentQuantity: dye.current.attachments[0],
    });
    twgl.drawBufferInfo(gl, gridBuffer);
    velocity.swap();
    dye.swap();
  }

  function computeVorticity(timeStep: number) {
    twgl.bindFramebufferInfo(gl, vorticity.current);
    gl.useProgram(vorticityProgram.program);
    twgl.setBuffersAndAttributes(gl, vorticityProgram, gridBuffer);
    twgl.setUniforms(vorticityProgram, {
      u_gridSize: velocity.size,
      u_velocity: velocity.current.attachments[0],
    });
    twgl.drawBufferInfo(gl, gridBuffer);

    twgl.bindFramebufferInfo(gl, velocity.next);
    gl.useProgram(vorticityForceProgram.program);
    twgl.setBuffersAndAttributes(gl, vorticityForceProgram, gridBuffer);
    twgl.setUniforms(vorticityForceProgram, {
      u_gridSize: vorticity.size,
      u_scale: config.vorticity * timeStep,
      u_vorticity: vorticity.current.attachments[0],
      u_velocity: velocity.current.attachments[0],
    });
    twgl.drawBufferInfo(gl, gridBuffer);
    velocity.swap();
  }

  function computePressure() {
    twgl.bindFramebufferInfo(gl, divergence.current);
    gl.useProgram(divergenceProgram.program);
    twgl.setBuffersAndAttributes(gl, divergenceProgram, gridBuffer);
    twgl.setUniforms(divergenceProgram, {
      u_gridSize: velocity.size,
      u_velocity: velocity.current.attachments[0],
    });
    twgl.drawBufferInfo(gl, gridBuffer);

    twgl.bindFramebufferInfo(gl, pressure.current);
    gl.useProgram(clearProgram.program);
    twgl.setBuffersAndAttributes(gl, clearProgram, gridBuffer);
    twgl.drawBufferInfo(gl, gridBuffer);

    gl.useProgram(jacobiProgram.program);
    twgl.setBuffersAndAttributes(gl, jacobiProgram, gridBuffer);
    twgl.setUniforms(jacobiProgram, {
      u_gridSize: pressure.size,
      u_alpha: -1,
      u_reciprocalBeta: 1 / 4,
    });
    for (let i = 0; i < config.solverIterations; i++) {
      twgl.bindFramebufferInfo(gl, pressure.next);
      twgl.setUniforms(jacobiProgram, {
        u_x: pressure.current.attachments[0],
        u_b: divergence.current.attachments[0],
      });
      twgl.drawBufferInfo(gl, gridBuffer);
      pressure.swap();
    }
  }

  function subtractPressureGradient() {
    twgl.bindFramebufferInfo(gl, velocity.next);
    gl.useProgram(gradientProgram.program);
    twgl.setBuffersAndAttributes(gl, gradientProgram, gridBuffer);
    twgl.setUniforms(gradientProgram, {
      u_gridSize: pressure.size,
      u_pressure: pressure.current.attachments[0],
      u_velocity: velocity.current.attachments[0],
    });
    twgl.drawBufferInfo(gl, gridBuffer);
    velocity.swap();
  }

  function renderDye() {
    twgl.bindFramebufferInfo(gl, null);
    gl.useProgram(dyeProgram.program);
    twgl.setBuffersAndAttributes(gl, dyeProgram, gridBuffer);
    twgl.setUniforms(dyeProgram, { u_gridSize: dye.size, u_dye: dye.current.attachments[0] });
    twgl.drawBufferInfo(gl, gridBuffer);
  }

  function animate(time: number) {
    if (destroyed) return;
    raf = requestAnimationFrame(animate);
    if (paused) {
      previousTime = time;
      return;
    }
    if (twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement)) {
      dye.resize();
      velocity.resize();
      pressure.resize();
      vorticity.resize();
      divergence.resize();
    }
    const timeStep = Math.min((time - previousTime) * 0.001, 0.033);
    previousTime = time;

    addForces(timeStep);
    advect(timeStep);
    computeVorticity(timeStep);
    computePressure();
    subtractPressureGradient();
    renderDye();
  }

  // size + paint an initial (marble) frame immediately, so the canvas is correct
  // and clean even before the rAF loop spins up.
  if (twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement)) {
    dye.resize();
    velocity.resize();
    pressure.resize();
    vorticity.resize();
    divergence.resize();
  }

  // seed a soft initial bloom and pre-run a few steps so the hero opens with a
  // hint of ink (not blank), then grows as the user scrolls.
  queue.push({
    position: [gl.canvas.width * 0.62, gl.canvas.height * 0.52],
    movement: [4, -9],
  });
  for (let i = 0; i < 22; i++) {
    addForces(0.016);
    advect(0.016);
    computeVorticity(0.016);
    computePressure();
    subtractPressureGradient();
  }
  renderDye();

  raf = requestAnimationFrame(animate);

  return {
    splat,
    pause() {
      paused = true;
    },
    resume() {
      paused = false;
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
