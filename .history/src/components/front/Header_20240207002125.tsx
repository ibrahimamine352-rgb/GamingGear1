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
}

const Header: React.FC<HeaderProps> = ({ session, cathegories, noscategy, links }) => {
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
    

        <div className="dark:bg-black border-b-2  border-b-slate-800 bg-white bg-opacity-100 dark:bg-opacity-90  " style={backgroundStyle}>
      
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
                  <Button variant={"default"} className='bg-[#673AB7]'> Sign in</Button>

                </Link>}
              </div>


              <div className='pr-5'>       <ThemeToggle /></div>


            </div>
          </div>
          <div className='w-full p-3 hidden max-sm:flex'>
            <div className='w-full mx-0 '><SearchBar cats={cathegories} /></div>

            <Button variant={'ghost'} onClick={() => setIsMenuOpen(!isMenuOpen)}>

              <svg fill="currentColor" height="20" width="20" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 297 297">
                <g>
                  <g>
                    <g>
                      <path d="M66.102,0H15.804C7.089,0,0,7.089,0,15.804v50.298c0,8.715,7.089,15.804,15.804,15.804h50.298
				c8.715,0,15.804-7.089,15.804-15.804V15.804C81.907,7.089,74.817,0,66.102,0z"/>
                      <path d="M173.649,0h-50.298c-8.715,0-15.804,7.089-15.804,15.804v50.298c0,8.715,7.089,15.804,15.804,15.804h50.298
				c8.715,0,15.804-7.089,15.804-15.804V15.804C189.453,7.089,182.364,0,173.649,0z"/>
                      <path d="M66.102,107.547H15.804C7.089,107.547,0,114.636,0,123.351v50.298c0,8.715,7.089,15.804,15.804,15.804h50.298
				c8.715,0,15.804-7.089,15.804-15.804v-50.298C81.907,114.636,74.817,107.547,66.102,107.547z"/>
                      <path d="M173.649,107.547h-50.298c-8.715,0-15.804,7.089-15.804,15.804v50.298c0,8.715,7.089,15.804,15.804,15.804h50.298
				c8.715,0,15.804-7.089,15.804-15.804v-50.298C189.453,114.636,182.364,107.547,173.649,107.547z"/>
                      <path d="M281.196,0h-50.298c-8.715,0-15.804,7.089-15.804,15.804v50.298c0,8.715,7.089,15.804,15.804,15.804h50.298
				c8.715,0,15.804-7.089,15.804-15.804V15.804C297,7.089,289.911,0,281.196,0z"/>
                      <path d="M281.196,107.547h-50.298c-8.715,0-15.804,7.089-15.804,15.804v50.298c0,8.715,7.089,15.804,15.804,15.804h50.298
				c8.715,0,15.804-7.089,15.804-15.804v-50.298C297,114.636,289.911,107.547,281.196,107.547z"/>
                      <path d="M66.102,215.093H15.804C7.089,215.093,0,222.183,0,230.898v50.298C0,289.911,7.089,297,15.804,297h50.298
				c8.715,0,15.804-7.089,15.804-15.804v-50.298C81.907,222.183,74.817,215.093,66.102,215.093z"/>
                      <path d="M173.649,215.093h-50.298c-8.715,0-15.804,7.089-15.804,15.804v50.298c0,8.715,7.089,15.804,15.804,15.804h50.298
				c8.715,0,15.804-7.089,15.804-15.804v-50.298C189.453,222.183,182.364,215.093,173.649,215.093z"/>
                      <path d="M281.196,215.093h-50.298c-8.715,0-15.804,7.089-15.804,15.804v50.298c0,8.715,7.089,15.804,15.804,15.804h50.298
				c8.715,0,15.804-7.089,15.804-15.804v-50.298C297,222.183,289.911,215.093,281.196,215.093z"/>
                    </g>
                  </g>
                </g>
              </svg>

            </Button>
          </div>
        </div>

        <div >
          <div className=" flex items-center align-middle  h-[56px] max-lg:hidden justify-center">
            <div className=" tr-left border-r-orange-50 ">

            </div >
            <div className="w-full bg-orange-50 flex justify-center h-14 ">
              <div className='m-auto flex justify-center'>
                <HeaderNavigation links={links} noscategy={noscategy} cathegories={cathegories} />
                <Link href={"build-pc"}>
               
                <Button className='ml-5 dark:bg-[#673AB7] dark:text-white bg-[#673AB7]' variant={'default'} >
                  Build your pc
                </Button> </Link>
              </div>




            </div>
            <div className=" tr-right border-l-orange-50 ">

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
               
                <Button className='ml-5 dark:bg-amber-500 dark:text-white bg-amber-500' variant={'default'} >
                  Build your pc
                </Button> </Link>
        <Accordion className='w-full' type="single" collapsible>
          {links.map((linkk) => (<>
            {linkk.link.length > 0 ? <>
              <NavigationMenuItem className='w-full list-none' >
              <Link onClick={() => setIsMenuOpen(!isMenuOpen)}  href={'' + linkk.link}>  
                  <Button  
                  className="mx-3 list-none bg-orange-50  dark:border-0 dark:bg-[#262626ab] dark:text-white text-black w-full bg-opacity-50 rounded-sm text-center border-1 border-orange-100 m-2 py-2 " >
                 
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
                  noscategy.map((item,keyy)=>(<>
                  {item.navitemId=== linkk.id?<>
                    <AccordionItem value={item.id}>
                      <AccordionTrigger   className='active:text-orange-500 focus:text-orange-500 text-  px-10 '>{item.Label}</AccordionTrigger>
                      <AccordionContent key={item.id}>
                        {
                          noscategy[keyy].CathegoryCollectiondata.map((i)=>(<>
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