'use client'
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Cpu, Monitor, Gauge, ShieldCheck, Gift, Zap, Wrench, Star,
  Truck, CheckCircle2, ChevronRight, ChevronDown, MousePointerClick,
  ShoppingCart, Check, HardDrive, Keyboard, Mouse, Headphones, Package, Fan
} from "lucide-react";
import { Product } from '@/types';
import ProductCard from "@/components/ui/product-card";
import Link from "next/link";
import { UI_TEXT } from "@/i18n/ui-text";
import { translateFilterTitle } from "@/i18n/filter-titles";
import { useLanguage } from "@/context/language-context";

// ✅ NEW: dynamic grid for Featured Builds
import FeaturedPrebuiltClient from "@/components/front/featured-prebuilt.client";

const WA_NUMBER = "21627477075";
const EMAIL = "contact@gaminggear.tn";

const ROUTES = {
  
  base: "https://gaminggeartn.tn",
  shop: "https://gaminggeartn.tn/shop",
  build: "https://gaminggeartn.tn/build-pc",
  laptops: "https://gaminggeartn.tn/shop?categorie=Laptops",
  monitors: "https://gaminggeartn.tn/shop?categorie=Monitors",
  components: "https://gaminggeartn.tn/shop?categorie=Components",
  gpus: "https://gaminggeartn.tn/shop?categorie=GPU",
  cpus: "https://gaminggeartn.tn/shop?categorie=CPU",
  motherboards: "https://gaminggeartn.tn/shop?categorie=Motherboards",
  ram: "https://gaminggeartn.tn/shop?categorie=RAM",
  storage: "https://gaminggeartn.tn/shop?categorie=Storage",
  psu: "https://gaminggeartn.tn/shop?categorie=PSU",
  cases: "https://gaminggeartn.tn/shop?categorie=Cases",
  cooling: "https://gaminggeartn.tn/shop?categorie=Cooling",
  keyboards: "https://gaminggeartn.tn/shop?categorie=Keyboards",
  mouse: "https://gaminggeartn.tn/shop?categorie=Mouse",
  headsets: "https://gaminggeartn.tn/shop?categorie=Headsets",
};

const theme = {
  bg: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(217 33% 19%) 60%, hsl(var(--background)) 100%), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 64px)",
  panel: "hsl(var(--card))",
  card: "hsl(var(--card))",
  accent: "#38BDF8",
  accent2: "#0EA5E9",
  text: "#FFFFFF",
  subtext: "#94A3B8",
  line: "hsl(var(--border))",
};

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-card/70 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.02)] ${className}`}>{children}</div>;
}

function Button({ children, className = "", as: As = "button", ...props }: { children: React.ReactNode; className?: string; as?: React.ElementType; [key: string]: any }) {
  return (
    <As className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 font-medium transition hover:translate-y-[-1px] active:translate-y-[0] ${className}`} {...props}>
      {children}
    </As>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px]
            border border-[hsl(var(--promo))] text-[hsl(var(--promo))] bg-transparent
            shadow-[0_0_0_1px_hsl(var(--promo)/0.25),_0_0_12px_hsl(var(--promo)/0.15)]">{children}</span>;
}

function Glow() {return null;
 
}

function MemoryIcon() { return <div className="h-4 w-4 rounded-sm border border-white/40" />; }
function BatteryIcon() {
  return (
    <div className="relative h-3 w-5 rounded-sm border border-white/40">
      <div className="absolute right-[-3px] top-1/2 h-1.5 w-0.5 -translate-y-1/2 rounded-sm bg-card/700" />
    </div>
  );
}

