"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import "./Searchbar.css";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Loader } from '../ui/loader';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import Image from 'next/image';
import { Expand, Eye, Loader2 } from 'lucide-react';
import { LoaderIcon } from 'react-hot-toast';
import { Icon } from '@radix-ui/react-select';
import IconButton from '../ui/icon-button';
import { Category } from '@prisma/client';
import { useLanguage } from "@/context/language-context";
import { UI_TEXT } from "@/i18n/ui-text";

interface PriceFilterProps { cats?: Category[] | null }

const fetchPosts = async (url: string) => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }

    return response.json();
};

const SearchBar: React.FC<PriceFilterProps> = ({ cats }) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams()
    const [dataToDis, setDataToDis] = useState<Product[] | undefined>([])
    const { lang } = useLanguage();
const ui = UI_TEXT[lang];

    
    // Define searchQuery using router.query inside the component.
    const [searchQuery, setSearchQuery] = useState("")
    const encodedSearchQuery = encodeURI(searchQuery ?? "");

    const { data, error, isLoading } = useSWR<Product[]>(
        `/api/search?q=${searchQuery}`,
        fetchPosts,
        { revalidateOnFocus: true },
    );

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    
    return (
        <div>
            <Button className='w-48 h-10 px-4 bg-white/10 backdrop-blur-sm border-2 border-[hsl(var(--promo))] text-foreground hover:bg-white/20 hover:border-[hsl(var(--promo))]  transition-all duration-300 text-sm font-medium rounded-xl' variant={'outline'} onClick={() => setOpen(!open)}>
                <svg className='mr-4' width="20" height="20" viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
                {ui.searchPlaceholder}
            </Button>
            
            <CommandDialog 
                open={open} 
                onOpenChange={setOpen}
            >
                <CommandInput 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            router.push('/shop?search=' + searchQuery)
                            router.refresh()
                            setOpen(false)
                        }
                    }} 
                    onValueChange={(e) => setSearchQuery(e)} 
                    placeholder={ui.searchPlaceholder}
 
                    className='border-0 outline-0 focus:outline-none focus:outline-0 focus:outline-transparent focus:border-0 focus:shadow-none text-foreground placeholder-white/60 bg-background' 
                />
                
                <CommandList className="bg-background border-t border-border/10 max-h-[400px]">
                    {isLoading && (
                        <CommandEmpty className="text-foreground/60">
                            <div className='flex items-center align-middle w-full py-4'>
                                <LoaderIcon className='mx-auto' />
                            </div>
                        </CommandEmpty>
                    )}

                    {data && data?.length > 0 && (
                        <CommandGroup heading={ui.resultsHeading} className="text-foreground">
                            <CommandItem value={searchQuery} className="text-foreground hover:bg-white/10 rounded-lg mx-2 my-1">
                                <div 
                                    onClick={() => {
                                        router.push('/shop?search=' + searchQuery);
                                        setOpen(false);
                                        setSearchQuery('')
                                    }} 
                                    className='flex justify-between w-full items-center px-2 py-2'
                                >
                                    {ui.seeAllResults}
                                </div>
                            </CommandItem>
                            
                            {data?.map((p) => (
                                <CommandItem key={p.id} value={p.name} className="text-foreground hover:bg-white/10 rounded-lg mx-2 my-1">
                                    <div 
                                        onClick={() => {
                                            router.push(`/product/${p.id}`);
                                            setOpen(false);
                                            setSearchQuery('')
                                        }} 
                                        className='flex justify-between w-full items-center px-2 py-2'
                                    >
                                        <div className='flex items-center'>
                                            {p.images.length > 0 && (
                                                <Image 
                                                    className='rounded mr-5 w-10 h-10' 
                                                    src={p.images[0].url} 
                                                    alt={'product image'} 
                                                    width={30} 
                                                    height={30} 
                                                />
                                            )}
                                            {p.name}
                                        </div>
                                        <div className='flex items-center'>
                                            <div className="text-foreground/80">{p.price} TND</div>
                                            <div className='flex items-center ml-5'>
                                                <IconButton 
                                                    onClick={() => {
                                                        router.push(`/product/${p.id}`);
                                                        setOpen(false);
                                                        setSearchQuery('')
                                                    }} 
                                                    className='bg-white/10 backdrop-blur-sm border border-border/20 text-foreground hover:bg-white/20'
                                                    icon={<Eye size={15} className="text-foreground" />}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    <CommandGroup heading={ui.categoriesHeading} className="text-foreground">
                        {cats && cats.map((cat, k) => (
                            <CommandItem 
                                key={k} 
                                onSelect={() => {
                                    console.log(cat.name)
                                    setOpen(!open)
                                    router.push('/shop?categorie=' + cat.name)
                                    router.refresh()
                                }}
                                className="text-foreground hover:bg-white/10 rounded-lg mx-2 my-1 px-2 py-2"
                            >
                                {cat.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </div>
    );
};

export default SearchBar;