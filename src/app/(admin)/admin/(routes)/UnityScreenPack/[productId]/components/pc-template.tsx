"use client"
import { CPUSupport, CompatibiltyProfile, ComponentOnPc, Product } from '@prisma/client'
import React, { useState } from 'react'
import MotherboardCOl from "./motherboard";
import { buildPcSelection } from '../../../Compatibilty-profile/[productId]/components/product-form'
import { ProdCol } from '@/types'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export type motherboardata = { products: Product[]; cpusupport: CPUSupport };
type ramSlot = { rams: ProdCol[] };
type DiskSlot = { disk: ProdCol[] };

interface ProductFormProps {
  initialData:
    | (Product & {
        FullPack: {
          id: number;
          Unity: ProdCol[];
          Screen: ProdCol[];
          Pack: ProdCol[];
          DefaultUnity: string;
          DefaultPack: string;
          DefaultScreen: string;
          discountOnPack: number;
        }[];
      })
    | null;

  // use primitive string (not String object)
  DefaultUnity: string;
  DefaultPack: string;
  DefaultScreen: string;

  // accept either a simple function or a React state setter
  setDefaultUnity:
    | ((id: string) => void)
    | React.Dispatch<React.SetStateAction<string>>;
  setDefaultPack:
    | ((id: string) => void)
    | React.Dispatch<React.SetStateAction<string>>;
  setDefaultScreen:
    | ((id: string) => void)
    | React.Dispatch<React.SetStateAction<string>>;

  UnityList: ProdCol[];
  PackList: ProdCol[];
  screensList: ProdCol[];

  setUnityList:
    | ((items: ProdCol[]) => void)
    | React.Dispatch<React.SetStateAction<ProdCol[]>>;
  setPackList:
    | ((items: ProdCol[]) => void)
    | React.Dispatch<React.SetStateAction<ProdCol[]>>;
  setscreensList:
    | ((items: ProdCol[]) => void)
    | React.Dispatch<React.SetStateAction<ProdCol[]>>;

  screens: ProdCol[];
  unities: ProdCol[];
  packs: ProdCol[];
}

const formSchema = z.object({
  motherboards: z.object({ id: z.string() }).array(),
  selectionStatu: z.object({
    motherboardIsSelected: z.boolean().default(false).optional(),
    cpuIsSelected: z.boolean().default(false).optional(),
    gpuIsSelected: z.boolean().default(false).optional(),
    ramIsSelected: z.boolean().default(false).optional(),
    caseIsSelected: z.boolean().default(false).optional(),
    diskIsSelected: z.boolean().default(false).optional(),
    powerIsSelected: z.boolean().default(false).optional(),
  }),
});

type ProductFormValues = z.infer<typeof formSchema>;

const Pctemplate: React.FC<ProductFormProps> = ({
  initialData,
  DefaultUnity,
  DefaultPack,
  DefaultScreen,
  setDefaultUnity,
  setDefaultPack,
  setDefaultScreen,
  UnityList,
  PackList,
  screensList,
  setUnityList,
  setPackList,
  setscreensList,
  screens,
  packs,
  unities,
}) => {
  const defaultValues = initialData
    ? {
        ...initialData,
        selectionStatu: {
          motherboardIsSelected: false,
          cpuIsSelected: false,
          gpuIsSelected: false,
          ramIsSelected: false,
          caseIsSelected: false,
          diskIsSelected: false,
          powerIsSelected: false,
          coolingIsSelected: false,
        },
      }
    : {
        selectionStatu: {
          motherboardIsSelected: false,
          cpuIsSelected: false,
          gpuIsSelected: false,
          ramIsSelected: false,
          caseIsSelected: false,
          diskIsSelected: false,
          powerIsSelected: false,
          coolingIsSelected: false,
        },
      };

  useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [selectionStatu, setSelectionStatu] = useState<buildPcSelection>(
    defaultValues.selectionStatu
  );
  const [LastmotherboardId, setLastMotherBoardId] = useState("");
  const [motherboardId, setMotherBoardId] = useState("");

  return (
    <>
      <div>
        <div className="font-semibold">Unity</div>
        <MotherboardCOl
          init={UnityList}
          // If MotherboardCOl expects `String`, cast here to avoid TS mismatch
          MotherBoardId={DefaultUnity as unknown as String}
          setMotherBoardId={setDefaultUnity as any}
          lastMotherBoardId={LastmotherboardId}
          colname="mb"
          motherboards={unities}
          updateList={setUnityList as any}
          selectionStaue={selectionStatu}
          onSlectionChange={setSelectionStatu}
        />
      </div>

      <div>
        <div className="font-semibold">screens</div>
        <MotherboardCOl
          init={screensList}
          MotherBoardId={DefaultScreen as unknown as String}
          setMotherBoardId={setDefaultScreen as any}
          lastMotherBoardId={LastmotherboardId}
          colname="cpu"
          motherboards={screens}
          updateList={setscreensList as any}
          selectionStaue={selectionStatu}
          onSlectionChange={setSelectionStatu}
        />
      </div>

      <div>
        <div className="font-semibold">Pack</div>
        {/* Use a supported colname so the modal renders rows */}
        <MotherboardCOl
          init={PackList}
          MotherBoardId={DefaultPack as unknown as String}
          setMotherBoardId={setDefaultPack as any}
          lastMotherBoardId={LastmotherboardId}
          colname="cpu"
          motherboards={packs}
          updateList={setPackList as any}
          selectionStaue={selectionStatu}
          onSlectionChange={setSelectionStatu}
        />
      </div>
    </>
  );
};

export default Pctemplate;