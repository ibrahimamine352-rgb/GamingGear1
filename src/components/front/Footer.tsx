'use client';

import Image from 'next/image'
import React from 'react'
import { UI_TEXT } from "@/i18n/ui-text";
import { useLanguage } from "@/context/language-context";

const Footer = () => {
    const { lang } = useLanguage();
    const ui = UI_TEXT[lang];
    return (
        <div>
            <footer className="bg-background text-foreground border-t border-border/10">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Logo and Description */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    
                                    <div className="relative">
                                        <Image 
                                            width={40} 
                                            height={40}
                                            src="/images/new logo.png"
                                            className="h-10 w-10 rounded-full max-w-full dark:invert invert-0 hover:brightness-0 hover:saturate-100 hover:hue-rotate-[200deg] transition-all duration-300"
                                            alt="Gaming Gear TN Logo"
                                        />
                                    </div>
                                </div>
                                <span className="text-xl font-bold text-foreground">Gaming Gear TN</span>
                            </div>
                            <p className="text-foreground/70 leading-relaxed">
                                Votre escale exclusive pour des PC et périphériques haut de gamme, rehaussant votre expérience informatique avec élégance et performance incomparables.
                            </p>
                        </div>

                        {/* Useful Links */}
                        <div className="space-y-4">
                            <h6 className="text-lg font-semibold text-foreground border-b border-border/10 pb-2">
                              {ui.landingutilslink}
                            </h6>
                            <div className="space-y-3">
                                <a href="/shop" className="flex items-center text-foreground/70 hover:text-accent transition-colors group">
                                    <span className="text-xs mr-2 group-hover:translate-x-1 transition-transform">&gt;&gt;</span>
                                    {ui.navAllProducts}
                                </a>
                                <a href="/build-pc" className="flex items-center text-foreground/70 hover:text-accent transition-colors group">
                                    <span className="text-xs mr-2 group-hover:translate-x-1 transition-transform">&gt;&gt;</span>
                                    {ui.navBuildYourPc}
                                </a>
                                <a href="/cart" className="flex items-center text-foreground/70 hover:text-accent transition-colors group">
                                    <span className="text-xs mr-2 group-hover:translate-x-1 transition-transform">&gt;&gt;</span>
                                    {ui.cartEmptyTitle}
                                </a>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-4">
                            <h6 className="text-lg font-semibold text-foreground border-b border-border/10 pb-2">
                                Contact
                            </h6>
                            <div className="space-y-3">
                                <a 
                                    target="_blank" 
                                    href="https://www.facebook.com/people/Gaming-Gear-TN/100093378131068/" 
                                    className="flex items-center text-foreground/70 hover:text-accent transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-3 h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                    </svg>
                                    Gaming Gear TN
                                </a>
                                <a 
                                    target="_blank" 
                                    href="https://www.instagram.com/gaminggear.tn" 
                                    className="flex items-center text-foreground/70 hover:text-accent transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-3 h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                    Gaming Gear TN
                                </a>
                                <div className="flex items-center text-foreground/70">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="mr-3 h-5 w-5">
                                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                    </svg>
                                    GamingGear.tn@gmail.com
                                </div>
                                <div className="flex items-center text-foreground/70">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="mr-3 h-5 w-5">
                                        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                                    </svg>
                                    +216 27 477 075
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-border/10 bg-background/80 backdrop-blur-sm">
                    <div className="container mx-auto px-6 py-6 text-center">
                        <span className="text-foreground/60">© 2023 Copyright: </span>
                        <a 
                            className="font-semibold text-accent hover:text-primary transition-colors"
                            href="#"
                        > 
                            Gaming Gear TN
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer