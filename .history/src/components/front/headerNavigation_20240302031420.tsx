"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

import Image from "next/image"
import classNames from 'classnames';
import { Category, navitem } from "@prisma/client"
import { Button } from "../ui/button"
import { useState } from "react"
import { LocalCathegoryCollection } from "@/app/(admin)/admin/(routes)/mainpage/page"
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import './headerNav.css'

interface HeaderProps {
  cathegories?: Category[] | null
  noscategy:LocalCathegoryCollection[]
  links:navitem[]
  
}

 const HeaderNavigation: React.FC<HeaderProps>=({noscategy ,cathegories,links})=> {
 
  const int=noscategy[0]??[]
  
  const [catstodisplay,setCatstodisplay]=useState<String[]>([])
  
  const [selected,setSelected]=useState(0)


  return (<>
  


  <NavigationMenu.Root className="NavigationMenuRoot flex align-middle items-center">
    <NavigationMenu.List className="NavigationMenuList">

    {links.map((linkk ,key)=>(<>
      {linkk.link.length>0?<>
        <NavigationMenu.Item key={key} onMouseMoveCapture={()=>{setCatstodisplay([]);setSelected(NaN)}}  className="px-3 dark:text-black ">
        <NavigationMenu.Link href={''+linkk.link}>
        {linkk.label}
      </NavigationMenu.Link>
        </NavigationMenu.Item>
  
      
      </>:<>
       
      <NavigationMenu.Item>
          <NavigationMenu.Trigger   className="focus:bg-transparent  text-black dark:bg-transparent dark:text-black bg-transparent rounded-none hover:bg-transparent active:bg-transparent " onMouseMoveCapture={()=>{
            const cat=  noscategy.find((e)=>e.navitemId===linkk.id)
             if(cat){
              setCatstodisplay(cat.CathegoryCollectiondata.map((e)=>e.Label));
              setSelected(noscategy.findIndex((e)=>e.navitemId===linkk.id))
             }else{
              setCatstodisplay([]);
              setSelected(NaN)
             }
            
            }}  >{linkk.label}

          </NavigationMenu.Trigger>
          <NavigationMenu.Content className=" NavigationMenuContent ">
            <ul className={` w-full dark:border-black   gap-0   ${catstodisplay.length>0?' grid grid-cols-3 custom-nav lg:w-[800px]':'grid grid-cols-3 custom-nav w-[800px]'} `}>
              <li className=" p-3  pt-0  pr-0 dark:text-white dark:bg-violet-950 row-span-1 h-full flex flex-col bg-white ">
                 {
                  noscategy.map((item,key)=>(<>
                  {item.navitemId=== linkk.id?<>
                    <Button 
                   onMouseMoveCapture={()=>{setCatstodisplay(noscategy[key].CathegoryCollectiondata.map((item)=>item.Label));setSelected(key)}}
                    onClick={()=>{setCatstodisplay(noscategy[key].CathegoryCollectiondata.map((item)=>item.Label));setSelected(key)}}
                       className={` px-7 
                      mt-2 py-9 justify-start hover:bg-violet-100  hover:rounded-l-md hover:rounded-r-none text-left  "${selected==key? ' mr-0 dark:bg-violet-900 dark:text-white text-black rounded-none rounded-l-md bg-violet-50  ':" border-1 dark:border-0 dark:text-white border-violet-100 bg-white dark:bg-violet-900 text-black mr-2 rounded-md"}`}>{item.Label}</Button>
                
                  
                  </>:<></>


                  }
                 
                  </>))
                 }
              </li>

              {
                catstodisplay.length>0?<>
                <div className="col-span-2  bg-[#ffffffb4]  dark:bg-[#1c102eec]">
                <div className="  grid grid-cols-2 p-5 h-min     dark:text-white ">
                {
                  catstodisplay.map((item,key)=>(<>
                       <ListItem key={key} className="hover:dark:bg-black hover:dark:text-white mx-2 mb-2 " href={`/shop?categorie=${item}`} title={item.toString()}>
                       
                       </ListItem>
                  </>))
                }
         
          
              </div>
                </div>
      
             
                </>:<></>
              }
             
              
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      
      </>

      }
      
      </>))


      }

<NavigationMenu.Indicator className="NavigationMenuIndicator">
          <div className="Arrow" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>


<div className="ViewportPosition">
  <NavigationMenu.Viewport className="NavigationMenuViewport" />
</div>
</NavigationMenu.Root>


  </>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, forwardedRef) => {
  return (
    <li>
       <NavigationMenu.Link asChild className="bg-white dark:bg-violet-900 bg-opacity-50  dark:bg-opacity-50 border text-center hover:bg-opacity-100">
      <a className={classNames('ListItemLink', className)} {...props} ref={forwardedRef}>
        <div className="ListItemHeading">{title}</div>
        <p className="ListItemText">{children}</p>
      </a>
    </NavigationMenu.Link>

    </li>
  )
})
ListItem.displayName = "ListItem"

export default HeaderNavigation