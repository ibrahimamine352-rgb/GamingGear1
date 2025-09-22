'use client'
import React from 'react'
import { Button, buttonVariants } from '../ui/button'
import { signOut } from 'next-auth/react'

const UserAccountNav = () => {
  return (
    <div><Button className="text-foreground bg-black hover:border-[hsl(var(--promo))]" variant="outline" onClick={()=>signOut()}>
    Sign Out
  </Button></div>
  )
}

export default UserAccountNav