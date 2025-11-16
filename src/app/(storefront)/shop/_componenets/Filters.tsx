import prismadb from "@/lib/prismadb";
import { Filter } from "../../build-pc/page";

export const PreBuiltPcmodelFilters = async () => {
  return {};
};

export const LaptopFilters = async () => {
  const LapSystemm = await prismadb.lapSystem.findMany({
    where: {
      laptops: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          laptops: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const LapSystem: Filter = {
    title: "Operating System",
    list: LapSystemm.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.laptops ?? 0,
    })),
  };

  const LapProcesseurr = await prismadb.lapProcesseur.findMany({
    where: {
      laptops: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          laptops: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const LapProcesseur: Filter = {
    title: "Processor",
    list: LapProcesseurr.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.laptops ?? 0,
    })),
  };

  const LapGraphiccardd = await prismadb.lapGraphiccard.findMany({
    where: {
      laptops: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          laptops: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const LapGraphiccard: Filter = {
    title: "Graphics Card",
    list: LapGraphiccardd.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.laptops ?? 0,
    })),
  };

  const LapGraphiccardReff = await prismadb.lapGraphiccardRef.findMany({
    where: {
      laptops: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          laptops: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const LapGraphiccardRef: Filter = {
    title: "Brand",
    list: LapGraphiccardReff.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.laptops ?? 0,
    })),
  };

  const LapScreenSizee = await prismadb.lapScreenSize.findMany({
    where: {
      laptops: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          laptops: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const LapScreenSize: Filter = {
    title: "Screen Size",
    list: LapScreenSizee.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.laptops ?? 0,
    })),
  };

  const LapScreenTypee = await prismadb.lapScreenType.findMany({
    where: {
      laptops: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          laptops: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const LapHardiskk = await prismadb.lapHardisk.findMany({
    where: {
      laptops: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          laptops: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const LapHardisk: Filter = {
    title: "Storage",
    list: LapHardiskk.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.laptops ?? 0,
    })),
  };

  const Lapmemoryy = await prismadb.lapmemory.findMany({
    where: {
      laptops: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          laptops: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const Lapmemory: Filter = {
    title: "Memory",
    list: Lapmemoryy.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.laptops ?? 0,
    })),
  };

  const LapRefreshRatee = await prismadb.lapRefreshRate.findMany({
    where: {
      laptops: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          laptops: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const LapRefreshRate: Filter = {
    title: "Refresh Rate",
    list: LapRefreshRatee.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.laptops ?? 0,
    })),
  };

  const markk = await prismadb.manufacturer.findMany({
    where: {
      Laptops: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          Laptops: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const manufacturer: Filter = {
    title: "Brand",
    list: markk.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.Laptops ?? 0,
    })),
  };

  return {
    title: "laptop",
    data: {
      manufacturer,
      LapSystem,
      LapProcesseur,
      LapGraphiccard,
      LapScreenSize,
      LapHardisk,
      Lapmemory,
      LapRefreshRate,
    },
  };
};

export const HeadsetFilters = async () => {
  const headsetModell = await prismadb.headsetModel.findMany({
    where: {
      Headset: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          Headset: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const headsetModel: Filter = {
    title: "Model",
    list: headsetModell.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.Headset ?? 0,
    })),
  };

  const headsetSonSurroundd = await prismadb.headsetSonSurround.findMany({
    where: {
      Headset: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          Headset: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const headsetSonSurround: Filter = {
    title: "Surround Sound",
    list: headsetSonSurroundd.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.Headset ?? 0,
    })),
  };

  const headsetInterfaceAvecOrdinateurr =
    await prismadb.headsetInterfaceAvecOrdinateur.findMany({
      where: {
        Headset: {
          some: {
            product: { some: {} },
          },
        },
      },
      include: {
        _count: {
          select: {
            Headset: {
              where: {
                product: { some: {} },
              },
            },
          },
        },
      },
    });

  const headsetInterfaceAvecOrdinateur: Filter = {
    title: "Interface With Computer",
    list: headsetInterfaceAvecOrdinateurr.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.Headset ?? 0,
    })),
  };

  const markk = await prismadb.manufacturer.findMany({
    where: {
      Headset: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          Headset: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const manufacturer: Filter = {
    title: "Brand",
    list: markk.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.Headset ?? 0,
    })),
  };

  return {
    title: "headset",
    data: {
      manufacturer,
      headsetSonSurround,
      headsetInterfaceAvecOrdinateur,
    },
  };
};

