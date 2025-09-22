'use client'
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import ProductCard from "@/components/ui/product-card";
import { Product } from "@/types";
import NoResults from "@/components/ui/no-results";
import { Category } from '@prisma/client'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'
import { LoadingOverlay } from '@mantine/core'
import Skeleton from '@/components/ui/skeleton'
import { Filter, filterItem } from '../../build-pc/page'
import { Input } from '@/components/ui/input'
import { FilterList, HomeFilter, compFilter } from '../page'
import SearchComponent from '@/components/search-filters/motherboard/motherboard-search'
import PriceFilter from '@/components/search-filters/price-filter'
import PaginationControls from './PaginationControls'
import { Button } from '@/components/ui/button'
  

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]
const subCategories = [
  { name: 'Totes', href: '#' },
  { name: 'Backpacks', href: '#' },
  { name: 'Travel Bags', href: '#' },
  { name: 'Hip Bags', href: '#' },
  { name: 'Laptop Sleeves', href: '#' },
]
function classNames(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface ProductListProps {
  titlee: String,
  items: Product[],
  categories: Category[]
  isloadingg: boolean
  header: string
  filter: HomeFilter[]
  category: string
  totalprod:number
  hasNextPage: boolean
  hasPrevPage: boolean
  pagetotal:number
  perpage:number
  pageindex:number
  sort: string,
  selectfilterList:FilterList|undefined
}
const Sidebar: React.FC<ProductListProps> = ({
  titlee,
  items,
  categories,
  isloadingg,
  header,
  filter,
  totalprod,
  category,
  hasNextPage,
  hasPrevPage,
  pagetotal,
  perpage,
  pageindex,
  sort,
  selectfilterList
}) => {
  
const [filterList, setFilterList] = useState<FilterList>(selectfilterList||{})

  const [title,setTitle]=useState(titlee)
  const [priceFilter,setPriceFilter]=useState([0,20000])
  const [totalproducts,setTotalproducts]=useState(totalprod)
  const [searchTerm,setSearchTerm]=useState((titlee.toString())??'')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [categorie, setCategorie] = useState({
    id: 'category',
    name: 'Category',
    options: categories.map((item) => ({
      value: item.name,
      label: item.name,
      checked: false
    }))
  })
  const [startTime,setStartTime]= useState(performance.now())
  const [timeTaken,setTimeTaken]= useState(0)
  const [isLoading, setIsloading] = useState(isloadingg)
  const [filters, setfilters] = useState([categorie])

  const [selectedSort, setSelectedSort] = useState(sort??'Les plus populaires');
  
  const sortOptions = [
    { name: 'Les plus populaires', href: '#', current: selectedSort === 'Les plus populaires' },
    { name: 'Les plus récents', href: '#', current: selectedSort === 'Les plus récents' },
    { name: 'Prix : Croissant', href: '#', current: selectedSort === 'Prix : Croissant' },
    { name: 'Prix : Décroissant', href: '#', current: selectedSort === 'Prix : Décroissant' },
];



  const [cat,setCat]=useState(category)
  const router = useRouter()
  const handleCheckboxChange = (filterKey: string, value: string) => {
   
   
    setFilterList((prevFilterList) => {
      const existingIndex = (prevFilterList[filterKey] || []).findIndex(
        (item) => item.searchKey === value
      );
  
      const updatedFilterList = { ...prevFilterList };
  
      if (existingIndex !== -1) {
        // If the item exists, remove it from the list
        updatedFilterList[filterKey].splice(existingIndex, 1);
      } else {
        // If the item doesn't exist, add it to the list
        if (!updatedFilterList[filterKey]) {
          updatedFilterList[filterKey] = [];
        }
        updatedFilterList[filterKey].push({ id: Date.now(), searchKey: value });
      }
      console.log(updatedFilterList)
      return updatedFilterList;
    });

  }
  useEffect(() => {
    console.log(filterList)
    const endTime = performance.now();
    setIsloading(false)
    const timeTaken = ((endTime - startTime) / 10000);
    setCat(category)
    console.log(totalprod)
    setStartTime(performance.now())
    setTimeTaken(timeTaken)
    setTotalproducts(totalprod)
    setTitle(titlee)
      
 setFilterList(selectfilterList||{})

  }, [items])



  const fetchData=(cate?:string,sort?:string)=>{
    const encodedFilterList: Record<string, any>  ={}
    if(!cate&&!category){
      cate=""
    
    }else{
      if(cat){
        cate=category
        
      }

   
        
    }
    if(cate&&cate.length>0&&Object.keys(filterList).length>0&&filter){
      const fil:compFilter={
        data:filterList,
        type:filter[0].title.toString(),
      }
      console.log(fil)
     encodedFilterList.data = encodeURIComponent(JSON.stringify(fil));
    
    }else{
      
    }
       
    if(!sort){
      sort=''
    }
    setIsloading(true)
    setCat("")
    setTitle("")
    setTimeTaken(0)
    setMobileFiltersOpen(false)
    setTotalproducts(0)
  
    router.push(`/shop?minDt=${priceFilter[0]}&maxDt=${priceFilter[1]}&search=${searchTerm}${cate?"&categorie="+cate:""}&sort=${sort}${encodedFilterList.data?"&filterList="+encodedFilterList.data:""}`)
    router.refresh()
 
  
  }
  return (
    <div className="w-full">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setMobileFiltersOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black z-50   bg-opacity-50" />
            </Transition.Child> 

            <div className="fixed inset-0 z-50 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className=" relative ml-0 flex h-full w-full  max-w-lg flex-col overflow-y-auto bg-[#ffffffe6]  dark:bg-[#26143aad]  py-4 pb-12 shadow-xl">
                  <div className="w-full flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-violet-900 dark:text-violet-100 ">Filters</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white dark:bg-black  p-2 text-violet-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-violet-200 dark:border-violet-800" onSubmit={(e)=>{
                e.preventDefault();
              }}>


<div>
      <input
       className='w-full border rounded-sm dark:bg-black !border-amber-400 focus:!border-amber-100 '
        type="text"
        placeholder="Search..."
        disabled={isLoading} 
        value={searchTerm}
        onChange={(e)=>setSearchTerm(e.target.value)}
        onKeyDown={ (e) => {
          console.log(e)
          if (e.key === 'Enter') {
 
            setIsloading(true);
            fetchData();
          }
        }}
      />


      <div className='w-full'>
     

        <PriceFilter setLoading={setIsloading} value={priceFilter} handlePriceFilter={setPriceFilter} />
        
      </div>  
   

  

      <Button disabled={isLoading} className='w-full my-3 bg-violet-500' onClick={()=>{
           setIsloading(true);
           fetchData();
      }}>Filtrer</Button>
    </div>


    {!isLoading&&categories.length>1?<>
      {filters.map((section) => (
                  <Disclosure as="div" key={section.id} className="border-b border-violet-200 dark:border-violet-800 py-6">
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white dark:bg-black  py-3 text-sm text-violet-400 hover:text-violet-500">
                            <span className="font-medium text-violet-900 dark:text-violet-100">{section.name}</span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                              ) : (
                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                          <RadioGroup   defaultValue="option-one" >
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center">

                                <RadioGroupItem onClick={(e)=>{
                              setIsloading(true)
                              setCat(option.label)
                              fetchData(option.label);
                          }} value={option.value}       id={`filter-${section.id}-${optionIdx}`} />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-violet-600"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}</RadioGroup>
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}

    
    </>:<>{
                  !isLoading&&filter.map((e) => {
                    return <>
               


                      {Object.entries(e.data).map(([filterKey, filtera]) => {


                        // Check if the current property is one of the specified properties
                        const filterData = filtera as Filter;
                       
                        if (filterData && filterData.title && filterData.list) {
                          return (
                            <CheckboxGroup
                              key={filterKey}
                              label={filterData.title.toString()}
                              items={filterData.list}
                              onChange={(value) => handleCheckboxChange(filterKey, value)}
                              keyto={filterKey}
                              selectedItems={filterList}
                            />
                          );
                        }
                        return
                        // Skip rendering for other properties
                      })}
                    </>

                    return
                  })
                }</>}
                
           
            
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-violet-200 dark:border-violet-800 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-violet-900 dark:text-violet-100">{header}
            <br />
            
            {header!='Store'?(

              <><a href="/shop" target=''>
                
                <span className='font-light text-sm underline cursor-pointer' > Tous Les produits {"> "} </span>
                </a><span className='font-light text-sm '>{header}</span>
           
              </>):<></>
            }
             
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-violet-700 hover:text-violet-900 dark:text-violet-100">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-violet-400 group-hover:text-violet-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="cursor-pointer absolute right-0 z-10 mt-2 w-44 dark:border origin-top-right rounded-md bg-white dark:bg-violet-700  shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1 px-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}
                        
                        >
                          {({ active }) => (
                            <a
                              onClick={()=>{
                                  setSelectedSort(option.name);
                                  // Add any additional logic you need when a sort option is clicked
                                  fetchData(cat,sort=option.name)
                              }}
                              className={classNames(
                                option.current ? 'font-medium text-violet-900  dark:text-violet-100' : 'text-violet-500',
                                active ? 'bg-violet-100 dark:bg-violet-800' : '',
                                'block px-4 py-2 text-sm  rounded-sm'
                              )}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

             
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-violet-400 hover:text-violet-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block" onSubmit={(e)=>{
                e.preventDefault();
              }}>


<div>
      <input
       className='w-full border rounded-sm dark:bg-transparent !border-violet-400 focus:!border-violet-100 '
        type="text"
        placeholder="Search..."
        disabled={isLoading} 
        value={searchTerm}
        onChange={(e)=>setSearchTerm(e.target.value)}
        onKeyDown={ (e) => {
          console.log(e)
          if (e.key === 'Enter') {
 
            setIsloading(true);
            fetchData();
          }
        }}
      />


      <div className='w-full'>
     

        <PriceFilter setLoading={setIsloading} value={priceFilter} handlePriceFilter={setPriceFilter} />
        
      </div>  
   

  

      <Button disabled={isLoading} className='w-full my-3  bg-violet-500' onClick={()=>{
           setIsloading(true);
           fetchData();
      }}>Filtrer</Button>
    </div>


    {!isLoading&&categories.length>1?<>
      {filters.map((section) => (
                  <Disclosure as="div" key={section.id} className="border-b border-violet-200 dark:border-violet-800 py-6">
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white dark:bg-black  py-3 text-sm text-violet-400 hover:text-violet-500">
                            <span className="font-medium text-violet-900 dark:text-violet-100">{section.name}</span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                              ) : (
                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                          <RadioGroup   defaultValue="option-one" >
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center">

                                <RadioGroupItem onClick={(e)=>{
                              setIsloading(true)
                              setCat(option.label)
                              fetchData(option.label);
                          }} value={option.value}       id={`filter-${section.id}-${optionIdx}`} />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-violet-600"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}</RadioGroup>
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}

    
    </>:<>{
                  !isLoading&&filter.map((e) => {
                    return <>
               


                      {Object.entries(e.data).map(([filterKey, filtera]) => {


                        // Check if the current property is one of the specified properties
                        const filterData = filtera as Filter;
                       
                        if (filterData && filterData.title && filterData.list) {
                          return (
                            <CheckboxGroup
                              key={filterKey}
                              label={filterData.title.toString()}
                              items={filterData.list}
                              onChange={(value) => handleCheckboxChange(filterKey, value)}
                              keyto={filterKey}
                              selectedItems={filterList}
                            />
                          );
                        }
                        return
                        // Skip rendering for other properties
                      })}
                    </>

                    return
                  })
                }</>}
                
           
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3"> <div className="space-y-4">
                <h3 className="font-bold text-3xl">{title.length>0?<>Search : <span className='text-md font-normal'>{title}</span> </>:<></>}
                
                
           </h3>     <p>
                <span className='text-sm font-normal'>{
            timeTaken>0?<>{totalproducts}  Résultats en {timeTaken.toFixed(2)} seconds</>:<>
        
            </>    
                
}</span></p>
                {isLoading ? <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Skeleton className="w-full h-72 rounded-xl" />
                    <Skeleton className="w-full h-72 rounded-xl" />
                    <Skeleton className="w-full h-72 rounded-xl" />
                    <Skeleton className="w-full h-72 rounded-xl" />
                    <Skeleton className="w-full h-72 rounded-xl" />
                    <Skeleton className="w-full h-72 rounded-xl" />
                    <Skeleton className="w-full h-72 rounded-xl" />
                    <Skeleton className="w-full h-72 rounded-xl" />

                  </div>


                </> : <>
                  {items.length === 0 && <NoResults />}
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item) => (
                      <ProductCard key={item.id} data={item} />
                    ))}
                  </div>
                  <div className='flex items-center justify-end p-7'>

      <PaginationControls 
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        pagetotal={pagetotal}
        perpage={perpage}
     
        pageindex={pageindex}
      />
    
</div>

                </>

                }

              </div></div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

// You can create a reusable CheckboxGroup component for rendering checkboxes
const CheckboxGroup = (props: {
  label: string;
  items: filterItem[];
  keyto:string
  onChange: (value: string) => void;
  selectedItems: FilterList;
}) => {
  return (
    <div>
      <p>{props.label}</p>
      {props.items.map((item) => (
        <div key={item.name}>
          <div className='flex items-center appearance-none'>
            <Input type='checkbox' className='appearance-none  checked:bg-violet-700 border-violet-500 focus:!border-violet-500 focus:!ring-violet-500 focus:!bg-violet-500 hover:!bg-violet-600 hover:!ring-violet-500   focus:outline-none focus-visible:outline-none w-3 h-3 m-2 outline-none'
              value={item.name}
              checked={props.selectedItems[props.keyto]&&props.selectedItems[props.keyto].findIndex((e)=>e.searchKey===item.name)!=-1}
              onChange={() => props.onChange(item.name)}
            />
            <label className='text-sm'>{item.name} ({item.number})
            </label>
            <div>

            </div>

          </div>



        </div>
      ))}

      <br />
    </div>
  );
};
export default Sidebar