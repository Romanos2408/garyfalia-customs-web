"use client";

import { useState, useCallback, useRef, FormEvent } from "react";
import Link from "next/link";
import type { CommissionForm as CommissionData } from "@/lib/commission";

/* ===========================================================================
   Commission form — a faithful port of the v1 "/order" page (salmon/cream,
   5 flat item cards, Item → Details → Design → Info → Review), wired to the v3
   `/api/commission` route. Colours come from the v1 tokens added to globals.css
   (primary/dark/cream/gray/success); headings use the site's display face.
   ========================================================================= */

/* ----------------------------------- icons (inline, no deps) ------------ */
const IconChevronRight = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconChevronLeft = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconCheck = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconUpload = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconX = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ----------------------------------- data ------------------------------- */
type ItemType = "af1" | "court-vision" | "jordan-mid" | "own-shoes" | "jacket" | "";

const itemOptions = [
  { id: "af1" as const, name: "Nike Air Force 1", emoji: "👟", desc: "Classic white, we provide" },
  { id: "court-vision" as const, name: "Nike Court Vision Low", emoji: "👟", desc: "Clean & minimal, we provide" },
  { id: "jordan-mid" as const, name: "Jordan Mid", emoji: "🏀", desc: "Street style, we provide" },
  { id: "own-shoes" as const, name: "My Own Shoes", emoji: "📦", desc: "You ship them to us" },
  { id: "jacket" as const, name: "Custom Jacket", emoji: "🧥", desc: "Denim, leather, bomber & more" },
];

const shoesSizes = Array.from({ length: 13 }, (_, i) => 36 + i);
const jacketSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const colorSwatches = [
  { name: "Black", color: "#1A1A1A" },
  { name: "White", color: "#FFFFFF" },
  { name: "Red", color: "#E53935" },
  { name: "Blue", color: "#1E88E5" },
  { name: "Green", color: "#43A047" },
  { name: "Yellow", color: "#FDD835" },
  { name: "Orange", color: "#FB8C00" },
  { name: "Purple", color: "#8E24AA" },
  { name: "Pink", color: "#EC407A" },
  { name: "Gold", color: "#C8A97E" },
  { name: "Teal", color: "#00897B" },
  { name: "Brown", color: "#6D4C41" },
];

const styleTags = [
  "Minimalist", "Bold", "Floral", "Geometric", "Abstract",
  "Portrait", "Cartoon", "Typography", "Nature", "Galaxy",
];

const stepLabels = ["Item", "Details", "Design", "Info", "Review"];

const modelName: Record<string, string> = {
  af1: "Nike Air Force 1",
  "court-vision": "Nike Court Vision Low",
  "jordan-mid": "Jordan Mid",
};