export const keyboardFilters = async () => {
  const keyboarFormatt = await prismadb.keyboarFormat.findMany({
    where: {
      keyboards: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          keyboards: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const keyboarFormat: Filter = {
    title: "Keyboard Format",
    list: keyboarFormatt.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.keyboards ?? 0,
    })),
  };

  const keyboarButtonsNumberr = await prismadb.keyboarButtonsNumber.findMany({
    where: {
      keyboards: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          keyboards: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const keyboarButtonsNumber: Filter = {
    title: "Number of Keys",
    list: keyboarButtonsNumberr.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.keyboards ?? 0,
    })),
  };

  const keyboarTouchTypee = await prismadb.keyboarTouchType.findMany({
    where: {
      keyboards: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          keyboards: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const keyboarTouchType: Filter = {
    title: "Switch Type",
    list: keyboarTouchTypee.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.keyboards ?? 0,
    })),
  };

  const markk = await prismadb.manufacturer.findMany({
    where: {
      keyboard: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          keyboard: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const manufacturer: Filter = {
    title: "Brand",
    list: markk.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.keyboard ?? 0,
    })),
  };

  return {
    title: "keyboard",
    data: {
      manufacturer,
      keyboarFormat,
      keyboarTouchType,
    },
  };
};

export const MicFilters = async () => {
  const micInterfaceAvecOrdinateurr =
    await prismadb.micInterfaceAvecOrdinateur.findMany({
      where: {
        Mic: {
          some: {
            product: { some: {} },
          },
        },
      },
      include: {
        _count: {
          select: {
            Mic: {
              where: {
                product: { some: {} },
              },
            },
          },
        },
      },
    });

  const micInterfaceAvecOrdinateur: Filter = {
    title: "Interface With Computer",
    list: micInterfaceAvecOrdinateurr.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.Mic ?? 0,
    })),
  };

  const micSonSurroundd = await prismadb.micSonSurround.findMany({
    where: {
      Mic: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          Mic: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const micSonSurround: Filter = {
    title: "Sound Surround",
    list: micSonSurroundd.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.Mic ?? 0,
    })),
  };

  const MicModel = await prismadb.micModel.findMany({
    where: {
      Mic: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          Mic: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const micModel: Filter = {
    title: "Model",
    list: MicModel.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.Mic ?? 0,
    })),
  };

  const markk = await prismadb.manufacturer.findMany({
    where: {
      Mic: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          Mic: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const manufacturer: Filter = {
    title: "Brand",
    list: markk.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.Mic ?? 0,
    })),
  };

  return {
    title: "microphone",
    data: {
      manufacturer,
      micModel,
      micInterfaceAvecOrdinateur,
    },
  };
};

export const MouseFilters = async () => {
  const SensorTypee = await prismadb.sensorType.findMany({
    where: {
      Mouse: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          Mouse: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const SensorType: Filter = {
    title: "Sensor Type",
    list: SensorTypee.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.Mouse ?? 0,
    })),
  };

  const markk = await prismadb.manufacturer.findMany({
    where: {
      Mouse: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          Mouse: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const manufacturer: Filter = {
    title: "Brand",
    list: markk.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.Mouse ?? 0,
    })),
  };

  return {
    title: "mouse",
    data: {
      manufacturer,
      SensorType,
    },
  };
};

export const MousepadFilters = async () => {
  const mousepadSizee = await prismadb.mousepadSize.findMany({
    where: {
      Mousepad: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          Mousepad: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const mousepadSize: Filter = {
    title: "Size",
    list: mousepadSizee.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.Mousepad ?? 0,
    })),
  };

  const mousepadModell = await prismadb.mousepadModel.findMany({
    where: {
      Mousepad: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          Mousepad: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const mousepadModel: Filter = {
    title: "Model",
    list: mousepadModell.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.Mousepad ?? 0,
    })),
  };

  const markk = await prismadb.manufacturer.findMany({
    where: {
      Mousepad: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          Mousepad: {
            where: {
              product: { some: {} },
            },
          },
        },
      },
    },
  });

  const manufacturer: Filter = {
    title: "Brand",
    list: markk.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.Mousepad ?? 0,
    })),
  };

  return {
    title: "mousepad",
    data: {
      manufacturer,
      mousepadModel,
      mousepadSize,
    },
  };
};

