"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { RamIcon } from "./comps";
import React, { useEffect, useMemo, useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { InlineDetails } from "@/components/InlineDetails";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";
import SearchComponent from "@/components/search-filters/motherboard/motherboard-search";
import Image from "next/image";
import Currency from "@/components/ui/currency";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { Pagination } from "@nextui-org/pagination";
import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/context/language-context";
import { UI_TEXT } from "@/i18n/ui-text";

import { AllProductsCompatibility } from "./comps";
import { MemoryFrequency, MemoryNumber, MemoryType } from "@prisma/client";
import type { SelectedFeatures } from "./BuildForm";
import { getRecommendations } from "./getRecommendations";
import type { Product } from "@/types";
import type { Filter, ProfileType, filterItem } from "../page";

// ---- helpers ----
const extractNumber = (text: string | undefined | null): number | null => {
  if (!text) return null;
  const m = text.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : null;
};

type checkItem = { id: number; searchKey: string };
function classNames(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

type SetRams = (callback: (prevRams: Array<Memory | null>) => Array<Memory | null>) => void;
type m = { frequency: MemoryFrequency; number: MemoryNumber; type: MemoryType };
export type Memory = Product & { memories: m[] };

export type checkItemGroupsRam = {
  memoryFrequency: checkItem[];
  memoryMarque: checkItem[];
  memoryNumber: checkItem[];
  memoryType: checkItem[];
};

type YourComponentProps = {
  rams: (Memory | null)[];
  setRams: SetRams;
  removeFeature: (featureName: string) => void;
  addFeature: (featureName: string, value: any) => void;
  selectedFeatures: SelectedFeatures;
  selectedCompatibility: AllProductsCompatibility | null;
  setMotherboardId: (values: Product) => void;
  motherboardId: Product | undefined;
  profiles: ProfileType[];
  setCompatibility: (value: Record<string, { message: string; error: boolean }>) => void;
  memoryMarque: Filter;
  memoryFrequency: Filter;
  memoryNumber: Filter;
  memoryType: Filter;
  ramSlotNumber: number;
  ramSlotType: string;
};

// safely get memory speed label
const getMemorySpeedName = (mem: Memory | null | undefined): string | undefined =>
  mem?.memories?.[0]?.frequency?.name;

const PER_PAGE = 10;

export const Ram: React.FC<YourComponentProps> = (props) => {
  const { lang } = useLanguage();
  const ui = UI_TEXT[lang];

  const [data, setData] = useState<Memory[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based in UI
  const [totalCount, setTotalCount] = useState(0);   // total products
  const [loading, setLoading] = useState(true);
  const [recommendedram, setRecommendedram] = useState<number | undefined>(undefined);

  const [filterList, setFilterList] = useState<checkItemGroupsRam>({
    memoryFrequency: [],
    memoryMarque: [],
    memoryNumber: [],
    memoryType: [],
  });

  const [priceFilter, setPriceFilter] = useState<number[]>([0, 5000]);
  const [compatible, setcompatible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Prix : Croissant");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTime, setSearchTime] = useState(0);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / PER_PAGE)), [totalCount]);

  const sortOptions = [
    { name: "Les plus populaires", href: "#", current: selectedSort === "Les plus populaires" },
    { name: "Les plus récents", href: "#", current: selectedSort === "Les plus récents" },
    { name: "Prix : Croissant", href: "#", current: selectedSort === "Prix : Croissant" },
    { name: "Prix : Décroissant", href: "#", current: selectedSort === "Prix : Décroissant" },
  ];

  const handleSortClick = (name: string) => setSelectedSort(name);

  const handleCheckboxChange = (filterKey: keyof checkItemGroupsRam, value: string) => {
    setFilterList((prev) => {
      const arr = prev[filterKey] ? [...prev[filterKey]] : [];
      const idx = arr.findIndex((i) => i.searchKey === value);
      const nextArr = idx >= 0 ? arr.filter((_, k) => k !== idx) : [...arr, { id: Date.now(), searchKey: value }];
      return { ...prev, [filterKey]: nextArr };
    });
  };

  // ✅ FIXED: correct params + correct response parsing
  const fetchData = async () => {
    try {
      setLoading(true);

      const encodedFilterList = encodeURIComponent(JSON.stringify(filterList));
      const startTime = performance.now();

      // API expects: search/minDt/maxDt/page/perpage/sort
      const url =
        `/api/memory/component?search=${encodeURIComponent(searchTerm)}` +
        `&minDt=${encodeURIComponent(String(priceFilter[0] ?? 0))}` +
        `&maxDt=${encodeURIComponent(String(priceFilter[1] ?? 999999999))}` +
        `&sort=${encodeURIComponent(selectedSort)}` +
        `&page=${encodeURIComponent(String(currentPage + 1))}` + // API is 1-based
        `&perpage=${encodeURIComponent(String(PER_PAGE))}` +
        `&filterList=${encodedFilterList}` +
        `${compatible && props.motherboardId ? `&motherboardId=${props.motherboardId.id}` : ""}`;

      const response = await fetch(url, { cache: "no-store" });

      const list = (await response.json()) as Memory[];
      const endTime = performance.now();
      setSearchTime((endTime - startTime) / 1000);

      setData(Array.isArray(list) ? list : []);

      // total count comes from header
      const totalHeader = response.headers.get("X-Total-Count");
      const total = totalHeader ? Number(totalHeader) : 0;
      setTotalCount(Number.isFinite(total) ? total : 0);

      // AI recommendation (safe)
      try {
        const res = await getRecommendations(props.selectedFeatures);
        const firstRec = res?.recommendations?.[0];
        if (firstRec && typeof firstRec.memorySpeed === "number") {
          setRecommendedram(firstRec.memorySpeed);
        } else {
          setRecommendedram(undefined);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setRecommendedram(undefined);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Single effect only (no duplicate fetch)
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedSort]);

  // If you want live update when search/filter changes, call fetchData manually via your Filter button.
  // But we should reset page when changing search.
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, priceFilter, compatible, filterList]);

  function haveCommonElement<T>(set1: T[], array2: T[]): boolean {
    const array1 = Array.from(set1);
    for (const item of array1) if (array2.includes(item)) return true;
    return false;
  }

  const checkcompatibility = (product: Product) => {
    const mb = props.motherboardId;
    if (mb) {
      const MProfiles = props.profiles.filter((e) => e.motherboards.find((ee) => ee.productId == mb.id));
      const PProfiles = props.profiles.filter((e) =>
        e.RAMs.find((ee) => ee.Components.find((zz) => zz.productId == product.id))
      );
      return haveCommonElement(MProfiles, PProfiles);
    }
    return true;
  };

  const [openDialog, steOpenDialog] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescription = () => setShowFullDescription(!showFullDescription);
  const [openedramSlot, setopenedramSlot] = useState(0);

  // compatibility summary
  useEffect(() => {
    const updates: Record<string, { message: string; error: boolean }> = {};
    const messages: string[] = [];

    if (props.motherboardId) {
      props.rams.forEach((e, k) => {
        if (e != null) {
          const typeName = e.memories?.[0]?.type?.name;
          if (typeName && typeName === props.ramSlotType) messages.push("Compatible");
          else messages.push(props.ramSlotType + " à " + k + " est requis");
        }
      });
    }

    if (messages.length > 0) {
      const notCompat = messages.filter((e) => e !== "Compatible");
      updates["ramCompatibility"] =
        notCompat.length === 0
          ? { message: "Compatible", error: false }
          : { message: messages.join(""), error: true };
    } else {
      updates["ramCompatibility"] = { message: "Please select at least one RAM module", error: true };
    }

    props.setCompatibility(updates);
  }, [props.rams, props.motherboardId, props.ramSlotType, props.setCompatibility]);

  const addEmptyCase = () => props.setRams((prev) => [...prev, null]);
  const add2EmptyCase = () => props.setRams((prev) => [...prev, null, null]);

  const updateCase = (index: number, item: Memory | null) => {
    props.setRams((prev) => {
      const updated = [...prev];
      updated[index] = item;
      return updated;
    });
    const speedName = getMemorySpeedName(item);
    if (item && speedName) props.addFeature("Memory_Speed", extractNumber(speedName));
  };

  const updateonecasefortwocase = (index: number, item: Memory | null) => {
    props.setRams((prev) => {
      const updated = [...prev, null];
      updated[index] = item;
      return updated;
    });
    const speedName = getMemorySpeedName(item);
    if (item && speedName) props.addFeature("Memory_Speed", extractNumber(speedName));
  };

  const updatewithremove2case = (index: number, item: Memory | null) => {
    props.setRams((prev) => {
      const updated = [...prev];
      updated[index] = item;
      const idx = updated.indexOf(null);
      if (idx !== -1) updated.splice(idx, 1);
      return updated;
    });
    const speedName = getMemorySpeedName(item);
    if (item && speedName) props.addFeature("Memory_Speed", extractNumber(speedName));
  };

  function extractLesserNumber(memoryString: string | undefined | null): number | null {
    if (!memoryString) return null;
    const s = memoryString.replace(/\s/g, "");
    const match = s.match(/\b(\d+)X(\d+)/i);
    if (!match) return null;
    return Math.min(parseInt(match[1], 10), parseInt(match[2], 10));
  }

  const is2caseProduct = (item: Memory) => extractLesserNumber(item?.name) === 2;

  const updateElementAtIndex = (ind: number, newVe: Memory | null) => {
    const index = ind;
    const newValue = newVe;
    const prvprod = props.rams[index];

    if (newValue === null) {
      if (prvprod && is2caseProduct(prvprod)) {
        updateCase(index, null);
        addEmptyCase();
      } else updateCase(index, null);
    } else if (prvprod === null) {
      if (is2caseProduct(newValue)) {
        if (props.rams.filter((e) => e === null).length >= 2) {
          updatewithremove2case(index, newValue);
          toast.success("Ce produit a 2 barrettes RAM");
        } else toast.error("This product has 2 RAM slots, please free up another RAM slot.1");
      } else updateCase(index, newValue);
    } else {
      if (prvprod && is2caseProduct(prvprod) && !is2caseProduct(newValue)) {
        updateonecasefortwocase(index, newValue);
      } else {
        if (props.rams.filter((e) => e === null).length >= 1) {
          updateCase(index, newValue);
          toast.success("Ce produit a 2 barrettes RAM");
        } else if (prvprod && is2caseProduct(prvprod)) updateCase(index, newValue);
        else {
          if (!is2caseProduct(prvprod) && !is2caseProduct(newValue)) updateCase(index, newValue);
          else toast.error("This product has 2 RAM slots, please free up another RAM slot.2");
        }
      }
    }

    const speedName = getMemorySpeedName(newValue);
    if (newValue && speedName) props.addFeature("Memory_Speed", extractNumber(speedName));
  };

  // normalize RAM array based on slot count
  useEffect(() => {
    const filtered = props.rams.filter((e) => e != null) as Memory[];

    if (props.ramSlotNumber === 2) {
      let n = 0,
        i = 0;
      const arr: (Memory | null)[] = [];
      filtered.forEach((it) => {
        if (it && is2caseProduct(it) && n < 2) {
          n += 2;
          arr[i] = it;
          i++;
        }
      });
      filtered.forEach((it) => {
        if (it && !is2caseProduct(it) && n < 2) {
          n += 1;
          arr[i] = it;
          i++;
        }
      });
      if (i === 0) n = 1;
      for (let Xy = i; Xy < 3 - n; Xy++) arr[Xy] = null;
      props.setRams(() => [...arr]);
    } else if (props.ramSlotNumber === 4) {
      let n = 0,
        i = 0;
      const arr: (Memory | null)[] = [];
      filtered.forEach((it) => {
        if (it && is2caseProduct(it) && n < 4) {
          n += 2;
          arr[i] = it;
          i++;
        }
      });
      filtered.forEach((it) => {
        if (it && !is2caseProduct(it) && n < 4) {
          n += 1;
          arr[i] = it;
          i++;
        }
      });
      for (let Xy = i; Xy < 5 - n; Xy++) arr[Xy] = null;
      props.setRams(() => [...arr]);
    }
  }, [props.ramSlotNumber, props.motherboardId]); // keep

  const ramCompatibility = (mem: Memory, index: number) => {
    let comp = false;
    let message = "Please select at least one RAM module";
    const motherboardId = props.motherboardId;

    if (motherboardId) {
      const MProfiles = props.profiles.filter((e) =>
        e.motherboards.find((ee) => ee.productId == motherboardId.id)
      );
      const typeName = mem.memories?.[0]?.type?.name;

      if (typeName && typeName === props.ramSlotType) {
        const RProfiles = props.profiles.filter((xe) =>
          xe.RAMs.find((ee) => ee.Components.find((re) => re.productId === mem.id))
        );
        if (haveCommonElement(MProfiles, RProfiles)) {
          message = "Compatible";
          comp = true;
        } else {
          message = "Non Compatible";
          comp = false;
        }
      } else {
        message = props.ramSlotType === "" ? "chargement en cours" : "Barrette RAM " + props.ramSlotType + " est requis";
        comp = false;
      }
    }
    return { comp, message };
  };

  return (
    <div className="text-foreground">
      {/* ... UI ABOVE IS UNCHANGED ... */}

      {/* DIALOG */}
      <Dialog open={openDialog} onOpenChange={(o) => steOpenDialog(o)}>
        <DialogTrigger asChild />
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
          <DialogHeader className="sticky top-0 z-10 bg-[#101218] border-b border-border px-4 py-3">
            <DialogTitle>
              <div className="flex justify-between items-center">
                <h1>RAM module store</h1>

                <Menu as="div" className="relative inline-block text-left">
                  <div className="flex">
                    <Menu.Button className="group inline-flex items-center text-sm font-medium">
                      Sort&nbsp;<span className="text-[#e6e8ee]">{selectedSort}</span>
                      <ChevronDownIcon className="ml-1 h-5 w-5 text-[#a6adc8]" aria-hidden="true" />
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-[#12141b] text-[#e6e8ee] border border-border shadow-2xl focus:outline-none">
                      <div className="py-1">
                        {sortOptions.map((option) => (
                          <Menu.Item key={option.name}>
                            {({ active }) => (
                              <button
                                type="button"
                                onClick={() => {
                                  handleSortClick(option.name);
                                  setCurrentPage(0);
                                }}
                                className={classNames(
                                  option.current ? "cursor-pointer text-[#00e0ff] font-medium" : "cursor-pointer text-[#a6adc8]",
                                  active ? "bg-[#101218]" : "",
                                  "block w-full text-left px-4 py-2 text-sm"
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
              </div>
            </DialogTitle>
          </DialogHeader>

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
                setTotalPages={() => {}} // not used anymore
                totalPages={totalCount}   // display only
              />

              {(props.memoryMarque?.list?.length ?? 0) > 0 && (
                <>
                  {props.motherboardId ? (
                    <div className="mt-2">
                      <label className="text-sm inline-flex items-center gap-2">
                        <Input
                          type="checkbox"
                          className="w-3 h-3 m-0"
                          checked={compatible}
                          onChange={(e) => setcompatible(e.target.checked)}
                        />
                        Compatible with Motherboard
                      </label>
                    </div>
                  ) : null}

                  {(["memoryMarque", "memoryFrequency", "memoryType", "memoryNumber"] as const).map((key) => {
                    const filterData = props[key] as Filter | undefined;
                    if (!filterData?.list) return null;
                    return (
                      <CheckboxGroup
                        key={key}
                        label={filterData.title.toString()}
                        items={filterData.list}
                        onChange={(value) => handleCheckboxChange(key as any, value)}
                        selectedItems={filterList[key as keyof checkItemGroupsRam].map((item) => item.searchKey)}
                      />
                    );
                  })}
                </>
              )}
            </div>

            {/* RESULTS */}
            <div className="col-span-12 md:col-span-8 lg:col-span-9 overflow-y-auto">
              {loading ? (
                <div>
                  <Container>
                    <div className="w-full h-full p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {Array.from({ length: PER_PAGE }).map((_, i) => (
                          <Skeleton key={i} className="w-full h-48 rounded-xl" />
                        ))}
                      </div>
                    </div>
                  </Container>
                </div>
              ) : (
                <>
                  {data.length === 0 && <p className="text-[#a6adc8]">{ui.builderNoResults}.</p>}

                  {data.length > 0 && (
                    <>
                      <div className="text-xs text-[#a6adc8] mb-2">
                        ({totalCount}) {ui.builderResultsSummary(totalCount, searchTime)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {data.map((item, key) => {
                          const speedName = getMemorySpeedName(item);
                          const speedValue = extractNumber(speedName);
                          const isRecommended = speedValue != null && speedValue === recommendedram;

                          return (
                            <div
                              key={key}
                              className={`bg-[#12141b] hover:bg-[#101218] transition flex flex-col justify-between group cursor-pointer rounded-xl border border-white/5 p-3 space-y-1 ${
                                checkcompatibility(item) ? "ring-1 ring-[#00e0ff]/50" : "ring-1 ring-red-500/40"
                              }`}
                            >
                              {isRecommended && (
                                <span className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-2 py-0.5 rounded-full text-xs font-semibold w-fit">
                                  Recommended by AI
                                </span>
                              )}

                              <div>
                                <div className="aspect-square rounded-xl relative">
                                  <Image
                                    src={item.images?.[0]?.url || ""}
                                    alt={item.name || ""}
                                    fill
                                    className="aspect-square object-cover rounded-md"
                                  />
                                </div>

                                <div className="mt-2">
                                  <p className="font-semibold text-sm leading-tight">{item.name}</p>
                                  <p className="text-xs text-[#a6adc8]">{item.category?.name}</p>
                                </div>

                                <div className="flex items-center justify-between text-xs mt-1">
                                  <Currency value={item?.price} />
                                </div>
                              </div>

                              <div className="w-full">
                                <InlineDetails text={item.description} />

                                <Button
                                  type="button"
                                  disabled={item.stock == 0}
                                  onClick={() => {
                                    updateElementAtIndex(openedramSlot, item);
                                    steOpenDialog(false);
                                  }}
                                  className="w-full btn-primary-blue"
                                >
                                  {item.stock == 0 ? "Hors Stock" : ui.builderBtnAdd}
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
                {totalCount > 0 && !loading && data.length > 0 && (
                  <Pagination
                    isCompact
                    showControls
                    total={totalPages}
                    page={currentPage + 1}
                    onChange={(p) => setCurrentPage(p - 1)}
                    classNames={{
                      wrapper: "gap-2",
                      item: "w-8 h-8 text-foreground bg-white/10 border border-white/20 hover:bg-white/20",
                      cursor:
                        "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold shadow-[0_0_20px_hsl(var(--accent)/0.15)]",
                      prev: "bg-white/10 border border-white/20 text-foreground hover:bg-white/20",
                      next: "bg-white/10 border border-white/20 text-foreground hover:bg-white/20",
                    }}
                  />
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Checkbox group
const CheckboxGroup = (props: {
  label: string;
  items: filterItem[];
  onChange: (value: string) => void;
  selectedItems: string[];
}) => {
  const items = props.items || [];
  return (
    <div className="text-foreground">
      <br />
      <p className="text-sm font-semibold">{props.label}</p>
      {items.map((item) => (
        <div key={item.name}>
          <div className="flex items-center">
            <Input
              type="checkbox"
              className="appearance-none w-3 h-3 m-2"
              value={item.name}
              checked={props.selectedItems.includes(item.name)}
              onChange={() => props.onChange(item.name)}
            />
            <label className="text-sm text-foreground/70">
              {item.name} ({item.number})
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Ram;
