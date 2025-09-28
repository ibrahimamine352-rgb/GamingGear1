"use client";
import { useEffect } from "react"
import { useSession } from "next-auth/react"

import { useState } from 'react';
import * as React from "react"
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Session } from 'next-auth';
import UserAccountNav from '../custom/UserAccountNav';
import { Button, buttonVariants } from '../ui/button';
import './Header.css'
import { Category, navitem } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
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
} from "@/components/ui/command"
import HeaderNavigation from './headerNavigation';
import { MainNav } from './main-nav';
import Image from 'next/image';
import SearchBar from './SearchBar';
import { LocalCathegoryCollection } from '@/app/(admin)/admin/(routes)/mainpage/components/NavbarList';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import NavbarActions from '../navbar-actions';
import { ChevronDown, Cpu, Monitor, Package, Keyboard, Mouse, Headphones, Laptop, Search, X, HardDrive, Battery, Fan, MemoryStick } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog"
import SignInForm from "@/components/form/SignInForm"
import SignUpForm from "@/components/form/SignUpForm"
interface HeaderProps {
  session?: Session | null;
  cathegories?: Category[] | null
  noscategy: LocalCathegoryCollection[]
  links: navitem[]
  noscategyMobile: LocalCathegoryCollection[]
  linkMobile: navitem[]
}

// Navigation structure matching the new design
const NAV = {
  Laptops: [
    { label: "All Laptops", href: "/shop?categorie=Laptops" },
  ],
  Monitors: [
    { label: "All Monitors", href: "/shop?categorie=Monitors" },
    
  ],
  Components: [
    { label: "Processors (CPU)", href: "/shop?categorie=CPU", icon: <Cpu className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: "Graphics Cards (GPU)", href: "/shop?categorie=GPU", icon: <Monitor className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: "Motherboards", href: "/shop?categorie=Motherboards", icon: <Package className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: "Memory (RAM)", href: "/shop?categorie=RAM", icon: <MemoryStick className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: "Storage", href: "/shop?categorie=Storage", icon: <HardDrive className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: "Power Supplies", href: "/shop?categorie=PSU", icon: <Battery className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: "Cases", href: "/shop?categorie=Cases", icon: <Package className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: "Cooling", href: "/shop?categorie=Cooling", icon: <Fan className="h-5 w-5 text-[hsl(var(--promo))]" /> },
  ],
  Peripherals: [
    { label: "Keyboards", href: "/shop?categorie=Keyboards", icon: <Keyboard className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: "Mouse", href: "/shop?categorie=Mouse", icon: <Mouse className="h-5 w-5 text-[hsl(var(--promo))]" /> },
    { label: "Headsets", href: "/shop?categorie=Headsets", icon: <Headphones className="h-5 w-5 text-[hsl(var(--promo))]" /> },
  ],
};

// Helper components from the new design
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
}

function MenuItem({ label, children, open, setOpen, id }: MenuItemProps) {
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(id)
  }
  const closeLater = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(""), 120) // small grace
  }

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeLater}
    >
      <button
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-foreground/90 hover:text-foreground transition-colors"
      >
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>

      {open === id && (
        <div
          className="
            header-dd absolute left-0 top-[calc(100%+4px)]
            z-[6000] min-w-[980px] rounded-2xl
            border border-border/60 bg-background/80 backdrop-blur-md
            shadow-[0_8px_40px_rgba(0,0,0,.45)]
            pointer-events-auto
          "
        >
          {children}
        </div>
      )}
    </div>
  )
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