export const screensFilters = async () => {
  const markk = await prismadb.mark.findMany({
    where: {
      screens: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          screens: {
            where: {
              products: { some: {} },
            },
          },
        },
      },
    },
  });

  const mark: Filter = {
    title: "Brand",
    list: markk.map((manufacturer: any) => ({
      name: manufacturer.name,
      number: manufacturer._count?.screens ?? 0,
    })),
  };

  const poucee = await prismadb.pouce.findMany({
    where: {
      screens: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          screens: {
            where: {
              products: { some: {} },
            },
          },
        },
      },
    },
  });

  const pouce: Filter = {
    title: "Size",
    list: poucee.map((manufacturer: any) => ({
      name: manufacturer.name,
      number: manufacturer._count?.screens ?? 0,
    })),
  };

  const refreshRatee = await prismadb.refreshRate.findMany({
    where: {
      screens: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          screens: {
            where: {
              products: { some: {} },
            },
          },
        },
      },
    },
  });

  const refreshRate: Filter = {
    title: "Refresh Rate",
    list: refreshRatee.map((manufacturer: any) => ({
      name: manufacturer.name,
      number: manufacturer._count?.screens ?? 0,
    })),
  };

  const resolutionn = await prismadb.resolution.findMany({
    where: {
      screens: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          screens: {
            where: {
              products: { some: {} },
            },
          },
        },
      },
    },
  });

  const resolution: Filter = {
    title: "Resolution",
    list: resolutionn.map((manufacturer: any) => ({
      name: manufacturer.name,
      number: manufacturer._count?.screens ?? 0,
    })),
  };

  // ✅ NEW: screen “type” using Category names (no new DB schema)
  const screenCategories = await prismadb.category.findMany({
    where: {
      name: { in: ["Screen Gaming", "Screen Pro"] }, // adjust names if your categories differ
      products: {
        some: {
          screens: {
            some: {},
          },
        },
      },
    },
    include: {
      _count: {
        select: {
          products: {
            where: {
              screens: {
                some: {},
              },
            },
          },
        },
      },
    },
  });

  const screenType: Filter = {
    title: "Type",
    list: screenCategories.map((cat: any) => ({
      name: cat.name, // "Screen Gaming" / "Screen Pro"
      number: cat._count?.products ?? 0,
    })),
  };

  return {
    title: "screen",
    data: {
      mark,
      pouce,
      refreshRate,
      resolution,
      screenType, // 👈 appears as filter group “Type”
    },
  };
};


export const gpusFilters = async () => {
  const graphiccardNamee = await prismadb.graphiccardName.findMany({
    where: {
      motherboards: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          motherboards: {
            where: {
              products: { some: {} },
            },
          },
        },
      },
    },
  });

  const graphiccardName: Filter = {
    title: "Graphics Card",
    list: graphiccardNamee.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.motherboards ?? 0,
    })),
  };

  const gpuArchBrandd = await prismadb.gpuArchBrand.findMany({
    where: {
      motherboards: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          motherboards: {
            where: {
              products: { some: {} },
            },
          },
        },
      },
    },
  });

  const gpuArchBrand: Filter = {
    title: "Architecture Brand",
    list: gpuArchBrandd.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.motherboards ?? 0,
    })),
  };

  const gpuBrandd = await prismadb.gpuBrand.findMany({
    where: {
      motherboards: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: {
          motherboards: {
            where: {
              products: { some: {} },
            },
          },
        },
      },
    },
  });

  const gpuBrand: Filter = {
    title: "Brand",
    list: gpuBrandd.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.motherboards ?? 0,
    })),
  };

  return {
    title: "gpu",
    data: {
      gpuArchBrand,
      gpuBrand,
      graphiccardName,
    },
  };
};

export const coolingFilters = async () => {
  const coolingcPUSupportt = await prismadb.cPUSupport.findMany({
    where: {
      cooling: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { cooling: {} },
      },
    },
  });

  const coolingcPUSupport: Filter = {
    title: "Processor Support",
    list: coolingcPUSupportt.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.cooling ?? 0,
    })),
  };

  const fansNumberr = await prismadb.fansNumber.findMany({
    where: {
      cooling: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { cooling: {} },
      },
    },
  });

  const fansNumber: Filter = {
    title: "Pre-installed Fans Number",
    list: fansNumberr.map((manufacturer) => ({
      name: manufacturer.number.toString(),
      number: manufacturer._count?.cooling ?? 0,
    })),
  };

  const coolingTypee = await prismadb.coolingType.findMany({
    where: {
      cooling: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { cooling: {} },
      },
    },
  });

  const coolingType: Filter = {
    title: "Cooling Type",
    list: coolingTypee.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.cooling ?? 0,
    })),
  };

  const coolingMarkk = await prismadb.coolingMark.findMany({
    where: {
      cooling: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { cooling: {} },
      },
    },
  });

  const coolingMark: Filter = {
    title: "Brand",
    list: coolingMarkk.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.cooling ?? 0,
    })),
  };

  return {
    title: "cooling",
    data: {
      coolingMark,
      coolingType,
      coolingcPUSupport,
      fansNumber,
    },
  };
};

