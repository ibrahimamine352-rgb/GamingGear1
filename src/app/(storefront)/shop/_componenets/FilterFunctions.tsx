// app/(storefront)/_componenets/FilterFunctions.ts
import { FilterList } from "../page";

/* small helper for numeric options like “16 Gb”, “3 Fans”, etc. */
const onlyNums = (arr: { searchKey: string }[] = []) =>
  arr
    .map(i => parseInt(String(i.searchKey).replace(/[^\d]/g, ""), 10))
    .filter(n => Number.isFinite(n));

/* -------------------- MOTHERBOARD -------------------- */
export const addmotherboardFitlters = (decoded: FilterList) => {
  const where: any = { motherboard: { some: {} } };
  const and: any[] = [];

  if (decoded.motherboardchipset?.length)
    and.push({ chipset: { name: { in: decoded.motherboardchipset.map(i => i.searchKey) } } });

  if (decoded.motherboardcpusupport?.length)
    and.push({ cpusupport: { name: { in: decoded.motherboardcpusupport.map(i => i.searchKey) } } });

  if (decoded.motherboardformat?.length)
    and.push({ format: { name: { in: decoded.motherboardformat.map(i => i.searchKey) } } });

  if (decoded.motherboardmanufacturer?.length)
    and.push({ manufacturer: { name: { in: decoded.motherboardmanufacturer.map(i => i.searchKey) } } });

  if (decoded.motherboardramslots?.length)
    and.push({ ramslots: { name: { in: decoded.motherboardramslots.map(i => i.searchKey) } } });

  if (and.length) where.motherboard = { some: { AND: and } };
  return { data: where.motherboard };
};

/* -------------------- CPU -------------------- */
/* -------------------- CPU -------------------- */
export const addcpuFitlters = (decoded: FilterList) => {
  // "decoded" is the decoded filterList from query params
  // It may contain selected checkboxes from the UI.
  // We build a Prisma "where" fragment for product -> cpus relation.

  const where: any = { cpus: { some: {} } };
  const and: any[] = [];

  // Socket filter (ex: AM5, LGA1700, etc.)
  if (decoded.cPUSupport?.length) {
    and.push({
      cpusupport: {
        name: {
          in: decoded.cPUSupport.map((i) => i.searchKey),
        },
      },
    });
  }

  // Model filter (ex: AMD, Intel, etc.)
  if (decoded.processorModel?.length) {
    and.push({
      processorModel: {
        name: {
          in: decoded.processorModel.map((i) => i.searchKey),
        },
      },
    });
  }

  // If any filters were selected, wrap them in AND inside cpus.some
  if (and.length) {
    where.cpus = { some: { AND: and } };
  }

  // Return what the main page expects
  return { data: where.cpus };
};


/* -------------------- GPU -------------------- */
export const addgpuitlters = (decoded: FilterList) => {
  const where: any = { gpus: { some: {} } };
  const and: any[] = [];

  if (decoded.gpuArchBrand?.length)
    and.push({ gpuArchBrand: { name: { in: decoded.gpuArchBrand.map(i => i.searchKey) } } });

  if (decoded.gpuBrand?.length)
    and.push({ gpuBrand: { name: { in: decoded.gpuBrand.map(i => i.searchKey) } } });

  if (decoded.graphiccardName?.length)
    and.push({ graphiccardName: { name: { in: decoded.graphiccardName.map(i => i.searchKey) } } });

  if (and.length) where.gpus = { some: { AND: and } };
  return { data: where.gpus };
};

/* -------------------- RAM -------------------- */
export const addRamFitlters = (decoded: FilterList) => {
  const where: any = { memories: { some: {} } };
  const and: any[] = [];

  if (decoded.memoryFrequency?.length)
    and.push({ frequency: { name: { in: decoded.memoryFrequency.map(i => i.searchKey) } } });

  if (decoded.memoryNumber?.length)
    and.push({ number: { number: { in: onlyNums(decoded.memoryNumber) } } });

  if (decoded.memoryType?.length)
    and.push({ type: { name: { in: decoded.memoryType.map(i => i.searchKey) } } });

  if (decoded.memoryMarque?.length)
    and.push({ marque: { name: { in: decoded.memoryMarque.map(i => i.searchKey) } } });

  if (and.length) where.memories = { some: { AND: and } };
  return { data: where.memories };
};

