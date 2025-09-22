"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from "./ui/navigation-menu";
import React from "react";
import { CathegoryCollection } from "@prisma/client";


export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [

    {
      href: `/admin/CustomPack`,
      label: 'Custom Pack',
      active: pathname === `/admin/CustomPack`,
    },
    
    {
      href: `/admin/products`,
      label: 'Other Products',
      active: pathname === `/admin/products`,
    },
  
    {
      href: `/admin/Laptop`,
      label: 'Laptops',
      active: pathname === `/admin/Laptop`,
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
      href: `/admin/mainpage`,
      label: 'Mainpage',
      active: pathname === `/admin/mainpage`,
    },
    {
      href: `/admin/Compatibilty-profile`,
      label: 'Compatibilty profile',
      active: pathname === `/admin/Compatibilty-profile`,
    },
    {
      href: `/admin/Build-pc`,
      label: 'Build pc',
      active: pathname === `/admin/Build-pc`,
    },
    
    {
      href: `/admin/settings`,
      label: 'Settings',
      active: pathname === `/admin/settings`,
    },
  ]
  const components: { label: string; href: string,active:boolean }[] = [
 
     {
      href: `/admin/motherboards`,
      label: 'Motherboards',
      active: pathname === `/admin/motherboards`,
    },
    {
      href: `/admin/processors`,
      label: 'Cpus',
      active: pathname === `/admin/processors`,
    },
    {
      href: `/admin/Gpus`,
      label: 'Gpus',
      active: pathname === `/admin/Gpus`,
    },
    {
      href: `/admin/memories`,
      label: 'Ram',
      active: pathname === `/admin/memories`,
    },
    {
      href: `/admin/Storage`,
      label: 'Storage',
      active: pathname === `/admin/Storage`,
    },
    {
      href: `/admin/PowerSuppliy`,
      label: 'Power Suppliy',
      active: pathname === `/admin/PowerSuppliy`,
    },
    {
      href: `/admin/PcCase`,
      label: 'Pc Case',
      active: pathname === `/admin/PcCase`,
    }
    ,
    {
      href: `/admin/Cooling`,
      label: 'Cooling',
      active: pathname === `/admin/Cooling`,
    },
  
    {
      href: `/admin/Screen`,
      label: 'Screen',
      active: pathname === `/admin/Screen`,
    }
  ]
  const accessoriescomponents: { label: string; href: string,active:boolean }[] = [
 
    {
     href: `/admin/keyboard`,
     label: 'keyboards',
     active: pathname === `/admin/keyboard`,
   },
   {
     href: `/admin/Headset`,
     label: 'Headset',
     active: pathname === `/admin/Headset`,
   },
   {
     href: `/admin/Microphone`,
     label: 'Microphone',
     active: pathname === `/admin/Microphone`,
   },
   {
     href: `/admin/Mousepad`,
     label: 'Mousepad',
     active: pathname === `/admin/Mousepad`,
   },
   {
    href: `/admin/Mouse`,
    label: 'Mouse',
    active: pathname === `/admin/Mouse`,
  },
  {
    href: `/admin/Camera`,
    label: 'Camera',
    active: pathname === `/admin/Camera`,
  },
  {
    href: `/admin/Hautparleur`,
    label: 'Hautparleur',
    active: pathname === `/admin/Hautparleur`,
  },
  {
    href: `/admin/Chaisegaming`,
    label: 'Chaisegaming',
    active: pathname === `/admin/Chaisegaming`,
  },
  {
    href: `/admin/Manette`,
    label: 'Manette',
    active: pathname === `/admin/Manette`,
  },
  {
    href: `/admin/Pack`,
    label: 'Pack',
    active: pathname === `/admin/Pack`,
  }
 ]
 const Packs: { label: string; href: string,active:boolean }[] = [
 
  {
   href: `/admin/CustomPack`,
   label: 'Custom Pack',
   active: pathname === `/admin/CustomPack`,
 },
 {
   href: `/admin/UnityScreenPack`,
   label: 'Unity Screen Pack Combo',
   active: pathname === `/admin/UnityScreenPack`,
 }
]
  const isActiveRoute = ( pattern:string) => {
    console.log(`pathname: ${pathname}, pattern: ${pattern}`);
    
    if (pathname.endsWith( "/admin") && pattern.endsWith( "/admin")) {
      return true;
    }
    
    if (pathname.endsWith(pattern)) {
      return true;
    }
  
    return false;
  };
  
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    > 
      <Link
          key={`/admin`}
          href={`/admin`}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            isActiveRoute("/admin") ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {'Overview'}
        </Link>
       <NavigationMenu className="list-none">
            <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium transition-colors hover:text-primary dark:text-white dark:hover:text-white dark:active:text-white">PC Components</NavigationMenuTrigger>
          <NavigationMenuContent  className="dark:bg-slate-950 rounded-lg ">
            <ul className="grid bg-white  dark:bg-slate-950 grid-cols-1  min-w-[800px] ml-[380px] list-none gap-3 p-4  md:grid-cols-2 w-96 ">
              {components.map((component) => (
                <ListItem className="hover:bg-slate-100 min-w-[300px] dark:bg-slate-900"
                  key={component.label}
                  title={component.label}
                  href={component.href}
                >
                Manage your {component.label} list 
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> 
        </NavigationMenu>
       
     <NavigationMenu className="list-none">
            <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium transition-colors hover:text-primary dark:text-white dark:hover:text-white dark:active:text-white">Peripherals</NavigationMenuTrigger>
          <NavigationMenuContent  className="dark:bg-slate-950 rounded-lg ">
          <ul className="grid bg-white  dark:bg-slate-950 grid-cols-1  min-w-[800px] ml-[60px] list-none gap-3 p-4  md:grid-cols-2 w-96 ">
              {accessoriescomponents.map((component) => (
                <ListItem className="hover:bg-slate-100 dark:bg-slate-900"
                  key={component.label}
                  title={component.label}
                  href={component.href}
                >
                 Manage your {component.label} list 
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> 
        </NavigationMenu>
        <NavigationMenu className="list-none">
            <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium transition-colors hover:text-primary dark:text-white dark:hover:text-white dark:active:text-white">Packs</NavigationMenuTrigger>
          <NavigationMenuContent  className="dark:bg-slate-950 rounded-lg ">
            <ul className="grid bg-white  dark:bg-slate-950 grid-cols-1  min-w-[800px] ml-[380px] list-none gap-3 p-4  md:grid-cols-2 w-96 ">
              {Packs.map((component) => (
                <ListItem className="hover:bg-slate-100 min-w-[300px] dark:bg-slate-900"
                  key={component.label}
                  title={component.label}
                  href={component.href}
                >
                Manage your {component.label} list 
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> 
        </NavigationMenu>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            isActiveRoute(route.href) ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-opacity-50 focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