export const casesFilters = async () => {
  const pCcaseRGBTypee = await prismadb.pCcaseRGBType.findMany({
    where: {
      pccase: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { pccase: {} },
      },
    },
  });

  const pCcaseRGBType: Filter = {
    title: "RGB",
    list: pCcaseRGBTypee.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.pccase ?? 0,
    })),
  };

  const pCcaseNumberofFansPreinstalledd =
    await prismadb.pCcaseNumberofFansPreinstalled.findMany({
      where: {
        pccase: {
          some: {
            product: { some: {} },
          },
        },
      },
      include: {
        _count: {
          select: { pccase: {} },
        },
      },
    });

  const pCcaseNumberofFansPreinstalled: Filter = {
    title: "Pre-installed Fans Number",
    list: pCcaseNumberofFansPreinstalledd.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.pccase ?? 0,
    })),
  };

  const pCcaseCaseformatt = await prismadb.pCcaseCaseformat.findMany({
    where: {
      pccase: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { pccase: {} },
      },
    },
  });

  const pCcaseCaseformat: Filter = {
    title: "Case Format",
    list: pCcaseCaseformatt.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.pccase ?? 0,
    })),
  };

  const pCcaseBrandd = await prismadb.pCcaseBrand.findMany({
    where: {
      pccase: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { pccase: {} },
      },
    },
  });

  const pCcaseBrand: Filter = {
    title: "Brand",
    list: pCcaseBrandd.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.pccase ?? 0,
    })),
  };

  return {
    title: "case",
    data: {
      pCcaseBrand,
      pCcaseCaseformat,
      pCcaseNumberofFansPreinstalled,
      pCcaseRGBType,
    },
  };
};

export const powersuppliesFilters = async () => {
  const psCertificationn = await prismadb.psCertification.findMany({
    where: {
      powersupplies: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { powersupplies: {} },
      },
    },
  });

  const psCertification: Filter = {
    title: "80+ Certification",
    list: psCertificationn.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.powersupplies ?? 0,
    })),
  };

  const powersupplyMarquee = await prismadb.powersupplyMarque.findMany({
    where: {
      powersupplies: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { powersupplies: {} },
      },
    },
  });

  const powersupplyMarque: Filter = {
    title: "Brand",
    list: powersupplyMarquee.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.powersupplies ?? 0,
    })),
  };

  return {
    title: "power",
    data: {
      powersupplyMarque,
      psCertification,
    },
  };
};

export const storagesFilters = async () => {
  const harddiskTypee = await prismadb.harddiskType.findMany({
    where: {
      harddisk: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { harddisk: {} },
      },
    },
  });

  const harddiskType: Filter = {
    title: "Type",
    list: harddiskTypee.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.harddisk ?? 0,
    })),
  };

  const harddiskComputerinterfacee =
    await prismadb.harddiskComputerinterface.findMany({
      where: {
        harddisk: {
          some: {
            product: { some: {} },
          },
        },
      },
      include: {
        _count: {
          select: { harddisk: {} },
        },
      },
    });

  const harddiskComputerinterface: Filter = {
    title: "Interface",
    list: harddiskComputerinterfacee.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.harddisk ?? 0,
    })),
  };

  const harddiskCapacityy = await prismadb.harddiskCapacity.findMany({
    where: {
      harddisk: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { harddisk: {} },
      },
    },
  });

  const harddiskCapacity: Filter = {
    title: "Capacity",
    list: harddiskCapacityy.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.harddisk ?? 0,
    })),
  };

  const harddiskBrandd = await prismadb.harddiskBrand.findMany({
    where: {
      harddisk: {
        some: {
          product: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { harddisk: {} },
      },
    },
  });

  const harddiskBrand: Filter = {
    title: "Brand",
    list: harddiskBrandd.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.harddisk ?? 0,
    })),
  };

  return {
    title: "hardDisk",
    data: {
      harddiskBrand,
      harddiskCapacity,
      harddiskComputerinterface,
      harddiskType,
    },
  };
};

/**
 * CPU FILTERS — fixed titles & cleaned list:
 * - cPUSupport  -> "Processeur support"  (socket: AM4, AM5, LGA1700, …)
 * - processorModel -> "Marque processeur" (AMD, Intel, …) — SAME KEY so backend keeps working
 */