export function CommissionForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1
  const [itemType, setItemType] = useState<ItemType>("");
  // Step 2
  const [size, setSize] = useState("");
  const [gender, setGender] = useState("unisex");
  const [baseColor, setBaseColor] = useState("White");
  const [ownBrand, setOwnBrand] = useState("");
  const [jacketType, setJacketType] = useState("Denim");
  // Step 3
  const [designApproach, setDesignApproach] = useState<"mockup" | "reference" | "describe" | "">("");
  const [designFiles, setDesignFiles] = useState<File[]>([]);
  const [designDescription, setDesignDescription] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  // Step 4
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [howFound, setHowFound] = useState("");
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);
  // honeypot
  const [company, setCompany] = useState("");

  const isShoe = itemType && itemType !== "jacket";

  const canProceed = useCallback(() => {
    switch (step) {
      case 0:
        return itemType !== "";
      case 1:
        if (itemType === "jacket") return true;
        if (itemType === "own-shoes") return ownBrand.trim() !== "";
        return size !== "";
      case 2:
        return designApproach !== "";
      case 3:
        return name.trim() !== "" && email.trim() !== "" && agreed;
      default:
        return true;
    }
  }, [step, itemType, size, ownBrand, designApproach, name, email, agreed]);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    setDesignFiles((prev) => [...prev, ...Array.from(files)]);
  };
  const removeFile = (index: number) =>
    setDesignFiles((prev) => prev.filter((_, i) => i !== index));
  const toggleColor = (c: string) =>
    setSelectedColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  const toggleStyle = (s: string) =>
    setSelectedStyles((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const getEstimatedPrice = () => {
    const detailed = designApproach === "mockup" || designApproach === "reference";
    if (itemType === "jacket") return "€150 – €350+";
    if (selectedStyles.length > 3 || detailed) return "€180 – €400+";
    return "€120 – €250+";
  };

  const getItemName = () => itemOptions.find((o) => o.id === itemType)?.name || "";

  /* ---- submit → /api/commission (maps v1 state to the API schema) ---- */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    const itemTypeApi: CommissionData["itemType"] = itemType === "jacket" ? "jacket" : "sneaker";
    const sneakerModel =
      itemType === "own-shoes" ? ownBrand || "My own pair" : itemType ? modelName[itemType] ?? "" : "";

    const payload: Record<string, string> = {
      itemType: itemTypeApi,
      sneakerModel,
      jacketType: itemType === "jacket" ? jacketType : "",
      otherItem: "",
      supplyItem: itemType === "own-shoes" ? "yes" : "",
      designApproach,
      vision: designDescription,
      styleTags: JSON.stringify(selectedStyles),
      selectedColors: JSON.stringify(selectedColors),
      colors: "",
      shoeSizeUnit: "EU",
      shoeSize: isShoe ? size : "",
      gender: isShoe ? gender : "",
      baseColor: isShoe ? baseColor : "",
      jacketSize: itemType === "jacket" ? size : "",
      otherSize: "",
      neededBy: "",
      isGift: "false",
      tier: "",
      timeline: "",
      timelineDate: "",
      name,
      email,
      phone,
      instagram,
      howFound,
      contactMethod: "",
      country: "",
      notes,
      consent: agreed ? "true" : "false",
      company,
    };

    try {
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
      designFiles.forEach((f) => fd.append("images", f));

      const res = await fetch("/api/commission", { method: "POST", body: fd });
      const data = (await res.json()) as { ok: boolean; reference?: string; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Request failed");

      setReference(data.reference ?? "GC-XXXXXX");
      setSubmitted(true);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  /* --------------------------------- success ------------------------------ */
  if (submitted) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="w-full max-w-lg py-20 text-center">
          <div className="relative mb-8">
            <div className="absolute -top-10 left-1/4 h-3 w-3 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0s" }} />
            <div className="absolute -top-6 right-1/3 h-2 w-2 animate-bounce rounded-full bg-rose-400" style={{ animationDelay: "0.2s" }} />
            <div className="absolute -top-12 right-1/4 h-4 w-4 animate-bounce rounded-full bg-amber-400" style={{ animationDelay: "0.4s" }} />
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
              <IconCheck size={40} />
            </div>
          </div>
          <h1 className="mb-4 font-display text-4xl font-bold text-dark">Thank You!</h1>
          <p className="mb-2 text-lg text-foreground/60">
            Your order request has been submitted successfully.
          </p>
          <p className="mb-3 text-gray">
            We&apos;ll review it and get back to you within 24 hours at{" "}
            <strong>{email}</strong> to discuss details and pricing.
          </p>
          <p className="mb-8 text-sm text-gray">
            Your reference: <strong className="text-dark">{reference}</strong>
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/" className="rounded-full bg-primary px-8 py-3 font-semibold text-dark transition-all hover:bg-primary-dark">
              Back to Home
            </Link>
            <Link href="/gallery" className="rounded-full bg-dark px-8 py-3 font-semibold text-white transition-all hover:bg-dark-light">
              Browse Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------- form -------------------------------- */
  return (
    <div className="min-h-screen bg-background">
      {/* hero */}
      <section className="bg-dark px-4 pb-12 pt-32 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl">Place Your Order</h1>
          <p className="text-white/60">
            Tell us what you want and we&apos;ll bring it to life. It&apos;s that simple.
          </p>
        </div>
      </section>

      {/* progress */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-2 flex items-center justify-between">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div
                className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                  i < step
                    ? "bg-success text-white"
                    : i === step
                      ? "bg-primary text-dark"
                      : "bg-gray-light text-gray"
                }`}
              >
                {i < step ? <IconCheck size={18} /> : i + 1}
              </div>
              <span className={`hidden text-xs font-medium sm:block ${i <= step ? "text-dark" : "text-gray"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-light">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-4 pb-20">
        <div className="min-h-[400px] rounded-2xl bg-white p-6 shadow-sm sm:p-10">
          {/* STEP 1 — item */}
          {step === 0 && (
            <div>
              <h2 className="mb-2 font-display text-2xl font-bold text-dark">What would you like customized?</h2>
              <p className="mb-8 text-gray">Choose the item for your custom design</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {itemOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setItemType(item.id)}
                    className={`rounded-xl border-2 p-6 text-left transition-all duration-200 hover:shadow-md ${
                      itemType === item.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-gray-light hover:border-primary/30"
                    }`}
                  >
                    <span className="mb-3 block text-3xl">{item.emoji}</span>
                    <h3 className="text-lg font-semibold text-dark">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray">{item.desc}</p>
                  </button>
                ))}
              </div>
              {itemType === "own-shoes" && (
                <div className="mt-4 rounded-xl bg-cream p-4">
                  <p className="text-sm text-foreground/70">
                    You&apos;ll ship your shoes to us after order confirmation. We&apos;ll provide the address.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — details */}
          {step === 1 && (
            <div>
              <h2 className="mb-2 font-display text-2xl font-bold text-dark">Size &amp; Details</h2>
              <p className="mb-8 text-gray">Tell us the specifics</p>

              {isShoe ? (
                <div className="space-y-6">
                  {itemType === "own-shoes" && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground/80">
                        What brand/model are your shoes? *
                      </label>
                      <input
                        type="text"
                        value={ownBrand}
                        onChange={(e) => setOwnBrand(e.target.value)}
                        placeholder="e.g. Nike Dunk Low, Converse Chuck Taylor…"
                        className="w-full rounded-xl border border-gray-light px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  )}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground/80">
                      Shoe Size (EU) {itemType !== "own-shoes" ? "*" : ""}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {shoesSizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(String(s))}
                          className={`h-12 w-14 rounded-lg text-sm font-medium transition-all ${
                            size === String(s) ? "bg-primary text-dark shadow" : "bg-cream text-foreground/60 hover:bg-primary/20"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground/80">Gender</label>
                    <div className="flex gap-3">
                      {["Men", "Women", "Unisex"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g.toLowerCase())}
                          className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                            gender === g.toLowerCase() ? "bg-primary text-dark" : "bg-cream text-foreground/60 hover:bg-primary/20"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  {itemType !== "own-shoes" && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground/80">Base Shoe Color</label>
                      <div className="flex gap-3">
                        {["White", "Black"].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setBaseColor(c)}
                            className={`rounded-full border px-6 py-2.5 text-sm font-medium transition-all ${
                              baseColor === c ? "border-primary bg-primary/10 text-dark" : "border-gray-light text-foreground/60 hover:border-primary/30"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground/80">Jacket Size</label>
                    <div className="flex flex-wrap gap-2">
                      {jacketSizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(s)}
                          className={`h-12 w-16 rounded-lg text-sm font-medium transition-all ${
                            size === s ? "bg-primary text-dark shadow" : "bg-cream text-foreground/60 hover:bg-primary/20"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground/80">Jacket Type</label>
                    <div className="flex flex-wrap gap-3">
                      {["Denim", "Leather", "Bomber", "Canvas", "Other"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setJacketType(t)}
                          className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                            jacketType === t ? "bg-primary text-dark" : "bg-cream text-foreground/60 hover:bg-primary/20"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 — design */}
          {step === 2 && (
            <div>
              <h2 className="mb-2 font-display text-2xl font-bold text-dark">Your Design</h2>
              <p className="mb-8 text-gray">How would you like to share your vision?</p>

              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { id: "mockup" as const, title: "I have a mockup", desc: "Upload a finished design" },
                  { id: "reference" as const, title: "Reference images", desc: "Share inspiration photos" },
                  { id: "describe" as const, title: "I'll describe it", desc: "Tell us your vision" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDesignApproach(opt.id)}
                    className={`rounded-xl border-2 p-5 text-center transition-all ${
                      designApproach === opt.id ? "border-primary bg-primary/5" : "border-gray-light hover:border-primary/30"
                    }`}
                  >
                    <span className="mx-auto mb-2 flex justify-center text-primary">
                      <IconUpload size={24} />
                    </span>
                    <h4 className="text-sm font-semibold text-dark">{opt.title}</h4>
                    <p className="mt-1 text-xs text-gray">{opt.desc}</p>
                  </button>
                ))}
              </div>

              {(designApproach === "mockup" || designApproach === "reference") && (
                <div className="mb-6">
                  <div
                    className="cursor-pointer rounded-xl border-2 border-dashed border-gray-light p-10 text-center transition-colors hover:border-primary/50"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFileUpload(e.dataTransfer.files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="mx-auto mb-3 flex justify-center text-gray">
                      <IconUpload size={32} />
                    </span>
                    <p className="font-medium text-foreground/70">Drag &amp; drop files here or click to browse</p>
                    <p className="mt-1 text-sm text-gray">PNG, JPG up to 8MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </div>
                  {designFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {designFiles.map((file, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg bg-cream px-4 py-2">
                          <span className="truncate text-sm text-foreground/70">{file.name}</span>
                          <button type="button" onClick={() => removeFile(i)} className="text-gray hover:text-error">
                            <IconX size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(designApproach === "describe" || designApproach === "reference") && (
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-foreground/80">Describe your design idea</label>
                  <textarea
                    rows={4}
                    value={designDescription}
                    onChange={(e) => setDesignDescription(e.target.value)}
                    placeholder="Tell us everything — colors, themes, references, feelings, anything that helps us understand your vision…"
                    className="w-full resize-none rounded-xl border border-gray-light px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              {/* colours */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-foreground/80">Color preferences (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {colorSwatches.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => toggleColor(c.name)}
                      className={`h-10 w-10 rounded-full border-2 transition-all ${
                        selectedColors.includes(c.name) ? "scale-110 border-dark shadow-md" : "border-gray-light hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* style tags */}
              <div>
                <label className="mb-3 block text-sm font-medium text-foreground/80">Style (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {styleTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleStyle(tag)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        selectedStyles.includes(tag) ? "bg-primary text-dark" : "bg-cream text-foreground/60 hover:bg-primary/20"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — info */}
          {step === 3 && (
            <div>
              <h2 className="mb-2 font-display text-2xl font-bold text-dark">Your Information</h2>
              <p className="mb-8 text-gray">So we can get back to you</p>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground/80">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-gray-light px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground/80">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-gray-light px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                      Phone <span className="text-gray">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+30…"
                      className="w-full rounded-xl border border-gray-light px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                      Instagram <span className="text-gray">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@yourusername"
                      className="w-full rounded-xl border border-gray-light px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/80">How did you find us?</label>
                  <select
                    value={howFound}
                    onChange={(e) => setHowFound(e.target.value)}
                    className="w-full rounded-xl border border-gray-light bg-white px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select…</option>
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>Facebook</option>
                    <option>Word of mouth</option>
                    <option>Google</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                    Special notes or deadline <span className="text-gray">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requirements, deadlines, or things we should know…"
                    className="w-full resize-none rounded-xl border border-gray-light px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-gray-light accent-primary"
                  />
                  <span className="text-sm text-foreground/70">
                    I understand this is a custom order request. I agree that a mockup will be created for my
                    approval, and no work begins until I confirm. *
                  </span>
                </label>
                {/* honeypot */}
                <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Company
                    <input tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 — review */}
          {step === 4 && (
            <div>
              <h2 className="mb-2 font-display text-2xl font-bold text-dark">Review Your Order</h2>
              <p className="mb-8 text-gray">Make sure everything looks good</p>
              <div className="space-y-4">
                <div className="rounded-xl bg-cream p-5">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-dark">Item</h3>
                  <p className="text-foreground/80">{getItemName()}</p>
                  {size && <p className="text-sm text-gray">Size: {size}{isShoe ? ` • ${gender}` : ""}</p>}
                  {itemType === "own-shoes" && ownBrand && <p className="text-sm text-gray">Brand: {ownBrand}</p>}
                  {itemType === "jacket" && <p className="text-sm text-gray">Type: {jacketType}{size && ` • Size: ${size}`}</p>}
                </div>
                <div className="rounded-xl bg-cream p-5">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-dark">Design</h3>
                  <p className="capitalize text-foreground/80">{designApproach?.replace("-", " ")}</p>
                  {designFiles.length > 0 && <p className="text-sm text-gray">{designFiles.length} file(s) uploaded</p>}
                  {designDescription && <p className="mt-2 line-clamp-3 text-sm text-gray">{designDescription}</p>}
                  {selectedColors.length > 0 && <p className="mt-1 text-sm text-gray">Colors: {selectedColors.join(", ")}</p>}
                  {selectedStyles.length > 0 && <p className="mt-1 text-sm text-gray">Style: {selectedStyles.join(", ")}</p>}
                </div>
                <div className="rounded-xl bg-cream p-5">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-dark">Contact</h3>
                  <p className="text-foreground/80">{name}</p>
                  <p className="text-sm text-gray">{email}</p>
                  {phone && <p className="text-sm text-gray">{phone}</p>}
                  {instagram && <p className="text-sm text-gray">{instagram}</p>}
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-5">
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-dark">Estimated Price Range</h3>
                  <p className="text-2xl font-bold text-dark">{getEstimatedPrice()}</p>
                  <p className="mt-1 text-xs text-gray">Final price confirmed after reviewing your design details</p>
                </div>
              </div>
              <div className="mt-6 rounded-xl bg-cream p-4">
                <p className="text-center text-sm text-foreground/60">
                  This is a <strong>request</strong>, not a payment. We&apos;ll contact you within 24 hours to
                  discuss details, confirm pricing, and create your mockup.
                </p>
              </div>
              {status === "error" && (
                <p role="alert" className="mt-4 rounded-xl border border-error/40 bg-error/5 px-4 py-3 text-sm text-error">
                  Something went wrong sending your request. Please try again — or email us directly.
                </p>
              )}
            </div>
          )}
        </div>

        {/* nav */}
        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 font-medium text-gray transition-colors hover:text-dark"
            >
              <IconChevronLeft size={18} />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => canProceed() && setStep(step + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-dark transition-all duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <IconChevronRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={status === "submitting"}
              className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-dark transition-all duration-200 hover:bg-primary-dark hover:shadow-lg disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Submit Order Request"}
              <IconCheck size={18} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
