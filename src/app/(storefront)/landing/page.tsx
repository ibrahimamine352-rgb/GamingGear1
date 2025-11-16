"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Cpu,
  Monitor,
  Gauge,
  ShieldCheck,
  Gift,
  Zap,
  Wrench,
  Star,
  Truck,
  CheckCircle2,
  ChevronRight,
  MousePointerClick,
  Facebook,
  Instagram,
  Wallet,
  SlidersHorizontal,
  Gamepad2,
  Mouse,
  Smartphone,
  ShoppingCart,
  Plus,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { UI_TEXT } from "@/i18n/ui-text";


// ------------------------------ CONFIG ------------------------------------
const WA_NUMBER = "21627477075"; // Gaming Gear TN WhatsApp number
const EMAIL = "contact@gaminggear.tn";

const theme = {
  bg: "#0b0c10",
  panel: "#101218",
  card: "#12141b",
  accent: "hsl(var(--accent))",
  accent2: "hsl(var(--brand-end))",
  text: "#e6e8ee",
  subtext: "#a6adc8",
  line: "#1c2030",
};

// ---------------------------- TRACKING -------------------------------------
function track(event: string, data: any = {}) {
  try {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event, ...data, ts: Date.now() });
  } catch {}
  // Always safe fallback for debugging
  if (typeof window !== "undefined") {
    console.log(`GGTN_TRACK → ${event}`, data);
  }
}

// --------------------------- REAL PRODUCT API ------------------------------
async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/api/products?isFeatured=true");
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// ------------------------------ UI PRIMS -----------------------------------
function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card/70 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.02)] ${className}`}>{children}</div>
  );
}

function Button({ 
  children, 
  className = "", 
  as: As = "button" as any, 
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
  as?: any; 
  [key: string]: any;
}) {
  return (
    <As
      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 font-medium transition hover:translate-y-[-1px] active:translate-y-[0] ${className}`}
      {...props}
    >
      {children}
    </As>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-foreground/80">
      {children}
    </span>
  );
}

function Glow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-3xl" style={{ background: `radial-gradient(closest-side, ${theme.accent}22, transparent)` }} />
      <div className="absolute top-20 right-[-120px] h-[380px] w-[380px] rounded-full blur-3xl" style={{ background: `radial-gradient(closest-side, ${theme.accent2}22, transparent)` }} />
    </div>
  );
}

// ------------------------------ HERO --------------------------------------
function Hero() {
  const router = useRouter();
  const { lang } = useLanguage();
  const ui = UI_TEXT[lang];

  return (
    <section className="relative isolate" style={{ background: theme.bg }}>
      <Glow />
      <Container className="pt-20 pb-10 sm:pt-28">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Badge>
                <Zap className="mr-2 h-3.5 w-3.5" /> {ui.landingHeroBadge}
              </Badge>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {/* you can keep the highlight span if you want */}
              {ui.landingHeroTitleMain.split(ui.landingHeroTitleHighlight)[0]}
              <span style={{ color: theme.accent }}>{ui.landingHeroTitleHighlight}</span>
              {ui.landingHeroTitleMain.split(ui.landingHeroTitleHighlight)[1]}
              <br />
              <span className="text-foreground/90">
                {ui.landingHeroLine2}
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-foreground/70 sm:text-lg">
              {ui.landingHeroSubtitle}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                className="bg-white text-black hover:shadow-lg"
                onClick={() => {
                  track("cta_configure_click");
                  router.push("/build-pc");
                }}
              >
                <Cpu className="h-5 w-5" />
                {ui.landingHeroCtaBuild}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                className="border border-white/20 text-foreground hover:bg-white/10"
                onClick={() => {
                  track("cta_bundles_click");
                  router.push("/shop");
                }}
              >
                <Monitor className="h-5 w-5" />
                {ui.landingHeroCtaBrowse}
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-foreground/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> {ui.landingHeroWarranty}
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" /> {ui.landingHeroDelivery}
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4" /> {ui.landingHeroStressTest}
              </div>
            </div>
          </div>
          {/* right side stays the same */}
        </div>
      </Container>
    </section>
  );
}