export const cpusFilters = async () => {
  const cPUSupportRaw = await prismadb.cPUSupport.findMany({
    where: { processor: { some: { products: { some: {} } } } },
    include: { _count: { select: { processor: {} } } },
  });

  const cPUSupport: Filter = {
    title: "Processor Support",
    list: cPUSupportRaw
      .map((row) => ({
        name: (row.name ?? "").toString().trim(),
        number: row._count?.processor ?? 0,
      }))
      .filter((x) => x.name.length > 0)
      .sort((a, b) =>
        a.name.localeCompare(b.name, "fr", { numeric: true, sensitivity: "base" })
      ),
  };

  const processorModelRaw = await prismadb.processorModel.findMany({
    where: { processor: { some: { products: { some: {} } } } },
    include: { _count: { select: { processor: {} } } },
  });

  const processorModel: Filter = {
    title: "Processor Brand",
    list: processorModelRaw
      .map((row) => ({
        name: (row.name ?? "").toString().trim(), // AMD, Intel, etc.
        number: row._count?.processor ?? 0,
      }))
      .filter((x) => x.name.length > 0)
      .sort((a, b) =>
        a.name.localeCompare(b.name, "fr", { numeric: true, sensitivity: "base" })
      ),
  };

  return {
    title: "cpu",
    data: {
      cPUSupport,
      processorModel, // <— DO NOT comment these out
    },
  };
};


export const memoriesFilters = async () => {
  const memoryFrequencyy = await prismadb.memoryFrequency.findMany({
    where: {
      memoryboards: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { memoryboards: {} },
      },
    },
  });

  const memoryFrequency: Filter = {
    title: "Frequency",
    list: memoryFrequencyy.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.memoryboards ?? 0,
    })),
  };

  const memoryMarquee = await prismadb.memoryMarque.findMany({
    where: {
      memoryboards: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { memoryboards: {} },
      },
    },
  });

  const memoryMarque: Filter = {
    title: "Brand",
    list: memoryMarquee.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.memoryboards ?? 0,
    })),
  };

  const memoryNumberr = await prismadb.memoryNumber.findMany({
    where: {
      memoryboards: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { memoryboards: {} },
      },
    },
  });

  const memoryNumber: Filter = {
    title: "Capacity",
    list: memoryNumberr.map((manufacturer) => ({
      name: manufacturer.number.toString() + " Gb",
      number: manufacturer._count?.memoryboards ?? 0,
    })),
  };

  const memoryTypee = await prismadb.memoryType.findMany({
    where: {
      memoryboards: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { memoryboards: {} },
      },
    },
  });

  const memoryType: Filter = {
    title: "Type",
    list: memoryTypee.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.memoryboards ?? 0,
    })),
  };

  return {
    title: "memory",
    data: {
      memoryFrequency,
      memoryMarque,
      memoryNumber,
      memoryType,
    },
  };
};

export const motherboardFilters = async () => {
  const motherboardmanufacturerr = await prismadb.manufacturer.findMany({
    where: {
      motherboards: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { motherboards: {} },
      },
    },
  });

  const motherboardmanufacturer: Filter = {
    title: "Brand",
    list: motherboardmanufacturerr.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.motherboards ?? 0,
    })),
  };

  const motherboardramslotss = await prismadb.ramSlots.findMany({
    where: {
      motherboards: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { motherboards: {} },
      },
    },
  });

  const motherboardramslots: Filter = {
    title: "RAM Slots Number",
    list: motherboardramslotss.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.motherboards ?? 0,
    })),
  };

  const motherboardchipsett = await prismadb.motherboardChipset.findMany({
    where: {
      motherboards: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { motherboards: {} },
      },
    },
  });

  const motherboardchipset: Filter = {
    title: "Motherboard Chipset",
    list: motherboardchipsett.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.motherboards ?? 0,
    })),
  };

  const motherboardcpusupportt = await prismadb.cPUSupport.findMany({
    where: {
      motherboards: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { motherboards: {} },
      },
    },
  });

  const motherboardcpusupport: Filter = {
    title: "Processor Support",
    list: motherboardcpusupportt.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.motherboards ?? 0,
    })),
  };

  const motherboardformatt = await prismadb.motherboardFormat.findMany({
    where: {
      motherboards: {
        some: {
          products: { some: {} },
        },
      },
    },
    include: {
      _count: {
        select: { motherboards: {} },
      },
    },
  });

  const motherboardformat: Filter = {
    title: "Motherboard Format",
    list: motherboardformatt.map((manufacturer) => ({
      name: manufacturer.name,
      number: manufacturer._count?.motherboards ?? 0,
    })),
  };

  return {
    title: "motherboard",
    data: {
      motherboardchipset,
      motherboardcpusupport,
      motherboardformat,
      motherboardramslots,
      motherboardmanufacturer,
    },
  };
};