/* -------------------- STORAGE -------------------- */
export const addHardDiskFitlters = (decoded: FilterList) => {
  const where: any = { storages: { some: {} } };
  const and: any[] = [];

  if (decoded.harddiskBrand?.length)
    and.push({ brand: { name: { in: decoded.harddiskBrand.map(i => i.searchKey) } } });

  // capacity.name is a STRING in your schema (e.g., "512GB")
  if (decoded.harddiskCapacity?.length)
    and.push({ capacity: { name: { in: decoded.harddiskCapacity.map(i => i.searchKey) } } });

  if (decoded.harddiskComputerinterface?.length)
    and.push({ Computerinterface: { name: { in: decoded.harddiskComputerinterface.map(i => i.searchKey) } } });

  if (decoded.harddiskType?.length)
    and.push({ type: { name: { in: decoded.harddiskType.map(i => i.searchKey) } } });

  if (and.length) where.storages = { some: { AND: and } };
  return { data: where.storages };
};

/* -------------------- CASES -------------------- */
export const addCaseFitlters = (decoded: FilterList) => {
  const where: any = { cases: { some: {} } };
  const and: any[] = [];

  if (decoded.pCcaseBrand?.length)
    and.push({ brand: { name: { in: decoded.pCcaseBrand.map(i => i.searchKey) } } });

  if (decoded.pCcaseCaseformat?.length)
    and.push({ caseformat: { name: { in: decoded.pCcaseCaseformat.map(i => i.searchKey) } } });

  if (decoded.pCcaseNumberofFansPreinstalled?.length)
    and.push({ numberofFansPreinstalled: { name: { in: decoded.pCcaseNumberofFansPreinstalled.map(i => i.searchKey) } } });

  if (decoded.pCcaseRGBType?.length)
    and.push({ rGBType: { name: { in: decoded.pCcaseRGBType.map(i => i.searchKey) } } });

  if (and.length) where.cases = { some: { AND: and } };
  return { data: where.cases };
};

/* -------------------- PSU -------------------- */
export const addPowerFitlters = (decoded: FilterList) => {
  const where: any = { powersupplies: { some: {} } };
  const and: any[] = [];

  if (decoded.powersupplyMarque?.length)
    and.push({ Marque: { name: { in: decoded.powersupplyMarque.map(i => i.searchKey) } } });

  if (decoded.psCertification?.length)
    and.push({ certification: { name: { in: decoded.psCertification.map(i => i.searchKey) } } });

  if (and.length) where.powersupplies = { some: { AND: and } };
  return { data: where.powersupplies };
};

/* -------------------- COOLING (fixed CPUSupport + numeric Fans) -------------------- */
export const addCoolingFitlters = (decoded: FilterList) => {
  const where: any = { cooling: { some: {} } };
  const and: any[] = [];

  if (decoded.coolingMark?.length)
    and.push({ CoolingMark: { name: { in: decoded.coolingMark.map(i => i.searchKey) } } });

  if (decoded.coolingType?.length)
    and.push({ CoolingType: { name: { in: decoded.coolingType.map(i => i.searchKey) } } });

  // schema uses **CPUSupport** (capitalized)
  if (decoded.coolingcPUSupport?.length)
    and.push({ CPUSupport: { name: { in: decoded.coolingcPUSupport.map(i => i.searchKey) } } });

  if (decoded.fansNumber?.length) {
    const nums = onlyNums(decoded.fansNumber);
    if (nums.length) and.push({ FansNumber: { number: { in: nums } } });
  }

  if (and.length) where.cooling = { some: { AND: and } };
  return { data: where.cooling };
};

