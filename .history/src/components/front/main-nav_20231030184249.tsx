"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/shop?page=1&category=motherboards`,
      label: 'Mother boards',
      active: pathname === `/`,
    },
    {
      href: `/shop?page=1&category=processors`,
      label: 'Processors',

    },
    {
      href: `/shop?page=1&category=memories`,
      label: 'Memories',
      
    },
    {
      href: `/shop?page=1&category=cathegoryboards`,
      label: 'Cathegory Boards',
    
    },
  

    
 
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-yellow-700',
            route.active ? ' text-amber-500' : 'text-black'
          )}
        >
          {route.label}
      </Link>
      ))}
    </nav>
  )
};
