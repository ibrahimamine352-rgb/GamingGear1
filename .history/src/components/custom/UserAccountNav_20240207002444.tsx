'use client'
import React from 'react'
import { Button, buttonVariants } from '../ui/button'
import { signOut } from 'next-auth/react'

const UserAccountNav = () => {
  return (
    <div><Button className={buttonVariants()+" bg-[#673AB7] dark:bg-white"} onClick={()=>signOut()}>
    Sing Out
  </Button></div>
  )
}

export default UserAccountNav