// ---------------------------- VALUE PROPS ----------------------------------
const propsData = [
  { icon: <Wrench className="h-5 w-5" />, title: "Tailored Builds", desc: "Spec chosen for your games, resolution, and budget." },
  { icon: <ShieldCheck className="h-5 w-5" />, title: "Solid Warranty", desc: "Local support with real humans — not ticket bots." },
  { icon: <Gauge className="h-5 w-5" />, title: "Peak Performance", desc: "Thermals & noise tuned, BIOS configured, drivers vetted." },
  { icon: <Gift className="h-5 w-5" />, title: "Bundle Deals", desc: "Monitor + peripherals packages priced to win." },
];

function ValueProps() {
  return (
    <section className="relative" style={{ background: theme.bg }}>
      <Container className="py-12 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {propsData.map((p, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl border border-border bg-card/70 p-2 text-foreground">{p.icon}</div>
                <div>
                  <h3 className="text-foreground font-semibold">{p.title}</h3>
                  <p className="text-foreground/70 text-sm mt-1">{p.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ------------------------ REAL CONFIGURATOR --------------------------------
function useAutoSpec({ budget, useCase, brand }: { budget: number; useCase: string; brand: string }) {
  return useMemo(() => {
    let cpu, gpu, ram, storage, psu, chassis, note;

    if (budget < 2500) {
      cpu = brand === "intel" ? "Intel i5-13400F" : "Ryzen 5 5600";
      gpu = brand === "nvidia" ? "RTX 4060 8GB" : "RX 6600 8GB";
      ram = "16GB";
      storage = "500GB NVMe";
      psu = "650W Bronze";
      chassis = "ATX Silent";
      note = "Great for 1080p esports & AAA on medium.";
    } else if (budget < 4500) {
      cpu = brand === "intel" ? "Intel i5-13400F" : "Ryzen 5 5600";
      gpu = "RTX 4060 8GB";
      ram = "32GB";
      storage = "1TB NVMe";
      psu = "650W Bronze";
      chassis = "ATX Silent";
      note = "1440p capable on high with DLSS/FSR.";
    } else {
      cpu = brand === "amd" ? "Ryzen 7 7800X3D" : "Intel i7 equivalent";
      gpu = "RTX 4070 SUPER";
      ram = "32GB";
      storage = "1TB NVMe";
      psu = "750W Gold";
      chassis = "ATX Silent";
      note = "High refresh 1440p / entry 4K.";
    }

    if (useCase === "creator") note += " Optimized for Premiere/Photoshop.";

    return { cpu, gpu, ram, storage, psu, chassis, note };
  }, [budget, useCase, brand]);
}

function QuickConfiguratorReal() {
  const { lang } = useLanguage();
  const ui = UI_TEXT[lang];
  const [budget, setBudget] = useState(2400);
  const [useCase, setUseCase] = useState("esports");
  const [brand, setBrand] = useState("nvidia");
  const [products, setProducts] = useState<Product[]>([]);
  const spec = useAutoSpec({ budget, useCase, brand });

  useEffect(() => {
    fetchProducts().then((items) => setProducts(items));
  }, []);

  useEffect(() => {
    track("config_slider_change", { budget, useCase, brand });
  }, [budget, useCase, brand]);

  const estPrice = useMemo(() => {
    // Estimate using real product prices
    const get = (type: string, includes?: string[]) => products.find((p) => p.category?.name?.toLowerCase().includes(type) && (!includes || includes.some(inc => p.name.includes(inc))));
    let price = 0;
    
    // CPU
    if (spec.cpu.includes("5600")) price += get("processor", ["Ryzen 5 5600"])?.price || 439;
    else if (spec.cpu.includes("13400F")) price += get("processor", ["Intel i5-13400F"])?.price || 789;
    else if (spec.cpu.includes("7800X3D")) price += get("processor", ["Ryzen 7 7800X3D"])?.price || 1399;

    // GPU
    if (spec.gpu.includes("RX 6600")) price += get("gpu", ["Radeon RX 6600 8GB"])?.price || 1099;
    else if (spec.gpu.includes("4060")) price += get("gpu", ["GeForce RTX 4060 8GB"])?.price || 1599;
    else if (spec.gpu.includes("4070")) price += get("gpu", ["GeForce RTX 4070 SUPER 12GB"])?.price || 2899;

    // RAM
    price += spec.ram === "16GB" ? (get("memory", ["DDR4 16GB (2x8) 3200"])?.price || 179) : (get("memory", ["DDR4 32GB (2x16) 3600"])?.price || 349);
    
    // Storage
    price += spec.storage.includes("1TB") ? (get("harddisk", ["NVMe SSD 1TB"])?.price || 329) : (get("harddisk", ["NVMe SSD 500GB"])?.price || 189);
    
    // PSU
    price += spec.psu.includes("750") ? (get("powersupply", ["750W 80+ Gold"])?.price || 429) : (get("powersupply", ["650W 80+ Bronze"])?.price || 279);
    
    // Case
    price += get("pcCase")?.price || 299;

    // Assembly + thermal paste + stress testing flat fee
    price += 150;

    return Math.round(price);
  }, [products, spec]);

  const recMonitor = useMemo(() => {
    if (spec.gpu.includes("4070")) return "27\" 1440p 165Hz";
    if (spec.gpu.includes("4060")) return "24\" 1080p 144Hz";
    return "24\" 1080p 144Hz";
  }, [spec]);

  return (
    <section id="configure" className="relative" style={{ background: theme.bg }}>
      <Container className="py-12 sm:py-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {ui.landingConfigTitle}
          </h2>
          <div className="flex items-center gap-2 text-foreground/70 text-sm">
            <Wallet className="h-4 w-4" />
            {ui.landingConfigPriceHint}
          </div>
        </div>
  
        <Card className="p-6">
          {/* Controls */}
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="text-foreground/80 text-sm flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                {ui.landingConfigBudgetLabel}
              </label>
              <input
                type="range"
                min={1600}
                max={7000}
                step={100}
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="mt-3 w-full"
              />
              <div className="mt-2 text-foreground font-semibold">
                {budget.toLocaleString()} TND
              </div>
            </div>
  
            <div>
              <label className="text-foreground/80 text-sm">
                {ui.landingConfigUseCaseLabel}
              </label>
              <select
                className="mt-3 w-full rounded-xl border border-border bg-card/70 p-2 text-foreground"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
              >
                <option value="esports">{ui.landingConfigUseEsports}</option>
                <option value="aaa">{ui.landingConfigUseAAA}</option>
                <option value="creator">{ui.landingConfigUseCreator}</option>
              </select>
            </div>
  
            <div>
              <label className="text-foreground/80 text-sm">
                {ui.landingConfigBrandLabel}
              </label>
              <select
                className="mt-3 w-full rounded-xl border border-border bg-card/70 p-2 text-foreground"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                <option value="nvidia">{ui.landingConfigBrandNvidia}</option>
                <option value="amd">{ui.landingConfigBrandAmd}</option>
                <option value="intel">{ui.landingConfigBrandIntel}</option>
              </select>
            </div>
          </div>
  
          {/* Spec Preview */}
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Spec label="CPU" value={spec.cpu} />
            <Spec label="GPU" value={spec.gpu} />
            <Spec label="RAM" value={spec.ram} />
            <Spec label="Storage" value={spec.storage} />
            <Spec label="PSU" value={spec.psu} />
            <Spec label="Case" value={spec.chassis} />
            <Spec label="Monitor Suggestion" value={recMonitor} />
            <Spec label="Notes" value={spec.note} />
          </div>
  
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="text-foreground/80">
              {ui.landingConfigEstPrice}:{" "}
              <span className="text-foreground font-semibold">
                {estPrice.toLocaleString()} TND
              </span>
              <span className="ml-2 text-xs text-foreground/50">
                {ui.landingConfigEstNote}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                as="a"
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                  `Hi Gaming Gear TN!
  Budget: ${budget} TND
  Use case: ${useCase}
  Brand: ${brand}
  Spec: ${spec.cpu}, ${spec.gpu}, ${spec.ram}, ${spec.storage}, ${spec.psu}, ${spec.chassis}
  Estimated Price: ${estPrice} TND
  Link: gaminggear.tn/landing#configure`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="bg-white text-black"
                onClick={() =>
                  track("cta_whatsapp_from_config", {
                    budget,
                    useCase,
                    brand,
                    estPrice,
                  })
                }
              >
                {ui.landingConfigWhatsapp}{" "}
                <MousePointerClick className="h-4 w-4" />
              </Button>
  
              <Button
                as="a"
                href={`mailto:${EMAIL}`}
                className="border border-white/20 text-foreground hover:bg-white/10"
                onClick={() => track("cta_email_from_config")}
              >
                Email This Spec
              </Button>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
  
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 p-4 text-foreground/80">
      <div className="text-xs uppercase tracking-wide text-foreground/60">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

// ---------------------------- BUNDLES (3 Tiers) ----------------------------
const BUNDLES = [
  {
    id: "starter",
    title: "Starter Setup",
    priceFrom: 3299,
    includes: ["Ryzen 5 / RTX 4060 or RX 6600", "16GB RAM", "500GB NVMe", "24'' 144Hz 1080p", "Mouse + Keyboard"],
    bestFor: "1080p esports & casual AAA",
  },
  {
    id: "balanced",
    title: "Balanced Setup",
    priceFrom: 4599,
    includes: ["i5-13400F or Ryzen 5", "RTX 4060", "32GB RAM", "1TB NVMe", "27'' 1440p 165Hz", "Mech KB + Esports Mouse"],
    bestFor: "1440p high refresh",
    featured: true,
  },
  {
    id: "pro",
    title: "Pro Gamer Setup",
    priceFrom: 6799,
    includes: ["Ryzen 7 7800X3D", "RTX 4070 SUPER", "32GB RAM", "1TB NVMe", "27'' 1440p 165Hz", "Pro peripherals"],
    bestFor: "1440p ultra / entry 4K",
  },
];

function Bundles({ products }: { products: Product[] }) {
  return (
    <section id="bundles" className="relative border-t border-border" style={{ background: theme.bg }}>
      <Container className="py-12 sm:py-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Full Setup Bundles</h2>
          <div className="text-sm text-foreground/70 flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> In-stock parts only</div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {BUNDLES.map((b) => (
            <Card key={b.id} className={`p-6 ${b.featured ? "ring-2 ring-white/20" : ""}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-foreground text-xl font-semibold">{b.title}</h3>
                {b.featured && <Badge>Most Popular</Badge>}
              </div>
              <div className="mt-2 text-foreground/70 text-sm">Best for: {b.bestFor}</div>
              <div className="mt-4 text-3xl font-bold text-foreground">{b.priceFrom.toLocaleString()} TND<span className="text-foreground/50 text-base font-normal">/from</span></div>
              <ul className="mt-4 space-y-2 text-foreground/80 text-sm">
                {b.includes.map((i) => (
                  <li key={i} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4" /> {i}</li>
                ))}
              </ul>
              <div className="mt-5 flex items-center gap-3">
                <Button
                  as="a"
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in the ${b.title} bundle (from ${b.priceFrom} TND).`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white text-black"
                  onClick={() => track("cta_bundle_whatsapp", { bundle: b.id })}
                >
                  Get This Bundle <ArrowRight className="h-4 w-4" />
                </Button>
                <Button as="a" href="#configure" className="border border-white/20 text-foreground hover:bg-white/10" onClick={() => track("cta_bundle_customize", { bundle: b.id })}>
                  Customize
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Tiny comparison */}
        <Card className="mt-6 p-4">
          <div className="grid grid-cols-4 gap-3 text-xs text-foreground/70">
            <div className="font-semibold text-foreground/90">Compare</div>
            <div>Starter</div>
            <div>Balanced</div>
            <div>Pro</div>
            <div className="font-semibold text-foreground/90">Resolution</div>
            <div>1080p</div>
            <div>1440p</div>
            <div>1440p/4K</div>
            <div className="font-semibold text-foreground/90">GPU Class</div>
            <div>RX 6600 / RTX 4060</div>
            <div>RTX 4060</div>
            <div>RTX 4070 SUPER</div>
            <div className="font-semibold text-foreground/90">RAM</div>
            <div>16GB</div>
            <div>32GB</div>
            <div>32GB</div>
          </div>
        </Card>
      </Container>
    </section>
  );
}

// ---------------------- LEAD FORM: GAME LIST -------------------------------
function GameListForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [games, setGames] = useState("");
  const [screen, setScreen] = useState("1080p 144Hz");
  const [budget, setBudget] = useState("2500-4500 TND");

  const disabled = !name || (!email && !phone) || games.length < 3;

  function buildWhatsApp() {
    const text = `Hi Gaming Gear TN!
Name: ${name}
Contact: ${email || phone}
Screen: ${screen}
Budget: ${budget}
Games: ${games}`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  function buildMailTo() {
    const subject = encodeURIComponent("Game List for Custom PC");
    const body = encodeURIComponent(`Name: ${name}
Contact: ${email || phone}
Screen: ${screen}
Budget: ${budget}
Games: ${games}`);
    return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <section id="games" className="relative border-t border-border" style={{ background: theme.bg }}>
      <Container className="py-12 sm:py-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl flex items-center gap-2"><Gamepad2 className="h-6 w-6" /> Submit Your Game List</h2>
          <p className="text-sm text-foreground/70">We reply with 2–3 tailored builds.</p>
        </div>
        <Card className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" value={name} onChange={setName} placeholder="Your name" />
            <Field label="Email (or WhatsApp)" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Field label="WhatsApp" value={phone} onChange={setPhone} placeholder="(+216)" />
            <Select label="Screen / Resolution" value={screen} onChange={setScreen} options={["1080p 144Hz", "1440p 144–165Hz", "4K 60–120Hz"]} />
            <Select label="Budget" value={budget} onChange={setBudget} options={["1600-2500 TND", "2500-4500 TND", "4500-7000 TND", "7000+ TND"]} />
          </div>
          <TextArea label="Games you play" value={games} onChange={setGames} placeholder="CS2, Valorant, GTA V, Cyberpunk 2077…" />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button as="a" href={buildWhatsApp()} target="_blank" rel="noreferrer" className={`bg-white text-black ${disabled ? "pointer-events-none opacity-50" : ""}`} onClick={() => track("lead_games_whatsapp") }>
              Send via WhatsApp
            </Button>
            <Button as="a" href={buildMailTo()} className={`border border-white/20 text-foreground hover:bg-white/10 ${disabled ? "pointer-events-none opacity-50" : ""}`} onClick={() => track("lead_games_email") }>
              Send via Email
            </Button>
          </div>
          <p className="mt-3 text-xs text-foreground/60">By sending, you agree to be contacted about your build.</p>
        </Card>
      </Container>
    </section>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <div className="text-foreground/80 text-sm">{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-border bg-card/70 p-3 text-foreground placeholder:text-muted-foreground" />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block">
      <div className="text-foreground/80 text-sm">{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-card/70 p-3 text-foreground">
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block mt-4">
      <div className="text-foreground/80 text-sm">{label}</div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={4} className="mt-2 w-full rounded-xl border border-border bg-card/70 p-3 text-foreground placeholder:text-muted-foreground" />
    </label>
  );
}

// --------------------------- PORTFOLIO -------------------------------------
const builds = [
  { title: "Glacier 3070", tags: ["1440p", "Silent"], meta: "Ryzen 5 • RTX 3070 • 32GB", img: "" },
  { title: "Volt 4070S", tags: ["4K Ready", "DLSS 3"], meta: "Ryzen 7 • 4070 SUPER • 32GB", img: "" },
  { title: "Creator Pro", tags: ["Work + Play", "NVMe"], meta: "i7 • RTX 4060 • 64GB", img: "" },
  { title: "Arena Entry", tags: ["1080p", "eSports"], meta: "i5 • RX 6600 • 16GB", img: "" },
];

function Portfolio() {
  return (
    <section id="portfolio" className="relative" style={{ background: theme.bg }}>
      <Container className="py-12 sm:py-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Featured Builds</h2>
          <Button as="a" href="#games" className="border border-white/20 text-foreground hover:bg-white/10" onClick={() => track("cta_portfolio_games") }>
            build <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {builds.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <Card className="overflow-hidden">
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-white/5 to-white/0" />
                <div className="p-4">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {b.tags.map((t) => (
                      <span key={t} className="rounded-full bg-card/70 px-2 py-0.5 text-xs text-foreground/70">{t}</span>
                    ))}
                  </div>
                  <h3 className="text-foreground font-semibold">{b.title}</h3>
                  <p className="text-foreground/60 text-sm">{b.meta}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// --------------------------- SOCIAL PROOF ----------------------------------
function RatingsStrip() {
  return (
    <section aria-label="ratings" className="relative border-t border-border" style={{ background: theme.bg }}>
      <Container className="py-8">
        <div className="flex flex-wrap items-center justify-center gap-6 text-foreground/70">
          <div className="flex items-center gap-2"><Star className="h-5 w-5" /> 4.9/5 Service</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> 500+ Builds Delivered</div>
          <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Genuine Parts</div>
          <div className="flex items-center gap-2"><Truck className="h-5 w-5" /> Free Delivery </div>
        </div>
      </Container>
    </section>
  );
}

// ------------------------------- CTA ---------------------------------------
function BigCTA() {
  return (
    <section id="contact" className="relative" style={{ background: theme.bg }}>
      <Container className="py-14">
        <Card className="p-8 text-center">
          <h2 className="text-3xl font-bold text-foreground">Tell us your games, budget, and screen — we&apos;ll spec the rest.</h2>
          <p className="mx-auto mt-2 max-w-2xl text-foreground/70">WhatsApp us your needs and we&apos;ll reply with 2–3 build options, benchmarks, and upgrade paths.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button as="a" href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" className="bg-white text-black" onClick={() => track("cta_whatsapp_footer") }>
              Start on WhatsApp <MousePointerClick className="h-4 w-4" />
            </Button>
            <Button as="a" href={`mailto:${EMAIL}`} className="border border-white/20 text-foreground hover:bg-white/10" onClick={() => track("cta_email_footer") }>
              Email Us
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}

// ------------------------------ FOOTER -------------------------------------
function Footer() {
  return (
    <footer className="relative border-t border-border" style={{ background: theme.bg }}>
      <Container className="py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-foreground/80">
          <div>
            <div className="text-lg font-semibold text-foreground">Gaming Gear TN</div>
            <p className="mt-2 text-sm text-foreground/60">Custom gaming PCs and full-setup bundles, built and supported in Tunisia.</p>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Shop</div>
            <ul className="mt-2 space-y-2 text-sm text-foreground/70">
              <li><a href="#configure" className="hover:text-foreground">Start a Build</a></li>
              <li><a href="/full-setup" className="hover:text-foreground">Full Setup Bundles</a></li>
              <li><a href="#games" className="hover:text-foreground">Submit Game List</a></li>
              <li><a href="#portfolio" className="hover:text-foreground">Featured Builds</a></li>
              <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Policies</div>
            <ul className="mt-2 space-y-2 text-sm text-foreground/70">
              <li><a href="#" className="hover:text-foreground">Warranty</a></li>
              <li><a href="#" className="hover:text-foreground">Returns</a></li>
              <li><a href="#" className="hover:text-foreground">Privacy</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Follow</div>
            <div className="mt-3 flex items-center gap-3 text-foreground/70">
              <a href="https://www.facebook.com/GamingGearTN" className="hover:text-foreground" target="_blank" rel="noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/gaminggear.tn/" className="hover:text-foreground" target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-foreground/50">© {new Date().getFullYear()} Gaming Gear TN. All rights reserved.</div>
      </Container>
    </footer>
  );
}

// ------------------------------- PAGE --------------------------------------
export default function GamingGearTNLandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    fetchProducts().then((items) => setProducts(items));
  }, []);

  return (
    <main className="min-h-screen" style={{ background: theme.bg }}>
      <Hero />
      <ValueProps />
      <QuickConfiguratorReal />
      <Bundles products={products} />
      <Portfolio />
      <GameListForm />
      <RatingsStrip />
      <BigCTA />
      <Footer />
    </main>
  );
}
