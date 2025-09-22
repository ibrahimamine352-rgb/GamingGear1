'use client'
import React from 'react'
import './main.css'
import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core'
import Slideshow, { SlidesColumn } from './carrousel';
import Featured from './Featured';
import { Product } from '@/types';
import ProductList from '../product-list';

interface SlideshowProps {
  slides: SlidesColumn[];
  featured:Product[]
}
const Main : React.FC<SlideshowProps> = ({slides,featured} ) => {
    const theme = createTheme({
        /** Put your mantine theme override here */
      });
  return (
    <div className='bg-main'>
      
            
   <section>
    <div className='container mx-auto  md:px-0 sm:px-0 max-sm:px-0'>
      <Slideshow slides={slides}/>
    </div>

   </section>
   <section>
    <div className='container mx-auto  md:px-0 sm:px-0 max-sm:px-0'>
      <ProductList items={featured} title="Featured Products"/>
    </div>
   </section> 
   </div>
  )
}

export default Main