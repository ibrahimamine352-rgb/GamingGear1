"use client";

import React, { Fragment, MouseEventHandler, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { XMarkIcon } from '@heroicons/react/24/outline'
import { PsuIcon } from "./comps"
import { InlineDetails } from "@/components/InlineDetails";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";
import SearchComponent from "@/components/search-filters/motherboard/motherboard-search";
import Currency from "@/components/ui/currency";
import { Pagination } from "@nextui-org/pagination";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Trash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/context/language-context";
import { UI_TEXT } from "@/i18n/ui-text";

import type { Product } from "@/types";
import type { Filter, ProfileType, filterItem } from "../page";
import type { AllProductsCompatibility } from "./comps";
import type { SelectedFeatures } from "./BuildForm";
import { getRecommendations } from "./getRecommendations";

/* ---------- helper types ---------- */
type CheckItem = { id: number; searchKey: string };

export type CheckItemGroupsPower = {
  psCertification: CheckItem[];
  powersupplyMarque: CheckItem[];
};

type PSUProduct = Product & {
  powersupplies?: Array<{ Power?: number | string }>;
  powersupplys?: Array<{ Power?: number | string }>;
};

/* ---------- utils ---------- */
function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}
function haveCommonElement<T>(set1: T[], array2: T[]) {
  const array1 = Array.from(set1);
  for (const item of array1) if (array2.includes(item)) return true;
  return false;
}

/* ====================================================================== */
/* =============================== POWER ================================= */
/* ====================================================================== */

