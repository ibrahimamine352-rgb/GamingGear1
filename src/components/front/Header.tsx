"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import * as React from "react";
import Link from "next/link";
import { Session } from "next-auth";
import UserAccountNav from "../custom/UserAccountNav";
import { Button } from "../ui/button";
import "./Header.css";
import { Category, navitem } from "@prisma/client";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/language-context";
import { UI_TEXT } from "@/i18n/ui-text";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import HeaderNavigation from "./headerNavigation";
import { MainNav } from "./main-nav";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { LocalCathegoryCollection } from "@/app/(admin)/admin/(routes)/mainpage/components/NavbarList";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import NavbarActions from "../navbar-actions";
import {
  ChevronDown,
  Cpu,
  Monitor,
  Package,
  Keyboard,
  Mouse,
  Headphones,
  Laptop,
  X,
  HardDrive,
  Mic2,
  Webcam,
  Battery,
  Gamepad2,
  Fan,
  MemoryStick,
  Camera,
  PanelTop,
  Square,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SignInForm from "@/components/form/SignInForm";
import SignUpForm from "@/components/form/SignUpForm";

interface HeaderProps {
  cathegories?: Category[] | null;
  noscategy: LocalCathegoryCollection[];
  links: navitem[];
  noscategyMobile: LocalCathegoryCollection[];
  linkMobile: navitem[];
}
export default function Header({ 
  cathegories,
  noscategy,
  links,
  noscategyMobile,
  linkMobile,
}: HeaderProps) {
  const [open, setOpen] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const { data: session, status } = useSession();
const { lang } = useLanguage();
  const ui = UI_TEXT[lang];
// Navigation structure
const NAV = {
  Laptops: [{ label: "All Laptops", href: "/shop?categorie=Laptops" }],
  Monitors: [{ label: "All Monitors", href: "/shop?categorie=Monitors" }],
  Components: [
    { label: ui.navCpu, href: "/shop?categorie=CPU", icon: <Cpu className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: ui.navGpu, href: "/shop?categorie=GPU", icon: <Monitor className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: ui.navMotherboards, href: "/shop?categorie=Motherboards", icon: <Package className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: ui.navRam, href: "/shop?categorie=RAM", icon: <MemoryStick className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: ui.navStorage, href: "/shop?categorie=Storage", icon: <HardDrive className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: ui.navPsu, href: "/shop?categorie=PSU", icon: <Battery className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: ui.navCases, href: "/shop?categorie=Cases", icon: <Package className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: ui.navCooling, href: "/shop?categorie=Cooling", icon: <Fan className="h-5 w-5 text-[hsl(var(--promo))]" /> },
  ],
  Peripherals: [
    { label: ui.navKeyboards, href: "/shop?categorie=Keyboards", icon: <Keyboard className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: ui.navMouse, href: "/shop?categorie=Mouse", icon: <Mouse className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: ui.navHeadsets, href: "/shop?categorie=Headsets", icon: <Headphones className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: ui.navMousepads, href: "/shop?categorie=Mousepads", icon: <PanelTop className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: ui.navMicrophones, href: "/shop?categorie=Microphones", icon: <Mic2 className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: ui.navControllers, href: "/shop?categorie=Controllers", icon: <Gamepad2 className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: ui.navCameras, href: "/shop?categorie=Cameras", icon: <Webcam className="h-5 w-5 text-[hsl(var(--promo))]" /> },
  ],

};

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}
function Container({ children, className = "" }: ContainerProps) {
  return <div className={`mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

interface MenuItemProps {
  label: string;
  children: React.ReactNode;
  open: string;
  setOpen: (value: string) => void;
  id: string;
  widthClass?: string;
}
function MenuItem({ label, children, open, setOpen, id, widthClass }: MenuItemProps) {
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(id);
  };
  const closeLater = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(""), 120);
    
  };
  
  return (
    <div className="relative" onMouseEnter={openNow} onMouseLeave={closeLater}>
      <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-foreground/90 hover:text-foreground transition-colors">
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>

      {open === id && (
        <div
          className={cn(
            "header-dd absolute left-0 top-[calc(100%+4px)] z-[6000] rounded-2xl border border-border/60 bg-background/80 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,.45)] pointer-events-auto",
            widthClass ?? "min-w-[980px]"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface MenuColProps {
  title: string;
  items: { label: string; href: string; icon?: React.ReactNode }[];
  icon?: React.ReactNode;
}
function MenuCol({ title, items, icon }: MenuColProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground/70 tracking-wide">
        {icon}
        <span className="uppercase">{title}</span>
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block rounded-lg px-2 py-1 text-sm text-foreground/80 hover:bg-white/10 hover:text-foreground transition-colors"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}


  // NEW: controls the right-side panel inside All Products (desktop)
  const [allTab, setAllTab] =
    useState<"Laptops" | "Monitors" | "Components" | "Peripherals">("Laptops");

  useEffect(() => {
    if (status === "authenticated") setAuthOpen(false);
  }, [status]);

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  return (
    <>
      <div
        id="site-header"
        className="fixed inset-x-0 top-0 z-[40] isolate w-full border-b border-border bg-background/80 backdrop-blur-sm pointer-events-auto"
        onMouseDownCapture={(e) => e.stopPropagation()}
        onTouchStartCapture={(e) => e.stopPropagation()}
      >
        <Container>
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" aria-label="Go to homepage" className="logo-link relative z-[10001] inline-flex items-center">
                <div className="relative ">
                  <Image
                    width={90}
                    height={90}
                    src="/images/new logo.png"
                    className="relative z-10 h-14 w-14 rounded-full max-w-full dark:invert invert-0 hover:brightness-0 hover:saturate-100 hover:hue-rotate-[200deg] transition-all duration-300"
                    alt="Gaming Gear TN Logo"
                  />
                </div>
              </Link>
            </div>

            {/* Right Section */}
<div className="flex items-center space-x-4">
  {/* 🔹 Language switcher on the far right */}
  <LanguageSwitcher />

  {/* Existing actions */}
  <NavbarActions />
  {status === "authenticated" ?  (
    <UserAccountNav />
  ) : (
    <Button
      variant="outline"
      onClick={() => {
        setAuthMode("signin");
        setAuthOpen(true);
      }}
      className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-black font-semibold hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all duration-300 border-0"
    >
        {ui.navSignIn}

    </Button>
  )}
</div>

          </div>
        </Container>

        {/* Navigation Bar */}
        <div className="border-t border-border bg-background/90">
          <Container>
            <div className="flex h-16 items-center justify-between">
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {/* ALL PRODUCTS — vertical flyout (desktop) */}
                <MenuItem label={ui.navAllProducts} open={open} setOpen={setOpen} id="All" widthClass="min-w-[260px]">
                <div className="flex flex-col p-3 space-y-1 max-h-[420px] overflow-y-auto scrollbar-thin">

                    {/* Laptops */}
                    {NAV.Laptops.map((it) => (
                      <a
                        key={it.href}
                        href={it.href}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-white/10 hover:text-foreground transition-colors"
                      >
                        <Laptop className="h-5 w-5 text-[hsl(var(--promo))]" />
                        {it.label}
                      </a>
                    ))}

                    {/* Monitors */}
                    {NAV.Monitors.map((it) => (
                      <a
                        key={it.href}
                        href={it.href}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-white/10 hover:text-foreground transition-colors"
                      >
                        <Monitor className="h-5 w-5 text-[hsl(var(--promo))]" />
                        {it.label}
                      </a>
                    ))}

                    {/* Components */}
                    <div className="pt-2">
                      <div className="px-3 pb-1 text-xs uppercase tracking-wide text-foreground/50">Components</div>
                      <div className="flex flex-col space-y-1">
                        {NAV.Components.map((it) => (
                          <a
                            key={it.href}
                            href={it.href}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-white/10 hover:text-foreground transition-colors"
                          >
                            {it.icon}
                            {it.label}
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Peripherals */}
                    <div className="pt-2">
                      <div className="px-3 pb-1 text-xs uppercase tracking-wide text-foreground/50">Peripherals</div>
                      <div className="flex flex-col space-y-1">
                        {NAV.Peripherals.map((it) => (
                          <a
                            key={it.href}
                            href={it.href}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-white/10 hover:text-foreground transition-colors"
                          >
                            {it.icon}
                            {it.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </MenuItem>

                {/* Builds link */}
                <Link
                  href="/shop?prebuilt=1"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[hsl(var(--promo))] hover:bg-[hsl(var(--accent))/0.08] hover:shadow-[0_0_0_1px_hsl(var(--accent)/0.25),_0_0_18px_hsl(var(--accent)/0.12)] transition-colors"
                >
                  {ui.navBuilds}
                </Link>

                {/* Laptops — direct link */}
                <Link
                  href="/shop?categorie=Laptops"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-foreground/90 hover:text-foreground transition-colors"
                >
                  {ui.navLaptops}
                </Link>

                {/* Monitors — direct link */}
                <Link
                  href="/shop?categorie=Monitors"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-foreground/90 hover:text-foreground transition-colors"
                >
                  {ui.navMonitors}
                </Link>

                {/* Components dropdown (compact) */}
                <MenuItem label={ui.navComponents} open={open} setOpen={setOpen} id="Components" widthClass="min-w-[560px]">
                  <div className="grid grid-cols-2 gap-2 p-3">
                    {NAV.Components.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 rounded-lg p-2 leading-tight text-foreground/80 hover:bg-white/10 hover:text-foreground transition-all duration-200"
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <span className="text-xs md:text-sm">{item.label}</span>
                      </a>
                    ))}
                  </div>
                </MenuItem>

                {/* Peripherals dropdown (compact) */}
                <MenuItem label={ui.navPeripherals} open={open} setOpen={setOpen} id="Peripherals" widthClass="min-w-[440px]">
                  <div className="grid grid-cols-2 gap-2 p-3">
                    {NAV.Peripherals.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 rounded-lg p-2 leading-tight text-foreground/80 hover:bg-white/10 hover:text-foreground transition-all duration-200"
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <span className="text-xs md:text-sm">{item.label}</span>
                      </a>
                    ))}
                  </div>
                </MenuItem>
              </nav>

              {/* Build PC Button and Search Bar (DESKTOP ONLY) */}
              <div className="hidden lg:flex items-center space-x-4">
                <div className="w-48">
                  <SearchBar cats={cathegories} />
                </div>
                <Link href="/build-pc">
                  <Button className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-black font-semibold hover:shadow-[0_0_20px_rgba(0,224,255,0.3)] transition-all duration-300 border-0">
                    <Cpu className="h-4 w-4 mr-2" />
                    {ui.navBuildYourPc}
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu & Search (MOBILE ONLY) */}
              <div className="flex items-center gap-2 lg:hidden">
                {/* Hamburger */}
                <button
                  className="p-2 text-foreground hover:bg-white/10 rounded-lg transition-colors"
                  onClick={toggleMenu}
                  aria-label="Toggle menu"
                >
                  <svg fill="currentColor" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z" />
                  </svg>
                </button>

                {/* Same SearchBar component, constrained width for mobile */}
                <div className="flex-1 min-w-[140px] max-w-[220px] sm:max-w-[260px]">
                  <SearchBar cats={cathegories} />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* === Mobile Menu (unchanged) === */}
      <div className={`${isMenuOpen ? "flex" : "hidden"} fixed inset-x-0 top-[var(--header-h,80px)] bottom-0 z-[6000] lg:hidden`}>
        {/* Scrim */}
        <div className="fixed inset-x-0 top-[var(--header-h,80px)] bottom-0 bg-black/45 backdrop-blur-[1px]" onClick={toggleMenu} />
        {/* Drawer */}
        <div
          className="fixed left-0 top-[var(--header-h,80px)] bottom-0 w-[92vw] max-w-[420px] bg-background/95 backdrop-blur-md
               border-l border-border/10 shadow-[0_10px_40px_rgba(0,0,0,.55)] flex flex-col"
        >
          {/* Drawer header */}
          <div className="sticky top-0 z-10 h-12 flex items-center justify-between px-4 border-b border-border/10 bg-background/95">
  {/* Left: close button */}
  <button
    onClick={toggleMenu}
    className="p-2 text-foreground/80 hover:bg-white/5 rounded-lg transition"
    aria-label="Close"
  >
    <X className="h-5 w-5" />
  </button>

  {/* Right: language switcher on mobile */}
  <LanguageSwitcher />
</div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <Link href="/build-pc" onClick={toggleMenu}>
              <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-black font-semibold border-0 hover:shadow-[0_0_20px_rgba(56,189,248,0.35)]">
                <Cpu className="h-4 w-4 mr-2" />
                {ui.navBuildYourPc}
              </Button>
            </Link>

            <Link href="/shop?prebuilt=1" onClick={toggleMenu} className="block">
              <div className="h-10 grid place-items-start rounded-xl px-3 text-[hsl(var(--promo))] focus:outline-none focus:ring-0">{ui.navBuilds}</div>
            </Link>

            <Link href="/full-setup" onClick={toggleMenu} className="block">
              <div className="h-10 grid place-items-start rounded-xl px-3 text-foreground/90 hover:bg-white/5 focus:outline-none focus:ring-0">{ui.navFullSetup}</div>
            </Link>

            <Accordion type="single" collapsible className="w-full rounded-2xl border border-border/10 overflow-hidden divide-y divide-border/10">
              <AccordionItem value="all" className="border-0">
                <AccordionTrigger className="px-4 py-3 text-foreground/90 hover:text-[hsl(var(--accent))]">{ui.navAllProducts}</AccordionTrigger>
                <AccordionContent className="pb-3">
                  <div className="grid grid-cols-1 gap-2">
                    <Link href="/shop?categorie=Laptops" onClick={toggleMenu} className="block rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5">
                    {ui.navLaptops}
                    </Link>
                    <Link href="/shop?categorie=Monitors" onClick={toggleMenu} className="block rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5">
                    {ui.navMonitors}
                    </Link>

                    <div className="pt-2">
                      <div className="px-4 pb-1 text-xs uppercase tracking-wide text-foreground/50">{ui.navComponents}</div>
                      <div className="mt-1">
                        {NAV.Components.map((it) => (
                          <Link
                            key={it.href}
                            href={it.href}
                            onClick={toggleMenu}
                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5"
                          >
                            {it.icon}
                            <span>{it.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="px-4 pb-1 text-xs uppercase tracking-wide text-foreground/50">{ui.navPeripherals}</div>
                      <div className="mt-1">
                        {NAV.Peripherals.map((it) => (
                          <Link
                            key={it.href}
                            href={it.href}
                            onClick={toggleMenu}
                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5"
                          >
                            {it.icon}
                            <span>{it.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="laptops" className="border-0">
                <AccordionTrigger className="px-4 py-3 text-foreground/90 hover:text-[hsl(var(--accent))]">{ui.navLaptops}</AccordionTrigger>
                <AccordionContent>
                  <Link href="/shop?categorie=Laptops" onClick={toggleMenu} className="block rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5">
                  {ui.navAllLaptops}
                  </Link>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="monitors" className="border-0">
                <AccordionTrigger className="px-4 py-3 text-foreground/90 hover:text-[hsl(var(--accent))]">{ui.navMonitors}</AccordionTrigger>
                <AccordionContent>
                  <Link href="/shop?categorie=Monitors" onClick={toggleMenu} className="block rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5">
                    All Monitors
                  </Link>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="components" className="border-0">
                <AccordionTrigger className="px-4 py-3 text-foreground/90 hover:text-[hsl(var(--accent))]">{ui.navComponents}</AccordionTrigger>
                <AccordionContent className="pb-2">
                  {NAV.Components.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      onClick={toggleMenu}
                      className="flex items-center gap-2 rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5"
                    >
                      {it.icon}
                      <span>{it.label}</span>
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="peripherals" className="border-0">
                <AccordionTrigger className="px-4 py-3 text-foreground/90 hover:text-[hsl(var(--accent))]">{ui.navPeripherals}</AccordionTrigger>
                <AccordionContent className="pb-2">
                  {NAV.Peripherals.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      onClick={toggleMenu}
                      className="flex items-center gap-2 rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5"
                    >
                      {it.icon}
                      <span>{it.label}</span>
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="h-3" />
          </div>
        </div>
      </div>
      {/* === /Mobile Menu === */}

      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
  <DialogContent className="w-[92vw] max-w-md p-6">
    {authMode === "signin" ? (
      <SignInForm
        asModal
        onSwitch={() => setAuthMode("signup")}
        onSuccess={() => setAuthOpen(false)}
      />
    ) : (
      <SignUpForm
        asModal
        onSwitch={() => setAuthMode("signin")}
        onSuccess={() => setAuthMode("signin")}
      />
    )}
  </DialogContent>
</Dialog>
    </>
  );
}
