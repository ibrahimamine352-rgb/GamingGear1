"use client";

import { CoolerIcon } from "./comps";

import React, { MouseEventHandler, useEffect, useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { InlineDetails } from "@/components/InlineDetails";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";
import SearchComponent from "@/components/search-filters/motherboard/motherboard-search";
import { useLanguage } from "@/context/language-context";
import { UI_TEXT } from "@/i18n/ui-text";

import { Filter, ProfileType, filterItem } from "../page";
import Image from "next/image";
import { Product } from "@/types";
import { Trash } from "lucide-react";
import usePreviewModal from "@/hooks/use-preview-modal";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import Currency from "@/components/ui/currency";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { Pagination } from "@nextui-org/pagination";
import { AllProductsCompatibility } from "./comps";

type checkItem = {
  id: number;
  searchKey: string;
};

function classNames(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

export type checkItemGroupsCooling = {
  coolingcPUSupport: checkItem[];
  fansNumber: checkItem[];
  coolingType: checkItem[];
  coolingMark: checkItem[];
};

export const Cooling = (props: {
  selectedCompatibility: AllProductsCompatibility | undefined;
  setProcessorId: (values: Product | undefined) => void;
  processorId: Product | undefined;
  profiles: ProfileType[];
  coolingcPUSupport: Filter;
  fansNumber: Filter;
  coolingType: Filter;
  coolingMark: Filter;
  motherboardId: Product | undefined;
}) => {
  const { lang } = useLanguage();
  const ui = UI_TEXT[lang];

  const [data, setData] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState<number[]>([0, 5000]);

  const [filterList, setFilterList] = useState<checkItemGroupsCooling>({
    coolingcPUSupport: [],
    fansNumber: [],
    coolingType: [],
    coolingMark: [],
  });

  const [selectedSort, setSelectedSort] = useState("Prix : Croissant");
  const [searchTerm, setSearchTerm] = useState("");
  const [compatible, setcompatible] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const sortOptions = [
    {
      name: "Les plus populaires",
      href: "#",
      current: selectedSort === "Les plus populaires",
    },
    {
      name: "Les plus récents",
      href: "#",
      current: selectedSort === "Les plus récents",
    },
    {
      name: "Prix : Croissant",
      href: "#",
      current: selectedSort === "Prix : Croissant",
    },
    {
      name: "Prix : Décroissant",
      href: "#",
      current: selectedSort === "Prix : Décroissant",
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const encodedFilterList = encodeURIComponent(JSON.stringify(filterList));
      const startTime = performance.now();
      const response = await fetch(
        `/api/Cooling/component?minDt=${priceFilter[0]}&maxDt=${
          priceFilter[1]
        }&q=${searchTerm}&sort=${selectedSort}&units=10&page=${currentPage}&filterList=${encodedFilterList}${
          compatible && props.motherboardId
            ? `&motherboardId=${props.motherboardId.id}`
            : ""
        }`
      );
      const dataa = await response.json();
      const endTime = performance.now();
      setSearchTime((endTime - startTime) / 1000);

      setData(dataa.data || []);
      setTotalPages(dataa.total || 0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleCheckboxChange = (
    filterKey: keyof checkItemGroupsCooling,
    value: string
  ) => {
    setFilterList((prevFilterList) => {
      const existingIndex = prevFilterList[filterKey].findIndex(
        (item) => item.searchKey === value
      );

      if (existingIndex !== -1) {
        const next = [...prevFilterList[filterKey]];
        next.splice(existingIndex, 1);
        return { ...prevFilterList, [filterKey]: next };
      } else {
        const next = [
          ...prevFilterList[filterKey],
          { id: Date.now(), searchKey: value },
        ];
        return { ...prevFilterList, [filterKey]: next };
      }
    });
  };

  const previewModal = usePreviewModal();
  const cart = useCart();
  const router = useRouter();
  const handleClick = (id: any) => {
    router.push(`/product/${id}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
  };
  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
  };

  const handleSortClick = (name: React.SetStateAction<string>) => {
    setSelectedSort(name);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedSort]);

  useEffect(() => {
    fetchData();
  }, []);

  function haveCommonElement<T>(set1: T[], array2: T[]): boolean {
    const array1 = Array.from(set1);
    for (const item of array1) if (array2.includes(item)) return true;
    return false;
  }

  const checkcompatibility = (product: Product) => {
    const mb = props.motherboardId;
    if (mb) {
      const MProfiles = props.profiles.filter((e) =>
        e.motherboards.find((ee) => ee.productId == mb.id)
      );
      const PProfiles = props.profiles.filter((e) =>
        e.coolings.find((ee) => ee.productId == product.id)
      );
      return haveCommonElement(MProfiles, PProfiles);
    }
    return true;
  };

  const [openDialog, steOpenDialog] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescription = () => setShowFullDescription((v) => !v);

  // Safely handle selected cooling (called processorId in props)
  const selectedCooling = props.processorId;
  const selectedDesc = selectedCooling?.description ?? "";
  const selectedImg =
    selectedCooling?.images?.[0]?.url || "/placeholder.png";

  return (
    <div className="text-foreground">
      <Card className="m-3 rounded-2xl build-container">
        <CardContent>
          <div className="flex lg:flex-row flex-col ">
            {/* LEFT SELECTOR */}
            <button
              onClick={() => steOpenDialog(true)}
              className="lg:w-1/5 w-full min-w-md:max-w-lg m-3 bg-transparent border-transparent hover:bg-[hsl(var(--card)/0.08)] rounded-xl"
            >
              <Card className="build-selector">
                <CardHeader>
                  <CardTitle className="text-center">
                    {ui.builderCompatCooling}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid place-items-center h-24 leading-none text-[hsl(var(--accent))]">
                    <CoolerIcon className="block w-24 h-24 md:w-28 md:h-28" />
                  </div>
                </CardContent>
              </Card>
            </button>

            {/* RIGHT SUMMARY CARD */}
            <Card className="lg:w-4/5 w-full min-w-md:max-w-lg justify-center flex md:flex-row flex-col align-middle items-center m-3 build-container">
              <CardContent className="p-0 w-full h-full">
                {selectedCooling ? (
                  <>
                    <div className="build-container hover:bg-[#1a1a1a] transition flex md:flex-row flex-col justify-between group items-center rounded-xl space-x-3">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <div
                          className="aspect-square mt-3 rounded-xl bg-gray-100 ml-3 dark:bg-transparent relative"
                          style={{ height: "150px" }}
                        >
                          <Image
                            src={selectedImg}
                            alt=""
                            fill
                            className="aspect-square object-cover rounded-md h-full w-full"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="flex-grow p-3">
                        <p className="font-semibold text-sm ">
                          {selectedCooling.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {showFullDescription
                            ? selectedDesc
                            : `${selectedDesc.slice(0, 100)}...`}
                          {selectedDesc.length > 100 && (
                            <span
                              className="font-bold cursor-pointer text-[#007bff]"
                              onClick={toggleDescription}
                            >
                              {showFullDescription ? " See Less" : " See More"}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Compatibility */}
                      {props.selectedCompatibility ? (
                        <>
                          <div className="w-4/5">
                            <div className="font-bold my-2 text-sm">
                              Compatibility:
                            </div>

                            <div className="text-left grid text-xs max-w-screen-md mx-auto border border-gray-300 rounded mb-3 mr-3">
                              <div className="p-1 pl-3 border-b border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40 hover:font-bold cursor-pointer">
                                <p
                                  className={`mb-1 ${
                                    props.selectedCompatibility.Compatibility
                                      .motherboardCompatibility.error
                                      ? "text-red-600"
                                      : "text-primary"
                                  }`}
                                >
                                  Motherboard:
                                </p>
                                <p
                                  className={
                                    props.selectedCompatibility.Compatibility
                                      .motherboardCompatibility.error
                                      ? "text-red-600"
                                      : "text-primary"
                                  }
                                >
                                  {
                                    props.selectedCompatibility.Compatibility
                                      .motherboardCompatibility.message
                                  }
                                </p>
                              </div>
                              <div className="p-1 pl-3 border-b border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40 hover:font-bold cursor-pointer">
                                <p
                                  className={`mb-1 ${
                                    props.selectedCompatibility.Compatibility
                                      .processorCompatibility.error
                                      ? "text-red-600"
                                      : "text-primary"
                                  }`}
                                >
                                  Processor:
                                </p>
                                <p
                                  className={
                                    props.selectedCompatibility.Compatibility
                                      .processorCompatibility.error
                                      ? "text-red-600"
                                      : "text-primary"
                                  }
                                >
                                  {
                                    props.selectedCompatibility.Compatibility
                                      .processorCompatibility.message
                                  }
                                </p>
                              </div>
                              <div className="p-1 pl-3 border-b border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40 hover:font-bold cursor-pointer">
                                <p
                                  className={`mb-1 ${
                                    props.selectedCompatibility.Compatibility
                                      .gpuCompatibility.error
                                      ? "text-red-600"
                                      : "text-primary"
                                  }`}
                                >
                                  Graphics card:
                                </p>
                                <p
                                  className={
                                    props.selectedCompatibility.Compatibility
                                      .gpuCompatibility.error
                                      ? "text-red-600"
                                      : "text-primary"
                                  }
                                >
                                  {
                                    props.selectedCompatibility.Compatibility
                                      .gpuCompatibility.message
                                  }
                                </p>
                              </div>
                              <div className="p-1 pl-3 border-b border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40 hover:font-bold cursor-pointer">
                                <p
                                  className={`mb-1 ${
                                    props.selectedCompatibility.Compatibility
                                      .ramCompatibility.error
                                      ? "text-red-600"
                                      : "text-primary"
                                  }`}
                                >
                                  RAM :
                                </p>
                                <p
                                  className={
                                    props.selectedCompatibility.Compatibility
                                      .ramCompatibility.error
                                      ? "text-red-600"
                                      : "text-primary"
                                  }
                                >
                                  {
                                    props.selectedCompatibility.Compatibility
                                      .ramCompatibility.message
                                  }
                                </p>
                              </div>
                              <div className="p-1 pl-3 border-b border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40 hover:font-bold cursor-pointer">
                                <p
                                  className={`mb-1 ${
                                    props.selectedCompatibility.Compatibility
                                      .hardDiskCompatibility.error
                                      ? "text-red-600"
                                      : "text-primary"
                                  }`}
                                >
                                  Hard drive compatibility:
                                </p>
                                <p
                                  className={
                                    props.selectedCompatibility.Compatibility
                                      .hardDiskCompatibility.error
                                      ? "text-red-600"
                                      : "text-primary"
                                  }
                                >
                                  {
                                    props.selectedCompatibility.Compatibility
                                      .hardDiskCompatibility.message
                                  }
                                </p>
                              </div>
                              <div className="p-1 pl-3 border-b border-gray-300 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40 hover:font-bold cursor-pointer">
                                <p
                                  className={`mb-1 ${
                                    props.selectedCompatibility.Compatibility
                                      .powerCompatibility.error
                                      ? "text-red-600"
                                      : "text-primary"
                                  }`}
                                >
                                  Power supply box compatibility:
                                </p>
                                <p
                                  className={
                                    props.selectedCompatibility.Compatibility
                                      .powerCompatibility.error
                                      ? "text-red-600"
                                      : "text-primary"
                                  }
                                >
                                  {
                                    props.selectedCompatibility.Compatibility
                                      .powerCompatibility.message
                                  }
                                </p>
                              </div>
                              <div className="p-1 pl-3 hover:dark:bg-slate-950 hover:bg-amber-50 hover:bg-opacity-40 hover:font-bold cursor-pointer">
                                <p
                                  className={`mb-1 ${
                                    props.selectedCompatibility.Compatibility
                                      .caseCompatibility.error
                                      ? "text-red-600"
                                      : "text-primary"
                                  }`}
                                >
                                  Case compatibility:
                                </p>
                                <p
                                  className={
                                    props.selectedCompatibility.Compatibility
                                      .caseCompatibility.error
                                      ? "text-red-600"
                                      : "text-primary"
                                  }
                                >
                                  {
                                    props.selectedCompatibility.Compatibility
                                      .caseCompatibility.message
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null}

                      {/* Price & actions */}
                      <div className="flex-shrink-0 p-3">
                        <div className="text-center flex flex-col">
                          <div className="p-3">
                            <Currency value={selectedCooling.price} />
                          </div>
                          <Button
                            className="mb-3"
                            disabled={loading}
                            variant="destructive"
                            size="sm"
                            onClick={() => props.setProcessorId(undefined)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => steOpenDialog(true)}
                            className="btn-primary-blue"
                          >
                            {ui.builderBtnChange}
                          </Button>
                          <a
                            href="zz"
                            className="underline mt-2 text-[#007bff]"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {ui.builderLinkSeeInStore}
                          </a>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => steOpenDialog(true)}
                      className="cursor-pointer w-full h-full flex justify-center items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={40}
                        height={40}
                        viewBox="0 0 44 55"
                        className="fill-current text-[hsl(var(--accent))]"
                      >
                        <g>
                          <path d="M41.9,21H23V2.1c0-0.6-0.5-1-1-1c-0.6,0-1,0.5-1,1V21H2.1c-0.6,0-1,0.5-1,1s0.5,1,1,1H21v18.8c0,0.6,0.5,1,1,1c0.6,0,1-0.5,1-1V23h18.8c0.6,0,1-0.5,1-1S42.5,21,41.9,21z" />
                        </g>
                      </svg>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* DIALOG — mount only when open */}
      {openDialog && (
        <Dialog open={openDialog} onOpenChange={(o) => steOpenDialog(o)}>
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
                <div className="flex justify-between pt-1 items-center">
                  <h1>CPU cooler store</h1>
                  <Menu as="div" className="relative inline-block text-left">
                    <div className="flex">
                      <Menu.Button className="group inline-flex justify-center text-sm font-medium text-foreground">
                        Sort&nbsp;(
                        <span className="text-sm font-medium text-foreground">
                          {selectedSort}
                        </span>
                        )
                        <ChevronDownIcon
                          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-muted-foreground"
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
                                    option.current
                                      ? "cursor-pointer text-[#007bff] font-medium"
                                      : "cursor-pointer text-muted-foreground",
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

            {/* Body: dual scroll panes */}
            <div className="flex-1 grid grid-cols-12 gap-4 px-4 py-4 overflow-hidden text-[13px]">
              {/* FILTERS PANEL */}
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

                {props.coolingMark?.list &&
                  props.coolingMark.list.length > 0 && (
                    <>
                      <br />
                      {props.motherboardId ? (
                        <div>
                          <div className="flex items-center appearance-none">
                            <Input
                              type="checkbox"
                              className="appearance-none focus:outline-none focus-visible:outline-none w-3 h-3 m-2 outline-none"
                              checked={compatible}
                              onChange={(e) =>
                                setcompatible(e.target.checked)
                              }
                            />
                            <label className="text-sm">
                              Compatible with Motherboard
                            </label>
                          </div>
                        </div>
                      ) : null}

                      {Object.entries(props).map(([filterKey, filter]) => {
                        if (
                          [
                            "coolingcPUSupport",
                            "fansNumber",
                            "coolingType",
                            "coolingMark",
                          ].includes(filterKey)
                        ) {
                          const filterData = filter as Filter;
                          return (
                            <CheckboxGroup
                              key={filterKey}
                              label={filterData.title.toString()}
                              items={filterData.list}
                              onChange={(value) =>
                                handleCheckboxChange(
                                  filterKey as keyof checkItemGroupsCooling,
                                  value
                                )
                              }
                              selectedItems={filterList[
                                filterKey as keyof checkItemGroupsCooling
                              ].map((item) => item.searchKey)}
                            />
                          );
                        }
                        return null;
                      })}
                    </>
                  )}
              </div>

              {/* RESULTS GRID */}
              <div className="col-span-12 md:col-span-8 lg:col-span-9 overflow-y-auto">
                {loading ? (
                  <div>
                    <Container>
                      <div className="w-full h-full p-8">
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton
                              key={i}
                              className="w-full h-48 rounded-xl"
                            />
                          ))}
                        </div>
                      </div>
                    </Container>
                  </div>
                ) : (
                  <>
                    {!loading && data.length === 0 && (
                      <p>{ui.builderNoResults}.</p>
                    )}

                    {!loading && data.length > 0 && (
                      <>
                        <div className="text-sm">
                          ({totalPages}){" "}
                          {ui.builderResultsSummary(totalPages, searchTime)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {data.map((item, key) => {
                            const imgSrc =
                              item.images?.[0]?.url || "/placeholder.png";

                            return (
                              <div
                                key={key}
                                className={`bg-[#12141b] hover:bg-[#101218] transition flex flex-col justify-between group cursor-pointer rounded-xl border border-white/5 p-3 space-y-1 ${
                                  checkcompatibility(item)
                                    ? "ring-1 ring-[#00e0ff]/50"
                                    : "ring-1 ring-red-500/40"
                                }`}
                              >
                                <div>
                                  <div className="aspect-square rounded-xl bg-gray-100 dark:bg-transparent relative">
                                    <Image
                                      src={imgSrc}
                                      alt=""
                                      fill
                                      className="aspect-square object-cover rounded-md"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-sm ">
                                      {item.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {item.category?.name}
                                    </p>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <Currency value={item.price} />
                                  </div>
                                </div>

                                <div className="w-full">
                                  <InlineDetails
                                    text={item.description ?? ""}
                                  />

                                  <Button
                                    type="submit"
                                    onClick={() => {
                                      props.setProcessorId(item);
                                      steOpenDialog(false);
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
              <div className="grid grid-cols-12 gap-4 w-full items-center">
                <div className="col-span-12 md:col-span-4 lg:col-span-3">
                  <Button
                    className="w-full px-6 py-2 bg-[#00a2ff] hover:bg-[#0092e6] text-foreground"
                    onClick={() => {
                      setCurrentPage(0);
                      fetchData();
                    }}
                  >
                    {ui.filterButton}
                  </Button>
                </div>
                <div className="col-span-12 md:col-span-8 lg:col-span-9 flex justify-end">
                  {totalPages > 0 && !loading && data.length > 0 && (
                    <Pagination
                      isCompact
                      showControls
                      total={
                        parseInt((totalPages / 10).toFixed(0)) +
                        (totalPages % 10 === 0 ? 0 : 1)
                      }
                      classNames={{
                        wrapper: "gap-2",
                        item: "w-8 h-8 text-foreground bg-white/10 border border-white/20 hover:bg-white/20",
                        cursor:
                          "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold shadow-[0_0_20px_hsl(var(--accent)/0.15)]",
                        prev: "bg-white/10 border border-white/20 text-foreground hover:bg-white/20",
                        next: "bg-white/10 border border-white/20 text-foreground hover:bg-white/20",
                      }}
                      page={currentPage + 1}
                      onChange={(e) => {
                        setCurrentPage(e - 1);
                      }}
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

// Reusable CheckboxGroup
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
              className="appearance-none focus:outline-none focus-visible:outline-none w-3 h-3 m-2 outline-none"
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