const NAV = {
  
  Laptops: [
    { label: "All Laptops", href: ROUTES.laptops },
    { label: "Gaming 15\"", href: ROUTES.laptops },
    { label: "Gaming 17\"", href: ROUTES.laptops },
    { label: "Creator / Studio", href: ROUTES.laptops },
  ],
  Monitors: [
    { label: "All Monitors", href: ROUTES.monitors },
    { label: "1080p 144–165Hz", href: ROUTES.monitors },
    { label: "1440p 144–170Hz", href: ROUTES.monitors },
    { label: "UltraWide", href: ROUTES.monitors },
  ],
  Components: [
    { label: "Processors (CPU)", href: ROUTES.cpus, icon: <Cpu className="h-4 w-4" /> },
    { label: "Graphics Cards (GPU)", href: ROUTES.gpus, icon: <Monitor className="h-4 w-4" /> },
    { label: "Motherboards", href: ROUTES.motherboards, icon: <Package className="h-4 w-4" /> },
    { label: "Memory (RAM)", href: ROUTES.ram, icon: <MemoryIcon /> },
    { label: "Storage", href: ROUTES.storage, icon: <HardDrive className="h-4 w-4" /> },
    { label: "Power Supplies", href: ROUTES.psu, icon: <BatteryIcon /> },
    { label: "Cases", href: ROUTES.cases, icon: <Package className="h-4 w-4" /> },
    { label: "Cooling", href: ROUTES.cooling, icon: <Fan className="h-4 w-4" /> },
  ],
  Peripherals: [
    { label: "Keyboards", href: ROUTES.keyboards, icon: <Keyboard className="h-4 w-4" /> },
    { label: "Mouse", href: ROUTES.mouse, icon: <Mouse className="h-4 w-4" /> },
    { label: "Headsets", href: ROUTES.headsets, icon: <Headphones className="h-4 w-4" /> },
  ],
  
};