export const Power = (props: {
  removeFeature: (featureName: string) => void;
  addFeature: (featureName: string, value: any) => void;
  selectedFeatures: SelectedFeatures;
  selectedCompatibility: AllProductsCompatibility | undefined;
  setProcessorId: (values: Product | undefined) => void;
  processorId: Product | undefined;
  profiles: ProfileType[];
  psCertification: Filter;
  powersupplyMarque: Filter;
  motherboardId: Product | undefined;
}) => {
  const { lang } = useLanguage();
  const ui = UI_TEXT[lang];
  const [data, setData] = useState<PSUProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState<number[]>([0, 5000]);

  const [filterList, setFilterList] = useState<CheckItemGroupsPower>({
    psCertification: [],
    powersupplyMarque: [],
  });

  const [recommendedWattage, setRecommendedWattage] = useState<number | null>(null);

  const [selectedSort, setSelectedSort] = useState("Prix : Croissant");
  const [searchTerm, setSearchTerm] = useState("");
  const [compatible, setCompatible] = useState(false);
  const [searchTime, setSearchTime] = useState(0);

  const sortOptions = [
    { name: "Les plus populaires", href: "#", current: selectedSort === "Les plus populaires" },
    { name: "Les plus récents", href: "#", current: selectedSort === "Les plus récents" },
    { name: "Prix : Croissant", href: "#", current: selectedSort === "Prix : Croissant" },
    { name: "Prix : Décroissant", href: "#", current: selectedSort === "Prix : Décroissant" },
  ];

  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const encodedFilterList = encodeURIComponent(JSON.stringify(filterList));
      const startTime = performance.now();

      const response = await fetch(
        `/api/powersupply/component?minDt=${priceFilter[0]}&maxDt=${priceFilter[1]}&q=${searchTerm}&sort=${selectedSort}&units=10&page=${currentPage}&filterList=${encodedFilterList}${
          compatible && props.motherboardId ? `&motherboardId=${props.motherboardId.id}` : ""
        }`
      );
      const dataa = await response.json();

      const endTime = performance.now();
      setSearchTime((endTime - startTime) / 1000);

      setData(dataa.data as PSUProduct[]);
      setTotalPages(dataa.total ?? 0);
      setLoading(false);

      const rec = await getRecommendations(props.selectedFeatures);
      setRecommendedWattage(rec?.recommendations?.[0]?.powerSupplyWattage ?? null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleCheckboxChange = (filterKey: keyof CheckItemGroupsPower, value: string) => {
    setFilterList((prev) => {
      const existingIndex = prev[filterKey].findIndex((i) => i.searchKey === value);
      if (existingIndex !== -1) prev[filterKey].splice(existingIndex, 1);
      else prev[filterKey].push({ id: Date.now(), searchKey: value });
      return { ...prev };
    });
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (e) => e.stopPropagation();
  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (e) => e.stopPropagation();
  const handleSortClick = (name: React.SetStateAction<string>) => setSelectedSort(name);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedSort]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkcompatibility = (product: Product) => {
    const mb = props.motherboardId;
    if (mb) {
      const MProfiles = props.profiles.filter((p) => p.motherboards.find((m) => m.productId === mb.id));
      const PProfiles = props.profiles.filter((p) => p.powersupplys.find((ps) => ps.productId === product.id));
      return haveCommonElement(MProfiles, PProfiles);
    }
    return true;
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescription = () => setShowFullDescription((s) => !s);

  return (
    <div className="text-foreground">
      {/* SUMMARY CARD */}
      <Card className="m-3 rounded-2xl build-container">
        <CardContent>
          <div className="flex lg:flex-row flex-col">
            {/* LEFT SELECTOR */}
            <button
              onClick={() => setOpenDialog(true)}
              className='lg:w-1/5 w-full min-w-md:max-w-lg m-3 bg-transparent border-transparent hover:bg-[hsl(var(--card)/0.08)] rounded-xl'
            >
              <Card className="rounded-xl build-selector">
                <CardHeader>
                  <CardTitle className="text-center">
                  {ui.builderCompatPsu}
                    <p className="text-xs text-muted-foreground p-1">{ui.builderRequiredTag}</p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex items-center justify-center leading-none text-[hsl(var(--accent))]">
                <PsuIcon className="block w-24 h-24 md:w-28 md:h-28" />
                </div>
                </CardContent>
              </Card>
            </button>

            {/* RIGHT SUMMARY */}
            <Card className="lg:w-4/5 w-full justify-center flex md:flex-row flex-col items-center m-3 rounded-xl build-container">
              <CardContent className="p-0 w-full h-full">
                {props.processorId ? (
                  <div className="build-container hover:bg-[#1a1a1a] transition flex md:flex-row flex-col justify-between group items-center rounded-xl space-x-3">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <div className="aspect-square mt-3 rounded-xl bg-transparent ml-3 relative" style={{ height: "150px" }}>
                        <Image
                          src={props.processorId.images?.[0]?.url}
                          alt={props.processorId.name ?? "Product image"}
                          fill
                          className="aspect-square object-cover rounded-md h-full w-full"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex-grow p-3">
                      <p className="font-semibold text-sm">{props.processorId.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {showFullDescription
                          ? props.processorId.description
                          : `${props.processorId.description?.slice(0, 100) ?? ""}...`}
                        {props.processorId.description && props.processorId.description.length > 100 && (
                          <span className="font-bold cursor-pointer text-[#007bff]" onClick={toggleDescription}>
                            {showFullDescription ? " See Less" : " See More"}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Compatibilité */}
                    {props.selectedCompatibility ? (
                      <div className="w-4/5">
                        <div className="font-bold my-2 text-sm">Compatibility:</div>
                        <div className="text-left grid text-xs max-w-screen-md mx-auto border border-white rounded mb-3 mr-3">
                          <div className="p-1 pl-3 border-b border-white hover:bg-[#101218] hover:font-bold cursor-pointer">
                            <p
                              className={`mb-1 ${
                                props.selectedCompatibility.Compatibility.motherboardCompatibility.error
                                  ? "text-red-400"
                                  : "text-primary"
                              }`}
                            >
                              Motherboard :
                            </p>
                            <p
                              className={
                                props.selectedCompatibility.Compatibility.motherboardCompatibility.error
                                  ? "text-red-400"
                                  : "text-primary"
                              }
                            >
                              {props.selectedCompatibility.Compatibility.motherboardCompatibility.message}
                            </p>
                          </div>
                          <div className="p-1 pl-3 border-b border-white hover:bg-[#101218] hover:font-bold cursor-pointer">
                            <p
                              className={`mb-1 ${
                                props.selectedCompatibility.Compatibility.processorCompatibility.error
                                  ? "text-red-400"
                                  : "text-primary"
                              }`}
                            >
                              Processor :
                            </p>
                            <p
                              className={
                                props.selectedCompatibility.Compatibility.processorCompatibility.error
                                  ? "text-red-400"
                                  : "text-primary"
                              }
                            >
                              {props.selectedCompatibility.Compatibility.processorCompatibility.message}
                            </p>
                          </div>
                          <div className="p-1 pl-3 border-b border-white hover:bg-[#101218] hover:font-bold cursor-pointer">
                            <p
                              className={`mb-1 ${
                                props.selectedCompatibility.Compatibility.gpuCompatibility.error
                                  ? "text-red-400"
                                  : "text-primary"
                              }`}
                            >
                              Graphic Card :
                            </p>
                            <p
                              className={
                                props.selectedCompatibility.Compatibility.gpuCompatibility.error
                                  ? "text-red-400"
                                  : "text-primary"
                              }
                            >
                              {props.selectedCompatibility.Compatibility.gpuCompatibility.message}
                            </p>
                          </div>
                          <div className="p-1 pl-3 border-b border-white hover:bg-[#101218] hover:font-bold cursor-pointer">
                            <p
                              className={`mb-1 ${
                                props.selectedCompatibility.Compatibility.ramCompatibility.error
                                  ? "text-red-400"
                                  : "text-primary"
                              }`}
                            >
                              RAM :
                            </p>
                            <p
                              className={
                                props.selectedCompatibility.Compatibility.ramCompatibility.error
                                  ? "text-red-400"
                                  : "text-primary"
                              }
                            >
                              {props.selectedCompatibility.Compatibility.ramCompatibility.message}
                            </p>
                          </div>
                          <div className="p-1 pl-3 border-b border-white hover:bg-[#101218] hover:font-bold cursor-pointer">
                            <p
                              className={`mb-1 ${
                                props.selectedCompatibility.Compatibility.hardDiskCompatibility.error
                                  ? "text-red-400"
                                  : "text-primary"
                              }`}
                            >
                              Hard drive compatibility :
                            </p>
                            <p
                              className={
                                props.selectedCompatibility.Compatibility.hardDiskCompatibility.error
                                  ? "text-red-400"
                                  : "text-primary"
                              }
                            >
                              {props.selectedCompatibility.Compatibility.hardDiskCompatibility.message}
                            </p>
                          </div>
                          <div className="p-1 pl-3 border-b border-white hover:bg-[#101218] hover:font-bold cursor-pointer">
                            <p
                              className={`mb-1 ${
                                props.selectedCompatibility.Compatibility.powerCompatibility.error
                                  ? "text-red-400"
                                  : "text-primary"
                              }`}
                            >
                              Power supply box compatibility :
                            </p>
                            <p
                              className={
                                props.selectedCompatibility.Compatibility.powerCompatibility.error
                                  ? "text-red-400"
                                  : "text-primary"
                              }
                            >
                              {props.selectedCompatibility.Compatibility.powerCompatibility.message}
                            </p>
                          </div>
                          <div className="p-1 pl-3 hover:bg-[#101218] hover:font-bold cursor-pointer">
                            <p
                              className={`mb-1 ${
                                props.selectedCompatibility.Compatibility.caseCompatibility.error
                                  ? "text-red-400"
                                  : "text-primary"
                              }`}
                            >
                              Case compatibility:

                            </p>
                            <p
                              className={
                                props.selectedCompatibility.Compatibility.caseCompatibility.error
                                  ? "text-red-400"
                                  : "text-primary"
                              }
                            >
                              {props.selectedCompatibility.Compatibility.caseCompatibility.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Price & actions */}
                    <div className="flex-shrink-0 p-3">
                      <div className="text-center flex flex-col">
                        <div className="p-3">
                          <Currency value={props.processorId?.price} />
                        </div>
                        <Button
                          className="mb-3"
                          disabled={loading}
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            props.setProcessorId(undefined);
                            props.removeFeature("Power Supply_Wattage");
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => setOpenDialog(true)} className="btn-primary-blue">
                        {ui.builderBtnChange}
                        </Button>
                        <a
                          href={`product/${props.processorId.id}`}
                          className="underline mt-2 text-[#007bff]"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {ui.builderLinkSeeInStore}
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setOpenDialog(true)}
                    className="cursor-pointer w-full h-full flex justify-center items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 44 55" className="fill-current text-[hsl(var(--accent))]">
                      <g>
                        <path
                         
                          d="M41.9,21H23V2.1c0-0.6-0.5-1-1-1c-0.6,0-1,0.5-1,1V21H2.1c-0.6,0-1,0.5-1,1s0.5,1,1,1H21v18.8c0,0.6,0.5,1,1,1
                        c0.6,0,1-0.5,1-1V23h18.8c0.6,0,1-0.5,1-1S42.5,21,41.9,21z"
                        />
                      </g>
                    </svg>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* DIALOG — mirrored from Case */}
      {openDialog && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent
            className="
              w-[95vw] max-w-[1200px]
              h-[85vh] md:h-[80vh]
              p-0 overflow-hidden
              flex flex-col
              
              bg-[#101218] text-[#e6e8ee]
              border border-border rounded-2xl
            "
          >
            {/* Sticky header */}
            <DialogHeader className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
              <DialogTitle>
                <div className="flex justify-between items-center">
                  <h1>power supply store </h1>
                  <Menu as="div" className="relative inline-block text-left">
                    <div className="flex">
                      <Menu.Button className="group inline-flex justify-center text-sm font-medium text-foreground">
                        Sort&nbsp;(<span className="text-sm font-medium text-foreground">{selectedSort}</span>)
                        <ChevronDownIcon className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-card text-foreground border border-border shadow-2xl focus:outline-none">
                        <div className="py-1">
                          {sortOptions.map((option) => (
                            <Menu.Item key={option.name}>
                              {({ active }) => (
                                <a
                                  onClick={() => {
                                    handleSortClick(option.name);
                                    setCurrentPage(0);
                                  }}
                                  className={classNames(
                                    option.current ? "cursor-pointer text-[#007bff] font-medium" : "cursor-pointer text-muted-foreground",
                                    active ? "bg-muted" : "",
                                    "block px-4 py-2 text-sm"
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
                </div>
              </DialogTitle>
            </DialogHeader>

            {/* Body grid with independent scroll panes */}
            <div className="flex-1 grid grid-cols-12 gap-4 px-4 py-4 overflow-hidden text-[13px]">
              {/* FILTERS */}
              <div className="col-span-12 md:col-span-4 lg:col-span-3 overflow-y-auto pr-1">
                <SearchComponent
                  priceFilter={priceFilter}
                  setPriceFilter={setPriceFilter}
                  fetchData={fetchData}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  setLoading={setLoading}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  setTotalPages={setTotalPages}
                  totalPages={totalPages}
                />

                {props.psCertification.list.length > 0 ? (
                  <>
                    <br />
                    {props.motherboardId ? (
                      <div>
                        <div className="flex items-center appearance-none">
                          <Input
                            type="checkbox"
                            className="appearance-none forced-colors focus:outline-none focus-visible:outline-none w-3 h-3 m-2 outline-none"
                            checked={compatible}
                            onChange={(e) => setCompatible(e.target.checked)}
                          />
                          <label className="text-sm">Compatible with Motherboard </label>
                        </div>
                      </div>
                    ) : null}

                    {Object.entries(props).map(([filterKey, filter]) => {
                      if (["psCertification", "powersupplyMarque"].includes(filterKey)) {
                        const filterData = filter as Filter;
                        return (
                          <CheckboxGroup
                            key={filterKey}
                            label={filterData.title.toString()}
                            items={filterData.list}
                            onChange={(value) => handleCheckboxChange(filterKey as keyof CheckItemGroupsPower, value)}
                            selectedItems={filterList[filterKey as keyof CheckItemGroupsPower].map((i) => i.searchKey)}
                          />
                        );
                      }
                      return null;
                    })}
                  </>
                ) : null}
              </div>

              {/* RESULTS */}
              <div className="col-span-12 md:col-span-8 lg:col-span-9 overflow-y-auto">
                {loading ? (
                  <div>
                    <Container>
                      <div className="w-full h-full p-8">
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton key={i} className="w-full h-48 rounded-xl" />
                          ))}
                        </div>
                      </div>
                    </Container>
                  </div>
                ) : (
                  <>
                    {!loading && data && data.length === 0 && <p className="text-muted-foreground">{ui.builderNoResults}.</p>}

                    {!loading && data.length > 0 && (
                      <>
                        <div className="text-sm text-muted-foreground">
                          ({totalPages}) {ui.builderResultsSummary(totalPages, searchTime)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {data.map((item) => {
                            const raw = (item.powersupplies ?? item.powersupplys)?.[0]?.Power;
                            const watt = typeof raw === "string" ? parseInt(raw, 10) : (raw as number | undefined);
                            const isRecommended =
                              recommendedWattage != null && typeof watt === "number" && watt === recommendedWattage;

                            return (
                              <div key={item.id} className={`bg-[#12141b] hover:bg-[#101218] transition flex flex-col justify-between group cursor-pointer rounded-xl border border-white/5 p-3 space-y-1 ${
                              checkcompatibility(item) ? "ring-1 ring-[#00e0ff]/50" : "ring-1 ring-red-500/40"}`}>
                                <div>
                                  {isRecommended && <span className="text-[#007bff] font-semibold">Recommended by AI</span>}
                                  <div className="aspect-square rounded-xl bg-transparent relative">
                                    <Image src={item.images?.[0]?.url} alt={item.name} fill className="aspect-square object-cover rounded-md" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-sm">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.category?.name}</p>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <Currency value={item?.price} />
                                  </div>
                                </div>

                                <div className='w-full'>
                                <InlineDetails text={item.description} />

                                  <Button
                                    type="submit"
                                    onClick={() => {
                                      props.setProcessorId(item);
                                      if (typeof watt !== "undefined") {
                                        props.addFeature("Power Supply_Wattage", watt);
                                      }
                                      setOpenDialog(false);
                                    }}
                                    className="w-full btn-primary-blue"
                                  >
                                    {ui.builderBtnAdd}
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Sticky footer */}
            <DialogFooter className="sticky bottom-0 bg-[#101218] border-t border-border px-4 py-3">
            <div className='grid grid-cols-12 gap-4 w-full items-center'>
              <div className='col-span-12 md:col-span-4 lg:col-span-3'>
              <Button
  className='w-full px-6 py-2 bg-[#00a2ff] hover:bg-[#0092e6] text-foreground'
  onClick={() => { setCurrentPage(0); fetchData(); }}
>
  {ui.filterButton}
</Button>

              </div>

                <div className="col-span-12 md:col-span-8 lg:col-span-9 flex justify-end">
                  {totalPages > 0 && !loading && data.length > 0 && (
                    <Pagination
                      isCompact
                      showControls
                      total={parseInt((totalPages / 10).toFixed(0)) + (totalPages % 10 === 0 ? 0 : 1)}
                      classNames={{
                        wrapper: "gap-2",
                        item: "w-8 h-8 text-foreground bg-white/10 border border-white/20 hover:bg-white/20",
                        cursor:
                          "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold shadow-[0_0_20px_hsl(var(--accent)/0.15)]"
,
                        prev: "bg-white/10 border border-white/20 text-foreground hover:bg-white/20",
                        next: "bg-white/10 border border-white/20 text-foreground hover:bg-white/20",
                      }}
                      page={currentPage + 1}
                      onChange={(e) => setCurrentPage(e - 1)}
                    />
                  )}
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

/* ---------- CheckboxGroup (same as Case) ---------- */
const CheckboxGroup = (props: {
  label: string;
  items: filterItem[];
  onChange: (value: string) => void;
  selectedItems: string[];
}) => {
  return (
    <div>
      <br />
      <p>{props.label}</p>
      {props.items.map((item) => (
        <div key={item.name}>
          <div className="flex items-center appearance-none">
            <Input
              type="checkbox"
              className="appearance-none forced-colors focus:outline-none focus-visible:outline-none w-3 h-3 m-2 outline-none"
              value={item.name}
              checked={props.selectedItems.includes(item.name)}
              onChange={() => props.onChange(item.name)}
            />
            <label className="text-sm">
              {item.name} ({item.number})
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Power;
