"use client";


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
import { ThemeToggle } from '../theme-toggle';
import HeaderNavigation from './headerNavigation';
import { MainNav } from './main-nav';
import Image from 'next/image';
import SearchBar from './SearchBar';
import { LocalCathegoryCollection } from '@/app/(admin)/admin/(routes)/mainpage/components/NavbarList';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import NavbarActions from '../navbar-actions';


interface HeaderProps {
  session?: Session | null; // Define the session prop
  cathegories?: Category[] | null
  noscategy: LocalCathegoryCollection[]
  links: navitem[]
  noscategyMobile:LocalCathegoryCollection[]
  linkMobile:navitem[]
}

const Header: React.FC<HeaderProps> = ({ session, cathegories, noscategy, links,noscategyMobile ,linkMobile}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop !== 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const backgroundStyle = isScrolled
    ? {
      opacity: '1',
      position: 'sticky' as 'sticky', // Type assertion
      top: 0 as 0, // Type assertion
      zIndex: 50,
    }
    : {
      opacity: '1',
      position: 'sticky' as 'sticky', // Type assertion
      top: 'auto' as 'auto', // Type assertion
      zIndex: 1,
    };

  return (
    <> 
  
      <div className='content sticky top-0 z-50'>
    

        <div className="  border-b-slate-800  bg-opacity-100 dark:bg-opacity-90 navBar " style={backgroundStyle}>
      
      <> 
      {session?.user.role === "admin" ? (<Link href={"/admin"} rel="noopener noreferrer" target="_blank">
        <button className='bg-red-500 w-full text-white '>Admin Panel</button></Link>) : <></>}
    </>
          <div className="grid grid-cols-3  max-sm:grid-cols-none max-sm:flex items-center  content-around justify-between">
            <div className='w-full p-3 max-sm:hidden'>
              <SearchBar cats={cathegories}  />
            </div>



            <Link href={'/'}>
              <div className="flex  items-center  content-around w-full  justify-center align-middle">



                <div className="m-5  text-xl font-bold relative logo-container flex  content-center items-center align-middle">
                  <div className="image-container">
                    <div className="block1 rounded-full">
                      <Image width={70} height={70}
                        src="/images/logo (3).png"
                        className="h-10 w-10  rounded-full max-w-full"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className='max-md:mx-auto px-3 title ml-2 font-semibold '>Gaming Gear TN</div>

                </div>





              </div></Link>


            <div className=" flex items-center justify-end space-x-3">
            <NavbarActions/>
             
              <div className='max-sm:hidden'>
                {session ? (<UserAccountNav />) : <Link href='/sign-in'>
                  <Button variant={"default"} className=''> Sign in</Button>

                </Link>}
              </div>


              <div className='pr-5'>       <ThemeToggle /></div>


            </div>
          </div>
          <div className='w-full p-3 hidden max-sm:flex'>
          <Button className=' p-2 mr-2' variant={'outline'} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg fill="currentColor" height="24" width="24"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/></svg>
            </Button>
            <div className='w-full mx-0  '><SearchBar cats={cathegories} /></div>

            
          </div>
        </div>

        <div >
          <div className="  items-center align-middle  h-[56px] hidden sm:flex justify-center">
            <div className=" tr-left  z-30 ">

            </div >
            <div className="w-full bg-white shadow-md shadow-zinc-500  drop-shadow-sm  flex justify-center h-14 ">
              <div className='m-auto flex justify-center'>
                <HeaderNavigation links={links} noscategy={noscategy} cathegories={cathegories} />
                <Link href={"build-pc"}>
               
                <Button className='ml-5 dark:bg-[#673AB7] dark:text-white bg-[#673AB7]' variant={'default'} >
                  Build your pc
                </Button> </Link>
              </div>




            </div>
            <div className=" tr-right border-l-white ">

            </div >
          </div>
        </div>
      </div>




      <div className={` ${isMenuOpen ? 'flex' : 'hidden'} text-md fixed left-0 w-full h-full bottom-0  flex-col dark:bg-[#121212f5] bg-[#fffffff5] opacity-100 z-50`}>
        <div className=' overflow-y-auto overscroll-x-none overflow-x-clip pr-3 w-full'>


        <div className='flex justify-end w-full '>
          <Button onClick={() => setIsMenuOpen(!isMenuOpen)} className='m-3 ' variant={'ghost'}>

            <svg fill="currentColor" height="20" width="20" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 297 297" >

              <path d="M221.489,92.552c-26.303-26.474-60.365-42.391-97.105-45.635l24.789-28.828c1.612-1.877,2.062-4.488,1.169-6.795
			c-0.892-2.307-2.982-3.935-5.438-4.237l-57.06-7.006c-2.225-0.277-4.441,0.583-5.904,2.284L31.262,61.272
			c-1.766,2.054-2.123,4.967-0.907,7.387l34.913,69.446c1.008,2.003,2.95,3.371,5.176,3.644l57.059,7.006
			c2.455,0.308,4.89-0.778,6.312-2.81c1.423-2.033,1.608-4.683,0.482-6.893l-18.08-35.478
			c52.329,5.561,94.611,49.316,94.611,100.486v86.232c0,3.705,3.003,6.708,6.708,6.708h43.115c3.705,0,6.708-3.003,6.708-6.708
			V204.06C267.359,161.924,251.068,122.323,221.489,92.552z"/>

            </svg>

          </Button>

        </div>
        <Link href={"build-pc"} onClick={()=>setIsMenuOpen(!isMenuOpen)}>
               
                <Button className='ml-5 dark:bg-[#673AB7] dark:text-white bg-[#673AB7]' variant={'default'} >
                  Build your pc
                </Button> </Link>
        <Accordion className='w-full' type="single" collapsible>
          {linkMobile.map((linkk) => (<>
            {linkk.link.length > 0 ? <>
              <NavigationMenuItem className='w-full list-none' >
              <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  href={'' + linkk.link}>  
                  <Button  
                  className="rounded-none list-none bg-[#ccc1df] dark:border-0 dark:bg-[#5d3c96] dark:text-white text-black w-full bg-opacity-50 rounded-sm text-center border-1 border-[#673AB7] my-2 py-2 " >
                 
                  {linkk.label} 
                  </Button>
                  </Link>

             
              </NavigationMenuItem>


            </> : <>
              <AccordionItem className='px-3' value={linkk.id}>
                <AccordionTrigger>{linkk.label}</AccordionTrigger>
                <AccordionContent>
                  <Accordion type="single" collapsible>
                  {
                  noscategyMobile.map((item,keyy)=>(<>
                  {item.navitemId=== linkk.id?<>
                    <AccordionItem value={item.id}>
                      <AccordionTrigger   className='active:text-[#673AB7] focus:text-[#673AB7] text-  px-10 '>{item.Label}</AccordionTrigger>
                      <AccordionContent key={item.id}>
                        {
                          noscategyMobile[keyy].CathegoryCollectiondata.map((i)=>(<>
                           <NavigationMenuItem className="px-5  list-none">
                           <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  href={`/shop?categorie=${i.Label}`} >  
                <Button
                  className="m-2 mx-2 list-none  dark:border-0 dark:bg-[#262626ab] dark:text-white bg-orange-50 text-black w-full bg-opacity-50 rounded-sm text-center border-1 border-orange-100  py-2 " >
            
                  {i.Label} 
                  </Button></Link>
              </NavigationMenuItem>

                  
                          </>))
                        }
                      </AccordionContent>
                    </AccordionItem>
                  </>:<></>


                  }
                 
                  </>))
                 }
                 
                  </Accordion>
                </AccordionContent>
              </AccordionItem>

            </>}</>))}

        </Accordion>
      </div>        </div>
    </>
  );
}
export default Header