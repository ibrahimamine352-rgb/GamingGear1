'use client'
import React from 'react'
import { Button, buttonVariants } from '../ui/button'
import { signOut } from 'next-auth/react'
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/language-context";
import { UI_TEXT } from "@/i18n/ui-text";
const UserAccountNav = () => {
  const { lang } = useLanguage();
  const ui = UI_TEXT[lang];

  return (
    <div><Button className="text-foreground bg-black hover:border-[hsl(var(--promo))]" variant="outline" onClick={()=>signOut()}>
   {ui.navSignout}
  </Button></div>
  )
}

export default UserAccountNav