export default function Header({ session, cathegories, noscategy, links, noscategyMobile, linkMobile }: HeaderProps) {
  const [open, setOpen] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const { status } = useSession()
  useEffect(() => {
    if (status === "authenticated") setAuthOpen(false)
  }, [status])
  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
              <Link href="/" aria-label="Go to homepage" className="logo-link relative z-[10001] inline-flex items-center"
              >
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
              <NavbarActions />
              {session ? (
                <UserAccountNav />
              ) : (
                
                  <Button 
                    variant="outline" 
                    onClick={() => { setAuthMode("signin"); setAuthOpen(true); }}
                    className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-black font-semibold hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all duration-300 border-0"
                  >
                    Sign in
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
             
  <Link
    href="/shop?prebuilt=1"
    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[hsl(var(--promo))]
               hover:bg-[hsl(var(--accent))/0.08] hover:shadow-[0_0_0_1px_hsl(var(--accent)/0.25),_0_0_18px_hsl(var(--accent)/0.12)]
               transition-colors"
  >
  
     Builds
  </Link>
                <MenuItem label="All Products" open={open} setOpen={setOpen} id="All">
                <div className="grid grid-cols-4 gap-x-8 p-6 divide-x divide-border/50 [&>*]:px-6">
                   <MenuCol title="Laptops" items={NAV.Laptops} icon={<Laptop className="h-5 w-5 text-[hsl(var(--promo))]" />} />
                   <MenuCol title="Monitors" items={NAV.Monitors} icon={<Monitor className="h-5 w-5 text-[hsl(var(--promo))]" />} />
                   <MenuCol title="Components" items={NAV.Components} icon={<Package className="h-5 w-5 text-[hsl(var(--promo))]" />} />
                   <MenuCol title="Peripherals" items={NAV.Peripherals} icon={<Keyboard className="h-5 w-5 text-[hsl(var(--promo))]" />} />
                </div>
                </MenuItem>

                {/* Laptops — direct link (no dropdown) */}
                <Link
                  href="/shop?categorie=Laptops"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-foreground/90 hover:text-foreground transition-colors"
                >
                  Laptops
                </Link>

                {/* Monitors — direct link (no dropdown) */}
                <Link
                  href="/shop?categorie=Monitors"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-foreground/90 hover:text-foreground transition-colors"
                >
                  Monitors
                </Link>

                {/* Keep dropdowns for Components & Peripherals */}
                <MenuItem label="Components" open={open} setOpen={setOpen} id="Components">
                  <div className="grid gap-3 p-4 md:grid-cols-3">
                    {NAV.Components.map((item) => (
                      <a key={item.href} href={item.href} className="flex items-center gap-2 rounded-lg p-2 text-foreground/80 hover:bg-white/10 hover:text-foreground transition-all duration-200">
                        {item.icon}
                        <span>{item.label}</span>
                      </a>
                    ))}
                  </div>
                </MenuItem>
                
                <MenuItem label="Peripherals" open={open} setOpen={setOpen} id="Peripherals">
                  <div className="grid gap-3 p-4 md:grid-cols-2">
                    {NAV.Peripherals.map((item) => (
                      <a key={item.href} href={item.href} className="flex items-center gap-2 rounded-lg p-2 text-foreground/80 hover:bg-white/10 hover:text-foreground transition-all duration-200">
                        {item.icon}
                        <span>{item.label}</span>
                      </a>
                    ))}
                  </div>
                </MenuItem>
              </nav>

              {/* Build PC Button and Search Bar */}
              <div className="hidden lg:flex items-center space-x-4">
                <div className="w-48">
                  <SearchBar cats={cathegories} />
                </div>
                <Link href="/build-pc">
                  <Button className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-black font-semibold hover:shadow-[0_0_20px_rgba(0,224,255,0.3)] transition-all duration-300 border-0">
                    <Cpu className="h-4 w-4 mr-2" />
                    Build Your PC
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-foreground hover:bg-white/10 rounded-lg transition-colors"
                onClick={toggleMenu}
              >
                <svg fill="currentColor" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z"/>
                </svg>
              </button>
            </div>
          </Container>
        </div>
      </div>

    
     {/* Mobile Menu */}
{/* === Mobile Menu (styled, scrollable) === */}
<div className={`${isMenuOpen ? "flex" : "hidden"} fixed inset-x-0 top-[var(--header-h,80px)] bottom-0 z-[6000] lg:hidden`}>

  {/* Scrim */}
  <div
    className="fixed inset-x-0 top-[var(--header-h,80px)] bottom-0 bg-black/45 backdrop-blur-[1px]"
    onClick={toggleMenu}
  />

  {/* Drawer */}
  <div
    className="fixed left-0 top-[var(--header-h,80px)] bottom-0
               w-[92vw] max-w-[420px]
               bg-background/95 backdrop-blur-md
               border-l border-border/10
               shadow-[0_10px_40px_rgba(0,0,0,.55)]
               flex flex-col"
  >
    {/* Drawer header (keeps your close button) */}
    <div className="sticky top-0 z-10 h-12 flex items-center justify-between px-4
                    border-b border-border/10 bg-background/95">
      
      <button
        onClick={toggleMenu}
        className="p-2 text-foreground/80 hover:bg-white/5 rounded-lg transition"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
    </div>

    {/* Content (SCROLLS) */}
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {/* Build Your PC — unchanged behavior, only styling */}
      <Link href="/build-pc" onClick={toggleMenu}>
        <Button
          className="w-full h-11 rounded-xl
                     bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9]
                     text-black font-semibold border-0
                     hover:shadow-[0_0_20px_rgba(56,189,248,0.35)]"
        >
          <Cpu className="h-4 w-4 mr-2" />
          Build Your PC
        </Button>
      </Link>

      
      

      <Link href="/shop?prebuilt=1" onClick={toggleMenu} className="block">
        <div className="h-10 grid place-items-start rounded-xl px-3
                  text-[hsl(var(--promo))]
                 
                  focus:outline-none focus:ring-0">
          Builds
        </div>
      </Link>
      {/* Full Setup (mobile only) */}
<Link href="/full-setup" onClick={toggleMenu} className="block">
  <div className="h-10 grid place-items-start rounded-xl px-3
                  text-foreground/90
                  hover:bg-white/5
                  focus:outline-none focus:ring-0">
    Full Setup
  </div>
</Link>

      {/* Mobile “All Products” + sections (mirrors desktop) */}
      <Accordion
        type="single"
        collapsible
        className="w-full rounded-2xl border border-border/10 overflow-hidden divide-y divide-border/10"
      >
        {/* All Products */}
        <AccordionItem value="all" className="border-0">
          <AccordionTrigger className="px-4 py-3 text-foreground/90 hover:text-[hsl(var(--accent))]">
            All Products
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <div className="grid grid-cols-1 gap-2">
              <Link href="/shop?categorie=Laptops" onClick={toggleMenu} className="block rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5">
                Laptops
              </Link>
              <Link href="/shop?categorie=Monitors" onClick={toggleMenu} className="block rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5">
                Monitors
              </Link>

              <div className="pt-2">
                <div className="px-4 pb-1 text-xs uppercase tracking-wide text-foreground/50">Components</div>
                <div className="mt-1">
                  {NAV.Components.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      onClick={toggleMenu}
                      className="flex items-center gap-2 rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5"
                    >
                      {it.icon}<span>{it.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <div className="px-4 pb-1 text-xs uppercase tracking-wide text-foreground/50">Peripherals</div>
                <div className="mt-1">
                  {NAV.Peripherals.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      onClick={toggleMenu}
                      className="flex items-center gap-2 rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5"
                    >
                      {it.icon}<span>{it.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Laptops */}
        <AccordionItem value="laptops" className="border-0">
          <AccordionTrigger className="px-4 py-3 text-foreground/90 hover:text-[hsl(var(--accent))]">
            Laptops
          </AccordionTrigger>
          <AccordionContent>
            <Link href="/shop?categorie=Laptops" onClick={toggleMenu} className="block rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5">
              All Laptops
            </Link>
          </AccordionContent>
        </AccordionItem>

        {/* Monitors */}
        <AccordionItem value="monitors" className="border-0">
          <AccordionTrigger className="px-4 py-3 text-foreground/90 hover:text-[hsl(var(--accent))]">
            Monitors
          </AccordionTrigger>
          <AccordionContent>
            <Link href="/shop?categorie=Monitors" onClick={toggleMenu} className="block rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5">
              All Monitors
            </Link>
          </AccordionContent>
        </AccordionItem>

        {/* Components */}
        <AccordionItem value="components" className="border-0">
          <AccordionTrigger className="px-4 py-3 text-foreground/90 hover:text-[hsl(var(--accent))]">
            Components
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            {NAV.Components.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={toggleMenu}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5"
              >
                {it.icon}<span>{it.label}</span>
              </Link>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Peripherals */}
        <AccordionItem value="peripherals" className="border-0">
          <AccordionTrigger className="px-4 py-3 text-foreground/90 hover:text-[hsl(var(--accent))]">
            Peripherals
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            {NAV.Peripherals.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={toggleMenu}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5"
              >
                {it.icon}<span>{it.label}</span>
              </Link>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* bottom padding for iOS safe area */}
      <div className="h-3" />
    </div>
  </div>
</div>
{/* === /Mobile Menu === */}


      <AlertDialog open={authOpen} onOpenChange={setAuthOpen}>
  <AlertDialogContent className="w-[92vw] max-w-md p-6">
    {authMode === "signin" ? (
      <SignInForm
        asModal
        onSwitch={() => setAuthMode("signup")}
        onSuccess={() => setAuthOpen(false)}   // 👈 close after successful sign-in
      />
    ) : (
      <SignUpForm
        asModal
        onSwitch={() => setAuthMode("signin")}
        onSuccess={() => setAuthMode("signin")} // 👈 after sign-up, switch to sign-in
      />
    )}
  </AlertDialogContent>
</AlertDialog>

    </>
  );
}
