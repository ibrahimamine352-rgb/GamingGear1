"use client";

import MotherboardCol from "./motherboard";
import { ProdCol } from "@/types";

type Props = {
  unity: ProdCol[];
  screen: ProdCol[];
  pack: ProdCol[];

  setUnity: (v: ProdCol[]) => void;
  setScreen: (v: ProdCol[]) => void;
  setPack: (v: ProdCol[]) => void;

  defaultUnity: string;
  defaultScreen: string;
  defaultPack: string;

  setDefaultUnity: (id: string) => void;
  setDefaultScreen: (id: string) => void;
  setDefaultPack: (id: string) => void;

  unities: ProdCol[];
  screens: ProdCol[];
  packs: ProdCol[];
};

const Pctemplate: React.FC<Props> = ({
  unity,
  screen,
  pack,
  setUnity,
  setScreen,
  setPack,
  defaultUnity,
  defaultScreen,
  defaultPack,
  setDefaultUnity,
  setDefaultScreen,
  setDefaultPack,
  unities,
  screens,
  packs,
}) => {
  return (
    <>
      <MotherboardCol
        value={unity}
        onChange={setUnity}
        defaultId={defaultUnity}
        setDefaultId={setDefaultUnity}
        items={unities}
      />

      <MotherboardCol
        value={screen}
        onChange={setScreen}
        defaultId={defaultScreen}
        setDefaultId={setDefaultScreen}
        items={screens}
      />

      <MotherboardCol
        value={pack}
        onChange={setPack}
        defaultId={defaultPack}
        setDefaultId={setDefaultPack}
        items={packs}
      />
    </>
  );
};

export default Pctemplate;
