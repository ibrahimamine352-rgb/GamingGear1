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
      href: `/shop?page=1&category=Motherboards`,
      label: 'Mother boards',
      active: pathname === `/`,
    },
    {
      href: `/shop?page=1&category=Motherboards`,
      label: 'Processors',
      active: pathname === `/admin/processors`,
    },
    {
      href: `/shop?page=1&category=Motherboards`,
      label: 'Memories',
      active: pathname === `/admin/memories`,
    },
    {
      href: `/shop?page=1&category=Motherboards`,
      label: 'Cathegory Boards',
      active: pathname === `/admin/cathegoryboards`,
    },
    {
      href: `/shop?page=1&category=Motherboards`,
      label: 'Products',
      active: pathname === `/admin/products`,
    },
    
    {
      href: `/admin/categories`,
      label: 'Categories',
      active: pathname === `/admin/categories`,
    },
    
    {
      href: `/admin/orders`,
      label: 'Orders',
      active: pathname === `/admin/orders`,
    },
    
    
 
    {
      href: `/admin/settings`,
      label: 'Settings',
      active: pathname === `/admin/settings`,
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