/* -------------------- SCREENS -------------------- */
export const addScreenFitlters = (decoded: FilterList) => {
  const where: any = { screens: { some: {} } };
  const and: any[] = [];

  if (decoded.mark?.length)
    and.push({ Mark: { name: { in: decoded.mark.map(i => i.searchKey) } } });

  if (decoded.pouce?.length)
    and.push({ Pouce: { name: { in: decoded.pouce.map(i => i.searchKey) } } });

  if (decoded.refreshRate?.length)
    and.push({ RefreshRate: { name: { in: decoded.refreshRate.map(i => i.searchKey) } } });

  if (decoded.resolution?.length)
    and.push({ resolution: { name: { in: decoded.resolution.map(i => i.searchKey) } } });

  // ✅ NEW: Type filter using Category ("Screen Gaming", "Screen Pro")
  if (decoded.screenType?.length) {
    const names = decoded.screenType.map(i => i.searchKey);
    and.push({
      products: {
        some: {
          category: {
            name: { in: names },
          },
        },
      },
    });
  }

  if (and.length) where.screens = { some: { AND: and } };
  return { data: where.screens };
};


/* -------------------- LAPTOP (Product relation is `Laptop`) -------------------- */
export const addLaptopFitlters = (decoded: FilterList) => {
  const where: any = { Laptop: { some: {} } };
  const and: any[] = [];

  if (decoded.LapSystem?.length)       and.push({ System: { name: { in: decoded.LapSystem.map(i => i.searchKey) } } });
  if (decoded.LapProcesseur?.length)   and.push({ Processeur: { name: { in: decoded.LapProcesseur.map(i => i.searchKey) } } });
  if (decoded.LapGraphiccard?.length)  and.push({ Graphiccard: { name: { in: decoded.LapGraphiccard.map(i => i.searchKey) } } });
  if (decoded.LapScreenSize?.length)   and.push({ ScreenSize: { name: { in: decoded.LapScreenSize.map(i => i.searchKey) } } });
  if (decoded.LapScreenType?.length)   and.push({ ScreenType: { name: { in: decoded.LapScreenType.map(i => i.searchKey) } } });
  if (decoded.LapHardisk?.length)      and.push({ Hardisk: { name: { in: decoded.LapHardisk.map(i => i.searchKey) } } });
  if (decoded.Lapmemory?.length)       and.push({ memory: { name: { in: decoded.Lapmemory.map(i => i.searchKey) } } });
  if (decoded.Lapnetwork?.length)      and.push({ network: { name: { in: decoded.Lapnetwork.map(i => i.searchKey) } } });
  if (decoded.LapSound?.length)        and.push({ Sound: { name: { in: decoded.LapSound.map(i => i.searchKey) } } });
  if (decoded.LapCamera?.length)       and.push({ Camera: { name: { in: decoded.LapCamera.map(i => i.searchKey) } } });
  if (decoded.LapRefreshRate?.length)  and.push({ RefreshRate: { name: { in: decoded.LapRefreshRate.map(i => i.searchKey) } } });
  if (decoded.manufacturer?.length)    and.push({ Manufacturer: { name: { in: decoded.manufacturer.map(i => i.searchKey) } } });

  if (and.length) where.Laptop = { some: { AND: and } };
  return { data: where.Laptop };
};

/* -------------------- KEYBOARD -------------------- */
export const addKeyboardFitlters = (decoded: FilterList) => {
  const where: any = { keyboard: { some: {} } };
  const and: any[] = [];

  if (decoded.manufacturer?.length)
    and.push({ Manufacturer: { name: { in: decoded.manufacturer.map(i => i.searchKey) } } });

  if (decoded.keyboarFormat?.length)
    and.push({ keyboarFormat: { name: { in: decoded.keyboarFormat.map(i => i.searchKey) } } });

  if (decoded.keyboarTouchType?.length)
    and.push({ keyboarTouchType: { name: { in: decoded.keyboarTouchType.map(i => i.searchKey) } } });

  if (and.length) where.keyboard = { some: { AND: and } };
  return { data: where.keyboard };
};

