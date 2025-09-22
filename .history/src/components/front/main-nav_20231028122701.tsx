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
      href: `/`,
      label: 'Mother boards',
      active: pathname === `/`,
    },
    {
      href: `/admin/motherboards`,
      label: 'Motherboards',
      active: pathname === `/admin/motherboards`,
    },
    {
      href: `/admin/processors`,
      label: 'Processors',
      active: pathname === `/admin/processors`,
    },
    {
      href: `/admin/memories`,
      label: 'Memories',
      active: pathname === `/admin/memories`,
    },
    {
      href: `/admin/cathegoryboards`,
      label: 'Cathegory Boards',
      active: pathname === `/admin/cathegoryboards`,
    },
    {
      href: `/admin/products`,
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
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
      </Link>
      ))}
    </nav>
  )
};
