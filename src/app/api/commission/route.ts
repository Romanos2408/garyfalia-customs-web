import { NextResponse } from "next/server";
import { commissionServerSchema } from "@/lib/commission";
import { site } from "@/data/site";

// Resend (email) needs the Node runtime, not Edge.
export const runtime = "nodejs";

/**
 * Commission intake. Validates server-side, then delivers in this priority:
 *   1. Resend email   — if RESEND_API_KEY is set
 *   2. Webhook POST    — else if COMMISSION_WEBHOOK_URL is set (Formspree/Zapier/Make)
 *   3. Dev console log — else (zero-config, still returns success)
 *
 * Reference images arrive as multipart `images`. Secrets come from env only.
 * PRODUCTION TODO: add a real captcha and a per-IP rate limit alongside the
 * honeypot below.
 */
export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid form submission." },
      { status: 400 },
    );
  }

  const get = (k: string) => (formData.get(k) ?? "").toString();

  // honeypot — bots fill hidden fields. Pretend success, deliver nothing.
  if (get("company").trim()) {
    return NextResponse.json({ ok: true, reference: makeReference() });
  }

  const raw = {
    itemType: get("itemType"),
    sneakerModel: get("sneakerModel"),
    jacketType: get("jacketType"),
    otherItem: get("otherItem"),
    supplyItem: get("supplyItem"),
    designApproach: get("designApproach"),
    vision: get("vision"),
    styleTags: safeParseArray(get("styleTags")),
    selectedColors: safeParseArray(get("selectedColors")),
    colors: get("colors"),
    shoeSizeUnit: get("shoeSizeUnit") || "EU",
    shoeSize: get("shoeSize"),
    gender: get("gender"),
    baseColor: get("baseColor"),
    jacketSize: get("jacketSize"),
    otherSize: get("otherSize"),
    neededBy: get("neededBy"),
    isGift: get("isGift") === "true",
    tier: get("tier"),
    timeline: get("timeline"),
    timelineDate: get("timelineDate"),
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    instagram: get("instagram"),
    howFound: get("howFound"),
    contactMethod: get("contactMethod"),
    country: get("country"),
    notes: get("notes"),
    consent: get("consent") === "true",
  };

  const parsed = commissionServerSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 422 },
    );
  }
  const data = parsed.data;
  const reference = makeReference();

  // collect images
  const images = formData
    .getAll("images")
    .filter((v): v is File => v instanceof File && v.size > 0);

  try {
    const toEmail = process.env.COMMISSION_TO_EMAIL || site.email;

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail =
        process.env.COMMISSION_FROM_EMAIL ||
        "Garyfalia Customs <onboarding@resend.dev>";

      const attachments = await Promise.all(
        images.slice(0, 5).map(async (file) => ({
          filename: file.name || "reference",
          content: Buffer.from(await file.arrayBuffer()),
        })),
      );

      const result = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: data.email,
        subject: `New commission — ${data.name} (${reference})`,
        html: buildEmailHtml(data, reference, images.length),
        attachments,
      });
      if (result.error) throw new Error(result.error.message);
    } else if (process.env.COMMISSION_WEBHOOK_URL) {
      const res = await fetch(process.env.COMMISSION_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, ...data, imageCount: images.length }),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } else {
      // zero-config dev fallback
      console.log(
        "\n📨 New commission request (no delivery configured):\n",
        JSON.stringify({ reference, ...data, imageCount: images.length }, null, 2),
        "\n",
      );
    }

    return NextResponse.json({ ok: true, reference });
  } catch (err) {
    console.error("Commission delivery failed:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't send your request right now." },
      { status: 502 },
    );
  }
}

function makeReference() {
  return `GC-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

function safeParseArray(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

function buildEmailHtml(
  d: Record<string, unknown>,
  reference: string,
  imageCount: number,
): string {
  const row = (label: string, value: unknown) => {
    const v = Array.isArray(value) ? value.join(", ") : value;
    if (v === undefined || v === null || v === "" || v === false) return "";
    return `<tr><td style="padding:6px 14px 6px 0;color:#8a8578;font-size:13px;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#0e1b2a;font-size:14px">${escapeHtml(String(v))}</td></tr>`;
  };

  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;background:#f5f3ee;padding:28px;border-radius:14px;color:#0e1b2a">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#8a8578">New commission request</p>
    <h1 style="margin:0 0 2px;font-size:22px;color:#16263f">${escapeHtml(String(d.name))}</h1>
    <p style="margin:0 0 18px;font-size:13px;color:#8a8578">Reference ${reference}</p>
    <table style="width:100%;border-collapse:collapse;background:#fbfaf7;border:1px solid #e7e3d9;border-radius:10px;padding:8px">
      <tbody>
        ${row("Item", d.itemType)}
        ${row("Model / type", d.sneakerModel || d.jacketType || d.otherItem)}
        ${row("Supplies item", d.supplyItem === "yes" ? "Customer" : d.supplyItem === "no" ? "Artist sources" : "")}
        ${row("Design approach", d.designApproach)}
        ${row("Vision", d.vision)}
        ${row("Style", d.styleTags)}
        ${row("Colours", [(d.selectedColors as string[] | undefined)?.join(", "), d.colors].filter(Boolean).join(" · "))}
        ${row("Size", d.shoeSize ? `${d.shoeSize} ${d.shoeSizeUnit}` : d.jacketSize || d.otherSize)}
        ${row("Fit", d.gender)}
        ${row("Base colour", d.baseColor)}
        ${row("Needed by", d.neededBy)}
        ${row("Gift", d.isGift ? "Yes" : "")}
        ${row("Tier", d.tier)}
        ${row("Timeline", d.timeline === "specific" ? d.timelineDate || "Specific date" : d.timeline)}
        ${row("Reference images", imageCount ? `${imageCount} attached` : "")}
        ${row("Email", d.email)}
        ${row("Phone", d.phone)}
        ${row("Instagram", d.instagram)}
        ${row("How found", d.howFound)}
        ${row("Preferred contact", d.contactMethod)}
        ${row("Country", d.country)}
        ${row("Notes", d.notes)}
      </tbody>
    </table>
  </div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