/* -------------------- HEADSET -------------------- */
export const addHeadsetFitlters = (decoded: FilterList) => {
  const where: any = { Headset: { some: {} } };
  const and: any[] = [];

  if (decoded.manufacturer?.length)
    and.push({ Manufacturer: { name: { in: decoded.manufacturer.map(i => i.searchKey) } } });

  if (decoded.headsetModel?.length)
    and.push({ HeadsetModel: { name: { in: decoded.headsetModel.map(i => i.searchKey) } } });

  if (decoded.headsetSonSurround?.length)
    and.push({ HeadsetSonSurround: { name: { in: decoded.headsetSonSurround.map(i => i.searchKey) } } });

  if (decoded.headsetInterfaceAvecOrdinateur?.length)
    and.push({ HeadsetInterfaceAvecOrdinateur: { name: { in: decoded.headsetInterfaceAvecOrdinateur.map(i => i.searchKey) } } });

  if (and.length) where.Headset = { some: { AND: and } };
  return { data: where.Headset };
};

/* -------------------- MOUSE -------------------- */
export const addMouseFitlters = (decoded: FilterList) => {
  const where: any = { Mouse: { some: {} } };
  const and: any[] = [];

  if (decoded.manufacturer?.length)
    and.push({ Manufacturer: { name: { in: decoded.manufacturer.map(i => i.searchKey) } } });

  if (decoded.SensorType?.length)
    and.push({ SensorType: { name: { in: decoded.SensorType.map(i => i.searchKey) } } });

  if (and.length) where.Mouse = { some: { AND: and } };
  return { data: where.Mouse };
};

/* -------------------- MOUSEPAD -------------------- */
export const addMousepadFitlters = (decoded: FilterList) => {
  const where: any = { Mousepad: { some: {} } };
  const and: any[] = [];

  if (decoded.manufacturer?.length)
    and.push({ Manufacturer: { name: { in: decoded.manufacturer.map(i => i.searchKey) } } });

  if (decoded.mousepadModel?.length)
    and.push({ MousepadModel: { name: { in: decoded.mousepadModel.map(i => i.searchKey) } } });

  if (decoded.mousepadSize?.length)
    and.push({ MousepadSize: { name: { in: decoded.mousepadSize.map(i => i.searchKey) } } });

  if (and.length) where.Mousepad = { some: { AND: and } };
  return { data: where.Mousepad };
};

/* -------------------- MIC -------------------- */
export const addMicFitlters = (decoded: FilterList) => {
  const where: any = { Mic: { some: {} } };
  const and: any[] = [];

  if (decoded.manufacturer?.length)
    and.push({ Manufacturer: { name: { in: decoded.manufacturer.map(i => i.searchKey) } } });

  if (decoded.micModel?.length)
    and.push({ MicModel: { name: { in: decoded.micModel.map(i => i.searchKey) } } });

  if (decoded.micInterfaceAvecOrdinateur?.length)
    and.push({ MicInterfaceAvecOrdinateur: { name: { in: decoded.micInterfaceAvecOrdinateur.map(i => i.searchKey) } } });

  if (decoded.micSonSurround?.length)
    and.push({ MicSonSurround: { name: { in: decoded.micSonSurround.map(i => i.searchKey) } } });

  if (and.length) where.Mic = { some: { AND: and } };
  return { data: where.Mic };
};
// 👇 ADD THIS BLOCK somewhere with the other addXXXFitlters


export const addCameraFitlters = (decoded: FilterList) => {
  const where: any = { Camera: { some: {} } };
  const and: any[] = [];

  // 🔹 Later, when you add real camera filters (brand, resolution, etc),
  //     you will push Prisma conditions into `and` here.
  //
  // Example for future:
  // if (decoded.mark?.length) {
  //   and.push({
  //     Mark: { name: { in: decoded.mark.map(i => i.searchKey) } },
  //   });
  // }

  if (and.length) {
    where.Camera = { some: { AND: and } };
  }

  return { data: where.Camera };
};

export const addControllerFitlters = (decoded: FilterList) => {
  const where: any = { Controller: { some: {} } };
  const and: any[] = [];

  // 🔹 Same idea here: add conditions when you create filters
  // example in the future (brand, type, etc)

  if (and.length) {
    where.Controller = { some: { AND: and } };
  }

  return { data: where.Controller };
};

