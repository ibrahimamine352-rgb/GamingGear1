'use client'
import React from 'react'
import './main.css'
import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core'
import { Product } from '@/types';
import ProductList from '../product-list';
import { Button } from '../ui/button';
import { ArrowRight, Play, Star } from 'lucide-react';

interface MainProps {
  slides: any[];
  featured: Product[]
}

const Main: React.FC<MainProps> = ({ slides, featured }) => {
  const theme = createTheme({
    /** Put your mantine theme override here */
  });

  return (
    <div style={{  background: 'hsl(var(--background))'  }}>
      {/* Hero Section - New Container After Navbar */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 decor-overlay rounded-3xl blur-3xl brand-gradient-bg/20"></div>
        <div className="relative glass-card p-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Star className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-sm text-foreground/80">Premium Gaming Gear</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Level Up Your
                <span className="block bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] bg-clip-text text-transparent">
                  Gaming Experience
                </span>
              </h1>
              
              <p className="text-lg text-foreground/70 max-w-lg">
                Discover the latest in gaming technology. From high-performance PCs to premium peripherals, 
                we have  got everything you need to dominate the competition.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-black font-semibold hover:shadow-[0_0_20px_rgba(0,224,255,0.3)] transition-all duration-300 border-0 px-8 py-3 text-lg">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-white/20 text-foreground hover:bg-white/10 hover:border-white/40 px-8 py-3 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 decor-overlay rounded-3xl blur-3xl brand-gradient-bg/20"></div>
              <div className="relative glass-card p-8">
                <div className="aspect-square bg-gradient-to-br from-[#38BDF8]/10 to-[#0EA5E9]/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br [#38BDF8]/10 to-[#0EA5E9] rounded-full flex items-center justify-center">
                      <Play className="h-12 w-12 text-black ml-1" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">Gaming Setup</h3>
                      <p className="text-foreground/60">Professional gaming equipment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="relative">
        <div className="container mx-auto px-6 py-12 sm:py-16">
          <ProductList items={featured} title="Featured Products" />
        </div>
      </section>
    </div>
  )
}

export default Main