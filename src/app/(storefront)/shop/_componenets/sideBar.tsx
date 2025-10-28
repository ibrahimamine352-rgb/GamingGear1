'use client'
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import ProductCard from "@/components/ui/product-card";
import { Product } from "@/types";
import NoResults from "@/components/ui/no-results";
import { Category } from '@prisma/client'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useRouter } from 'next/navigation'
import Skeleton from '@/components/ui/skeleton'
import { Filter, filterItem } from '../../build-pc/page'
import { Input } from '@/components/ui/input'
import { FilterList, HomeFilter, compFilter } from '../page'
import PriceFilter from '@/components/search-filters/price-filter'
import PaginationControls from './PaginationControls'
import { Button } from '@/components/ui/button'

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
  totalprod: number
  hasNextPage: boolean
  hasPrevPage: boolean
  pagetotal: number
  perpage: number
  pageindex: number
  sort: string,
  selectfilterList: FilterList | undefined
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

  const [filterList, setFilterList] = useState<FilterList>(selectfilterList || {})
  const [title, setTitle] = useState(titlee)
  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 20000]);
  const [totalproducts, setTotalproducts] = useState(totalprod)
  const [searchTerm, setSearchTerm] = useState((titlee.toString()) ?? '')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const [categorie] = useState({
    id: 'category',
    name: 'Category',
    options: categories.map((item) => ({
      value: item.name,
      label: item.name,
      checked: false
    }))
  })

  const [startTime, setStartTime] = useState(performance.now())
  const [timeTaken, setTimeTaken] = useState(0)
  const [isLoading, setIsloading] = useState(isloadingg)

  const [selectedSort, setSelectedSort] = useState(sort ?? 'Les plus populaires');
  const sortOptions = [
    { name: 'Les plus populaires', href: '#', current: selectedSort === 'Les plus populaires' },
    { name: 'Les plus récents', href: '#', current: selectedSort === 'Les plus récents' },
    { name: 'Prix : Croissant', href: '#', current: selectedSort === 'Prix : Croissant' },
    { name: 'Prix : Décroissant', href: '#', current: selectedSort === 'Prix : Décroissant' },
  ];

  const router = useRouter()

  const handleCheckboxChange = (filterKey: string, value: string) => {
    setFilterList(prev => {
      const next = { ...prev };
      const arr = next[filterKey] ? [...next[filterKey]] : [];
      const idx = arr.findIndex(i => i.searchKey === value);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push({ id: Date.now(), searchKey: value });
      next[filterKey] = arr;
      return next;
    });
  }

  const onPriceChange = (values: number[]) => {
    setPriceFilter([values[0] ?? 0, values[1] ?? 0]);
  };

  // ── Display helper: if a "Processeur support" group only has AMD/INTEL, show it as "Marque processeur"
  const getSectionTitle = (f: Filter) => {
    if (!f?.title || !Array.isArray(f.list)) return String(f?.title ?? '');
    const titleLc = f.title.toString().toLowerCase();
    const names = f.list.map(x => (x.name ?? '').toString().toLowerCase().trim());
    const onlyBrands = names.length > 0 && names.every(n => n === 'amd' || n === 'intel');
    if (titleLc.includes('processeur support') && onlyBrands) return 'Marque processeur';
    return String(f.title);
  };

  // ── Merge duplicate groups by (display) title and de-duplicate items by name
  const mergedFilter: HomeFilter[] = (() => {
    const bucket: Record<string, { title: string; list: filterItem[] }> = {};

    (filter || []).forEach(hf => {
      Object.values(hf.data || {}).forEach((val) => {
        const f = val as Filter;
        if (!f || !Array.isArray(f.list)) return;

        const title = getSectionTitle(f);
        if (!bucket[title]) bucket[title] = { title, list: [] };

        f.list.forEach(it => {
          if (!it?.name) return;
          if (!bucket[title].list.some(x => x.name === it.name)) {
            bucket[title].list.push(it);
          }
        });
      });
    });

    // Build a single HomeFilter entry with all merged groups
    const dataObj: Record<string, Filter> = {};
    Object.keys(bucket).forEach((t) => {
      dataObj[t] = { title: bucket[t].title as Filter['title'], list: bucket[t].list } as Filter;
    });

    const safeTitle = (filter?.[0]?.title ?? 'Filters') as unknown as HomeFilter['title'];

    // ✅ Cast the whole object, avoids mismatch on HomeFilter['data']
    const mergedOne = {
      title: safeTitle,
      data: dataObj,
    } as unknown as HomeFilter;

    return [mergedOne];
  })();

  useEffect(() => {
    setFilterList(selectfilterList || {})
  }, [selectfilterList])

  useEffect(() => {
    const endTime = performance.now();
    setIsloading(false)
    const t = ((endTime - startTime) / 10000);
    setStartTime(performance.now())
    setTimeTaken(t)
    setTotalproducts(totalprod)
    setTitle(titlee)
  }, [items, totalprod, titlee, category])

  const fetchData = (cate?: string, sortName?: string) => {
    const encodedFilterList: Record<string, any> = {}

    const finalCategory = typeof cate === 'string' ? cate : (category || "");

    if (Object.keys(filterList).length > 0 && mergedFilter?.length) {
      const fil: compFilter = {
        data: filterList,
        // use merged title to keep behavior stable even after merging
        type: (mergedFilter[0]?.title ?? filter?.[0]?.title ?? '').toString(),
      }
      encodedFilterList.data = encodeURIComponent(JSON.stringify(fil));
    }

    const finalSort = sortName ?? ''

    setIsloading(true)
    setTimeTaken(0)
    setMobileFiltersOpen(false)
    setTotalproducts(0)

    router.push(
      `/shop?minDt=${priceFilter[0]}&maxDt=${priceFilter[1]}&search=${encodeURIComponent(searchTerm)}`
      + `${finalCategory ? "&categorie=" + encodeURIComponent(finalCategory) : ""}`
      + `&sort=${encodeURIComponent(finalSort)}`
      + `${encodedFilterList.data ? "&filterList=" + encodedFilterList.data : ""}`
    )
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
              <div className="fixed inset-x-0 top-[var(--header-h,80px)] bottom-0 z-[6000] bg-black bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-x-0 top-[var(--header-h,80px)] bottom-0 z-[6000] flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className=" relative ml-0 flex h-full w-full  max-w-lg flex-col overflow-y-auto bg-card border-l border-border py-4 pb-12 shadow-xl">
                  <div className="w-full flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-foreground">Filters</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-[hsl(var(--card)/0.60)] border border-border hover:bg-[hsl(var(--card)/0.80)]"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-border" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <input
                        type="search"
                        className="w-full rounded-xl p-3
                                   bg-[hsl(var(--card)/0.40)]
                                   border-2 border-[hsl(var(--promo))]
                                   text-foreground placeholder:text-muted-foreground/70
                                   focus:outline-none focus:border-[hsl(var(--promo))]
                                   focus:shadow-[0_0_10px_hsl(var(--promo)/0.30)]
                                   transition-all duration-300"
                        placeholder="Search..."
                        disabled={isLoading}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setIsloading(true);
                            fetchData();
                          }
                        }}
                      />

                      <div className='w-full'>
                        <PriceFilter setLoading={setIsloading} value={priceFilter} handlePriceFilter={onPriceChange} />
                      </div>

                      <Button disabled={isLoading} onClick={() => { setIsloading(true); fetchData(); }}>
                        Filter
                      </Button>
                    </div>

                    {/* Category (mobile) */}
                    {!isLoading && categories.length > 1 ? (
                      <>
                        {[categorie].map((section) => (
                          <Disclosure as="div" key={section.id} className="border-b border-border py-6">
                            {({ open }) => (
                              <>
                                <h3 className="-my-3 flow-root">
                                  <Disclosure.Button className="flex w-full items-center justify-between bg-transparent py-3 text-sm text-foreground hover:text-[#00e0ff]">
                                    <span className="font-medium">{section.name}</span>
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
                                    <RadioGroup defaultValue="option-one">
                                      {section.options.map((option, optionIdx) => (
                                        <div key={option.value} className="flex items-center">
                                          <RadioGroupItem
                                            onClick={() => {
                                              setIsloading(true)
                                              fetchData(option.label);
                                            }}
                                            value={option.value}
                                            id={`filter-${section.id}-${optionIdx}`}
                                          />
                                          <label
                                            htmlFor={`filter-${section.id}-${optionIdx}`}
                                            className="ml-3 text-sm text-foreground/80"
                                          >
                                            {option.label}
                                          </label>
                                        </div>
                                      ))}
                                    </RadioGroup>
                                  </div>
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                        ))}
                      </>
                    ) : (
                      // Technical filters (mobile) — use mergedFilter
                      <>
                        {!isLoading && mergedFilter.map((e) => (
                          <div key={String(e.title)}>
                            {Object.entries(e.data).map(([filterKey, filtera]) => {
                              const filterData = filtera as Filter;
                              if (filterData && filterData.title && filterData.list) {
                                return (
                                  <Disclosure as="div" key={`${filterKey}-${String(filterData.title)}`} className="border-b border-border py-4">
                                    {({ open }) => (
                                      <>
                                        <h3 className="-my-1 flow-root">
                                          <Disclosure.Button className="flex w-full items-center justify-between bg-transparent py-2 text-sm text-foreground hover:text-[#00e0ff]">
                                            <span className="font-medium">{filterData.title}</span>
                                            <span className="ml-6 flex items-center">
                                              {open ? (
                                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                              ) : (
                                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                              )}
                                            </span>
                                          </Disclosure.Button>
                                        </h3>
                                        <Disclosure.Panel className="pt-3">
                                          <CheckboxGroup
                                            label={filterData.title.toString()}
                                            items={filterData.list}
                                            onChange={(value) => handleCheckboxChange(filterKey, value)}
                                            keyto={filterKey}
                                            selectedItems={filterList}
                                          />
                                        </Disclosure.Panel>
                                      </>
                                    )}
                                  </Disclosure>
                                );
                              }
                              return null;
                            })}
                          </div>
                        ))}
                      </>
                    )}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-border pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              {header}
              <br />
              {header != 'Store' ? (
                <>
                  <a href="/shop">
                    <span className='font-light text-sm underline cursor-pointer'> All Products {"> "} </span>
                  </a>
                  <span className='font-light text-sm '>{header}</span>
                </>
              ) : null}
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-foreground hover:text-[hsl(var(--accent))]">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-foreground/70 group-hover:text-[hsl(var(--accent))]"
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-card border border-border shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <button
                              type="button"
                              onClick={() => { setSelectedSort(option.name); setIsloading(true); fetchData(undefined, option.name); }}
                              className={classNames(
                                option.current ? 'text-[#00e0ff]' : 'text-foreground/80',
                                active ? 'bg:white/10' : '',
                                'block w-full text-left px-4 py-2 text-sm'
                              )}
                            >
                              {option.name}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-4 p-2 text-foreground hover:text-[#00e0ff] sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">Products</h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters (desktop) */}
              <form className="hidden lg:block" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <input
                    type="search"
                    className="w-full rounded-xl p-3
                               bg-[hsl(var(--card)/0.40)]
                               border-2 border-[hsl(var(--promo))]
                               text-foreground placeholder:text-muted-foreground/70
                               focus:outline-none focus:border-[hsl(var(--promo))]
                               focus:shadow-[0_0_10px_hsl(var(--promo)/0.30)]
                               transition-all duration-300"
                    placeholder="Search..."
                    disabled={isLoading}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setIsloading(true);
                        fetchData();
                      }
                    }}
                  />

                  <div className='w-full'>
                    <PriceFilter setLoading={setIsloading} value={priceFilter} handlePriceFilter={onPriceChange} />
                  </div>

                  <Button
                    disabled={isLoading}
                    onClick={() => { setIsloading(true); fetchData(); }}
                    className="bg-[hsl(var(--accent))] text-white w-full my-3 h-11 rounded-xl px-4 font-semibold
                               shadow-[0_0_0_1px_hsl(var(--accent)/0.20),0_0_16px_hsl(var(--accent)/0.18)]
                               hover:brightness-110 hover:shadow-[0_0_0_1px_hsl(var(--accent)/0.26),0_0_20px_hsl(var(--accent)/0.28)]
                               disabled:bg-[hsl(var(--accent))/0.38] disabled:text-white/85 disabled:shadow-none"
                  >
                    Filter
                  </Button>
                </div>

                {/* Technical filters (desktop) — use mergedFilter */}
                <>
                  {!isLoading && mergedFilter.map((e) => (
                    <div key={String(e.title)}>
                      {Object.entries(e.data).map(([filterKey, filtera]) => {
                        const filterData = filtera as Filter;
                        if (filterData && filterData.title && filterData.list) {
                          return (
                            <Disclosure as="div" key={`${filterKey}-${String(filterData.title)}`} className="border-b border-border py-4">
                              {({ open }) => (
                                <>
                                  <h3 className="-my-1 flow-root">
                                    <Disclosure.Button className="flex w-full items-center justify-between bg-transparent py-2 text-sm text-foreground hover:text-[#00e0ff]">
                                      <span className="font-medium">{filterData.title}</span>
                                      <span className="ml-6 flex items-center">
                                        {open ? (
                                          <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                        ) : (
                                          <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                        )}
                                      </span>
                                    </Disclosure.Button>
                                  </h3>
                                  <Disclosure.Panel className="pt-3">
                                    <CheckboxGroup
                                      label={filterData.title.toString()}
                                      items={filterData.list}
                                      onChange={(value) => handleCheckboxChange(filterKey, value)}
                                      keyto={filterKey}
                                      selectedItems={filterList}
                                    />
                                  </Disclosure.Panel>
                                </>
                              )}
                            </Disclosure>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ))}
                </>
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h1 className="font-semibold text-[18px] md:text-3xl leading-tight tracking-tight">
                      {title && String(title).length
                        ? (
                          <>
                            Résultats pour{" "}
                            <span className="inline-flex items-center rounded-full border border-white/10 bg:white/5 px-2 py-0.5 text-[12px] md:text-sm font-medium">
                              {String(title)}
                            </span>
                          </>
                        )
                        : "Tous les laptops"}
                    </h1>

                    <p className="text-xs md:text-sm text-[#9CA3AF]">
                      {totalproducts} résultats{timeTaken > 0 ? <> — {timeTaken.toFixed(2)} s</> : null}
                    </p>
                  </div>

                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-28 md:pb-0">
                      <Skeleton className="w-full h-72 rounded-xl" />
                      <Skeleton className="w-full h-72 rounded-xl" />
                      <Skeleton className="w-full h-72 rounded-xl" />
                      <Skeleton className="w-full h-72 rounded-xl" />
                      <Skeleton className="w-full h-72 rounded-xl" />
                      <Skeleton className="w-full h-72 rounded-xl" />
                      <Skeleton className="w-full h-72 rounded-xl" />
                      <Skeleton className="w-full h-72 rounded-xl" />
                    </div>
                  ) : (
                    <>
                      {items.length === 0 && <NoResults />}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-28 md:pb-0">
                        {items.map((item) => (
                          <ProductCard key={item.id} data={item} />
                        ))}
                      </div>

                      {/* Desktop/tablet pagination */}
                      <div className="hidden md:flex w-full items-center justify-center py-6">
                        <PaginationControls
                          hasNextPage={hasNextPage}
                          hasPrevPage={hasPrevPage}
                          pagetotal={pagetotal}
                          perpage={perpage}
                          pageindex={pageindex}
                        />
                      </div>

                      {/* Mobile pagination */}
                      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[hsl(var(--background))]/95 backdrop-blur border-t border-border">
                        <div className="mx-auto flex max-w-md items-center justify-center p-3">
                          <PaginationControls
                            hasNextPage={hasNextPage}
                            hasPrevPage={hasPrevPage}
                            pagetotal={pagetotal}
                            perpage={perpage}
                            pageindex={pageindex}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

// Reusable CheckboxGroup
const CheckboxGroup = (props: {
  label: string;
  items: filterItem[];
  keyto: string
  onChange: (value: string) => void;
  selectedItems: FilterList;
}) => {
  return (
    <div>
      <p className="sr-only">{props.label}</p>
      {props.items.map((item) => (
        <div key={item.name}>
          <div className='flex items-center appearance-none'>
            <Input
              type='checkbox'
              className="rounded-full w-3 h-3 m-2 border-2
                         border-[hsl(var(--accent))] checked:bg-[hsl(var(--accent))]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
              value={item.name}
              checked={!!props.selectedItems[props.keyto]?.some(e => e.searchKey === item.name)}
              onChange={() => props.onChange(item.name)}
            />
            <label className='text-sm'>{item.name} </label>
          </div>
        </div>
      ))}
      <br />
    </div>
  );
};

export default Sidebar