function MenuItem({ label, children, open, setOpen, id }: { label: string; children: React.ReactNode; open: string | null; setOpen: (id: string | null) => void; id: string }) {
  const isOpen = open === id;
  return (
    <div className="relative">
      <button onClick={() => setOpen(isOpen ? "" : id)} className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm ${isOpen ? "bg-white/10" : "hover:bg-white/10"}`}>
        {label} <ChevronDown className="h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-40 min-w-[300px] rounded-2xl border border-border bg-card shadow-xl">
          {children}
        </div>
      )}
    </div>
  );
}

function MenuCol({ title, items, icon }: { title: string; items: any[]; icon: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground/80">{icon}{title}</div>
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i.href}><a href={i.href} className="block rounded-md p-2 text-sm text-foreground/70 hover:bg-white/10 hover:text-foreground">{i.label}</a></li>
        ))}
      </ul>
    </div>
  );
}

function Hero() {
const { lang } = useLanguage();
const ui = UI_TEXT[lang];
  return (
    <section className="relative isolate" style={{ background: theme.bg }}>
      <Glow />
      <Container className="pt-24 pb-10 sm:pt-32">
      <div className="grid items-center gap-10 lg:grid-cols-2">
    {/* LEFT COLUMN — keep your existing content */}
    <div>
      <div className="mb-4 flex items-center gap-3">
        <Badge>
          <Zap className="mr-2 h-3.5 w-3.5" /> Custom Builds, Tuned for Tunisia
        </Badge>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        Build <span className="text-cyan-400">Your Dream Rig</span>.
        <br />
        <span className="text-foreground/90">We make it fast, quiet, and reliable.</span>
      </h1>

      <p className="mt-4 max-w-xl text-base text-foreground/70 sm:text-lg">
        From budget beasts to liquid-cooled monsters — we design, assemble, and stress-test PCs that match your games, workflow, and budget.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:shadow-[0_0_20px_hsl(var(--primary)/0.25)]" as="a" href="/build-pc">
          <Cpu className="h-5 w-5" /> {ui.landingHeroCtaBuild} <ArrowRight className="h-4 w-4" />
        </Button>
        <Button as={Link} href="/full-setup" className="bg-transparent border border-[hsl(var(--promo))] text-foreground hover:text-[hsl(var(--promo))] hover:shadow-[0_0_0_1px_hsl(var(--promo)/0.25),_0_0_20px_hsl(var(--promo)/0.12)]">
          <Monitor className="h-5 w-5" /> {ui.landingfullsetupbundles}
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-6 text-sm text-foreground/60">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[hsl(var(--promo))]" /> {ui.landingHeroWarranty}
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-[hsl(var(--promo))]" /> {ui.landingHeroDelivery}
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-[hsl(var(--promo))]" /> <span className="text-[hsl(var(--promo))]">Stress-Tested</span>
        </div>
      </div>
    </div>

{/* RIGHT COLUMN — video card */}
<div className="min-w-0 lg:w-full lg:max-w-[680px] lg:ml-auto">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <Card className="w-full p-3 border border-[hsl(var(--promo)/0.35)] shadow-[inset_0_0_18px_hsl(var(--promo)/0.12)]">
      {/* keep a faint bg so the stage is visible while the video loads */}
      <div className="w-full overflow-hidden rounded-xl relative bg-white/5" style={{ aspectRatio: '16 / 10' }}>
        <video
          className="absolute inset-0 h-full w-full object-cover rounded-xl"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          controls={false}
  controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"// <-- TEMP for debugging; remove once you see it play
  disablePictureInPicture

  onError={(e) => console.error('VIDEO ERROR', (e.target as HTMLVideoElement).error)}
        >
          {/* H.264 source first (Chrome/Edge/Safari compatible) */}
          <source src="/videos/featured-ryzen7-4070super.mp4" type="video/mp4" />
          {/* If you kept the old name with a space */}
          <source src="/videos/INTRO%20SITE.mp4" type="video/mp4" />
        </video>
      </div>
    </Card>
  </motion.div>
</div>


  </div>
</Container>
      <div className="border-t border-border" />
    </section>
  );
}

const propsData = [
  {
    icon: <Wrench className="h-5 w-5" />,
    title: "Tailored Builds",
    desc: (
      <>
        <span className="text-[hsl(var(--promo))]">Custom PCs</span> designed to match your games,
        resolution, and budget.
      </>
    ),
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Solid Warranty",
    desc: (
      <>
        Reliable <span className="text-[hsl(var(--promo))]">local support</span> from real people.
      </>
    ),
  },
  {
    icon: <Gauge className="h-5 w-5" />,
    title: "Peak Performance",
    desc: "Optimized thermals, quiet operation, and pre-configured settings.",
  },
  {
    icon: <Gift className="h-5 w-5" />,
    title: "Bundle Deals",
    desc: (
      <>
        Tuned for cooling, low noise, and{" "}
        <span className="text-[hsl(var(--promo))]">ready to go</span> performance.
      </>
    ),
  },
];


function ValueProps() {
  return (
    <section className="relative" style={{ background: theme.bg }}>
      <Container className="py-12 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {propsData.map((p, i) => (
            <Card key={i} className="
    relative overflow-hidden p-5 rounded-2xl
    border border-[hsl(var(--promo))] bg-transparent
    ring-1 ring-[hsl(var(--promo)/0.35)] ring-inset
  ">
              <div className="flex items-start gap-3">
                <div className="rounded-xl border border-[hsl(var(--promo)/0.35)] bg-transparent p-2 text-[hsl(var(--promo))]">{p.icon}</div>
                <div>
                  <h3 className="font-semibold text-white">{p.title}</h3>
                  <p className="mt-1 text-sm text-foreground/70">{p.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

const BUNDLES = [
  { id: "starter", title: "Starter Setup", priceFrom: 3299, includes: ["Ryzen 5 / RTX 4060 or RX 6600", "16GB RAM", "500GB NVMe", "24'' 144Hz 1080p", "Mouse + Keyboard"], bestFor: "1080p esports & casual AAA" },
  { id: "balanced", title: "Balanced Setup", priceFrom: 4599, includes: ["i5-13400F or Ryzen 5", "RTX 4060", "32GB RAM", "1TB NVMe", "27'' 1440p 165Hz", "Mech KB + Esports Mouse"], bestFor: "1440p high refresh", featured: true },
  { id: "pro", title: "Pro Gamer Setup", priceFrom: 6799, includes: ["Ryzen 7 7800X3D", "RTX 4070 SUPER", "32GB RAM", "1TB NVMe", "27'' 1440p 165Hz", "Pro peripherals"], bestFor: "1440p ultra / entry 4K" },
];

function Bundles() {
  return (
    <section className="relative border-t border-border" style={{ background: theme.bg }}>
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
                {b.includes.map((i) => (<li key={i} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4" /> {i}</li>))}
              </ul>
              <div className="mt-5 flex items-center gap-3">
                <Button as="a" href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in the ${b.title} bundle (from ${b.priceFrom} TND).`)}`} target="_blank" rel="noreferrer" className="bg-white text-black">
                  Get This Bundle <ArrowRight className="h-4 w-4" />
                </Button>
                <Button as="a" href={ROUTES.build} className="border border-white/20 text-foreground hover:bg-white/10">Customize</Button>
              </div>
            </Card>
          ))}
        </div>
        <Card className="mt-6 p-4">
          <div className="grid grid-cols-4 gap-3 text-xs text-foreground/70">
            <div className="font-semibold text-foreground/90">Compare</div>
            <div>Starter</div><div>Balanced</div><div>Pro</div>
            <div className="font-semibold text-foreground/90">Resolution</div>
            <div>1080p</div><div>1440p</div><div>1440p/4K</div>
            <div className="font-semibold text-foreground/90">GPU Class</div>
            <div>RX 6600 / RTX 4060</div><div>RTX 4060</div><div>RTX 4070 SUPER</div>
            <div className="font-semibold text-foreground/90">RAM</div>
            <div>16GB</div><div>32GB</div><div>32GB</div>
          </div>
        </Card>
      </Container>
    </section>
  );
}

// ✅ REPLACED: dynamic Featured Builds using DB data
function Portfolio() {
  return (
    <section className="relative" style={{ background: theme.bg }}>
      <Container className="py-12 sm:py-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Featured Builds</h2>
          <div className="flex items-center gap-2">
          <Link
  href="/shop?prebuilt=1"
  className="
    rounded-xl px-4 py-2
    bg-transparent
    border border-[hsl(var(--promo))]
    text-foreground
    hover:text-[hsl(var(--promo))]
    hover:shadow-[0_0_0_1px_hsl(var(--promo)/0.25),_0_0_18px_hsl(var(--promo)/0.12)]
  "
>
  See all
</Link>

<Button
  as="a"
  href="/build-pc"
  className="
    bg-transparent
    border border-[hsl(var(--promo))]
    text-foreground
    hover:text-[hsl(var(--promo))]
    hover:shadow-[0_0_0_1px_hsl(var(--promo)/0.25),_0_0_18px_hsl(var(--promo)/0.12)]
  "
>
  Get your tailored build <ChevronRight className="h-4 w-4" />
</Button>
          </div>
        </div>

        {/* pulls real prebuilt PCs (with PreBuiltPcmodel) and only those you marked isFeatured */}
        <FeaturedPrebuiltClient onlyFeatured={true} limit={4} />
      </Container>
    </section>
  );
}

function RatingsStrip() {
  return (
    <section aria-label="ratings" className="relative border-t border-border" style={{ background: theme.bg }}>
      <Container className="py-8">
        <div className="flex flex-wrap items-center justify-center gap-6 text-foreground/70">
          {/* 🔶 make this one orange */}
          <div className="flex items-center gap-2 text-[hsl(var(--promo))]">
            <Star className="h-5 w-5" /> 4.9/5 Service
          </div>

          {/* keep default */}
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" /> 500+ Builds Delivered
          </div>

          {/* keep default */}
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" /> Genuine Parts
          </div>

          {/* 🔶 and this one orange */}
          <div className="flex items-center gap-2 text-[hsl(var(--promo))]">
            <Truck className="h-5 w-5" /> Free Delivery
          </div>
        </div>
      </Container>
    </section>
  );
}

function BigCTA() {
  return (
    <section className="relative" style={{ background: theme.bg }}>
      <Container className="py-14">
        <Card className="p-8 text-center">
          <h2 className="text-3xl font-bold text-foreground">Tell us your games, budget, and screen — we&apos;ll spec the rest.</h2>
          <p className="mx-auto mt-2 max-w-2xl text-foreground/70">WhatsApp us your needs and we&apos;ll reply with 2–3 build options, benchmarks, and upgrade paths.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button as="a" href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" className="bg-white text-black">
              Start on WhatsApp <MousePointerClick className="h-4 w-4" />
            </Button>
            <Button as="a" href={`mailto:${EMAIL}`} className="border border-white/20 text-foreground hover:bg-white/10">
              Email Us
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}

interface NewLandingProps {
  slides: any[];
  featured: Product[];
}

const NewLanding: React.FC<NewLandingProps> = ({ slides, featured }) => {
  const [openBuild] = useState(false);
  const [openSearch] = useState(false);

  return (
    <main className="min-h-screen" style={{ background: theme.bg }}>
      <Hero />
      <ValueProps />

      {/* Featured Products Section */}
      <section className="relative" style={{ background: theme.bg }}>
        <Container className="py-12 sm:py-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Featured Products</h2>
            <div className="text-sm flex items-center gap-2 text-[hsl(var(--promo))]">
              <ShoppingCart className="h-4 w-4" /> Premium Gaming Gear
            </div>
          </div>

          <div className="featured-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProductCard data={product} />
              </motion.div>
            ))}
          </div>
        </Container>

        <style jsx global>{`
          .featured-grid svg[data-lucide="expand"] { display: none !important; }
        `}</style>
      </section>

      <Portfolio />
      <RatingsStrip />
      <BigCTA />
    </main>
  );
};

export default NewLanding;
