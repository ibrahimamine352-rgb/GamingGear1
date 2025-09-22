import prismadb from "@/lib/prismadb";
import { Filter } from "../../build-pc/page";


export const PreBuiltPcmodelFilters = async () => {

    return {}
}

export const LaptopFilters = async () => {

    const LapSystemm = await prismadb.lapSystem.findMany({
        where: {
            laptops: {
                some: {
                    product: { some: {} }
                }
            }
        } 
        , include: {
            _count: {

                select: {
                    laptops: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const LapSystem: Filter = {
        title: "Mark",
        list: LapSystemm.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.laptops ?? 0,

            }

        }),
    };
    const LapProcesseurr = await prismadb.lapProcesseur.findMany({
        where: {
            laptops: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    laptops: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const LapProcesseur: Filter = {
        title: "Mark",
        list: LapProcesseurr.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.laptops ?? 0,

            }

        }),
    };
    const LapGraphiccardd = await prismadb.lapGraphiccard.findMany({
        where: {
            laptops: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    laptops: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const LapGraphiccard: Filter = {
        title: "Graphique card",
        list: LapGraphiccardd.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.laptops ?? 0,

            }

        }),
    };
    const LapGraphiccardReff = await prismadb.lapGraphiccardRef.findMany({
        where: {
            laptops: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    laptops: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const LapGraphiccardRef: Filter = {
        title: "Mark",
        list: LapGraphiccardReff.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.laptops ?? 0,

            }

        }),
    };
    const LapScreenSizee = await prismadb.lapScreenSize.findMany({
        where: {
            laptops: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    laptops: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const LapScreenSize: Filter = {
        title: "Taille d'écran",
        list: LapScreenSizee.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.laptops ?? 0,

            }

        }),
    };
    const LapScreenTypee = await prismadb.lapScreenType.findMany({
        where: {
            laptops: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    laptops: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

 
    const LapHardiskk = await prismadb.lapHardisk.findMany({
        where: {
            laptops: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    laptops: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const LapHardisk: Filter = {
        title: "Mark",
        list: LapHardiskk.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.laptops ?? 0,

            }

        }),
    };
    const Lapmemoryy = await prismadb.lapmemory.findMany({
        where: {
            laptops: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    laptops: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const Lapmemory: Filter = {
        title: "Mark",
        list: Lapmemoryy.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.laptops ?? 0,

            }

        }),
    };
    const Lapnetworkk = await prismadb.lapnetwork.findMany({
        where: {
            laptops: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    laptops: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const Lapnetwork: Filter = {
        title: "Mark",
        list: Lapnetworkk.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.laptops ?? 0,

            }

        }),
    };
    const LapSoundd = await prismadb.lapSound.findMany({
        where: {
            laptops: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    laptops: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const LapSound: Filter = {
        title: "Mark",
        list: LapSoundd.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.laptops ?? 0,

            }

        }),
    };
    const LapCameraa = await prismadb.lapCamera.findMany({
        where: {
            laptops: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    laptops: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const LapCamera: Filter = {
        title: "Mark",
        list: LapCameraa.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.laptops ?? 0,

            }

        }),
    };
    const LapRefreshRatee = await prismadb.lapRefreshRate.findMany({
        where: {
            laptops: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    laptops: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const LapRefreshRate: Filter = {
        title: "Mark",
        list: LapRefreshRatee.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.laptops ?? 0,

            }

        }),
    };

    const markk = await prismadb.manufacturer.findMany({
        where: {
            Laptops: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    Laptops: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const manufacturer: Filter = {
        title: "Mark",
        list: markk.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.Laptops ?? 0,

            }

        }),
    };

    return {
        title: "laptop",
        data: {
            manufacturer, LapSystem, LapProcesseur, LapGraphiccard, LapScreenSize, LapHardisk, Lapmemory,
            Lapnetwork, LapSound, LapCamera, LapRefreshRate

        }
    }
}
export const HeadsetFilters = async () => {
    const headsetModell = await prismadb.headsetModel.findMany({
        where: {
            Headset: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    Headset: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const headsetModel: Filter = {
        title: "Model",
        list: headsetModell.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.Headset ?? 0,

            }

        }),
    };
    const headsetSonSurroundd = await prismadb.headsetSonSurround.findMany({
        where: {
            Headset: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    Headset: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const headsetSonSurround: Filter = {
        title: "Casque Son Surround",
        list: headsetSonSurroundd.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.Headset ?? 0,

            }

        }),
    };
    const headsetInterfaceAvecOrdinateurr = await prismadb.headsetInterfaceAvecOrdinateur.findMany({
        where: {
            Headset: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    Headset: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const headsetInterfaceAvecOrdinateur: Filter = {
        title: "Interface Avec Ordinateur",
        list: headsetInterfaceAvecOrdinateurr.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.Headset ?? 0,

            }

        }),
    };
    const markk = await prismadb.manufacturer.findMany({
        where: {
            Headset: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    Headset: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const manufacturer: Filter = {
        title: "Mark",
        list: markk.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.Headset ?? 0,

            }

        }),
    };

    return {
        title: "casque",
        data: {
            manufacturer, headsetSonSurround, headsetInterfaceAvecOrdinateur

        }
    }
}
export const keyboardFilters = async () => {
   
    const keyboarFormatt = await prismadb.keyboarFormat.findMany({
        where: {
            keyboards: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    keyboards: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const keyboarFormat: Filter = {
        title: "Format de clavier",
        list: keyboarFormatt.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.keyboards ?? 0,

            }

        }),
    };
    const keyboarButtonsNumberr = await prismadb.keyboarButtonsNumber.findMany({
        where: {
            keyboards: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    keyboards: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const keyboarButtonsNumber: Filter = {
        title: "Numéro de boutons du clavier",
        list: keyboarButtonsNumberr.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.keyboards ?? 0,

            }

        }),
    };
    const keyboarTouchTypee = await prismadb.keyboarTouchType.findMany({
        where: {
            keyboards: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    keyboards: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const keyboarTouchType: Filter = {
        title: "Type tactile du clavier",
        list: keyboarTouchTypee.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.keyboards ?? 0,

            }

        }),
    };


    const markk = await prismadb.manufacturer.findMany({
        where: {
            keyboard: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    keyboard: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const manufacturer: Filter = {
        title: "Mark",
        list: markk.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.keyboard ?? 0,

            }

        }),
    };

    return {

        title: "keyboard",
        data: {
            manufacturer, keyboarFormat, keyboarTouchType

        }
    }
}
export const MicFilters = async () => {
    const micInterfaceAvecOrdinateurr = await prismadb.micInterfaceAvecOrdinateur.findMany({
        where: {
            Mic: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    Mic: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const micInterfaceAvecOrdinateur: Filter = {
        title: "Modél",
        list: micInterfaceAvecOrdinateurr.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.Mic ?? 0,

            }

        }),
    };
    const micSonSurroundd = await prismadb.micSonSurround.findMany({
        where: {
            Mic: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    Mic: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const micSonSurround: Filter = {
        title: "Son Surround",
        list: micSonSurroundd.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.Mic ?? 0,

            }

        }),
    };
    const MicModel = await prismadb.micModel.findMany({
        where: {
            Mic: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    Mic: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const micModel: Filter = {
        title: "Modél",
        list: MicModel.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.Mic ?? 0,

            }

        }),
    };
    const markk = await prismadb.manufacturer.findMany({
        where: {
            Mic: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    Mic: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const manufacturer: Filter = {
        title: "Mark",
        list: markk.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.Mic ?? 0,

            }

        }),
    };

    return {

        title: "mic",
        data: {
            manufacturer, micModel, micInterfaceAvecOrdinateur

        }
    }
}
export const MouseFilters = async () => {

    const SensorTypee = await prismadb.sensorType.findMany({
        where: {
            Mouse: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    Mouse: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const SensorType: Filter = {
        title: "Type de capteur",
        list: SensorTypee.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.Mouse ?? 0,

            }

        }),
    };

    const markk = await prismadb.manufacturer.findMany({
        where: {
            Mouse: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    Mouse: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const manufacturer: Filter = {
        title: "Mark",
        list: markk.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.Mouse ?? 0,

            }

        }),
    };

    return {


        title: "mouse",
        data: {
            manufacturer,
            SensorType
        }
    }
}
export const MousepadFilters = async () => {
    const mousepadSizee = await prismadb.mousepadSize.findMany({
        where: {
            Mousepad: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    Mousepad: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const mousepadSize: Filter = {
        title: "Taille",
        list: mousepadSizee.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.Mousepad ?? 0,

            }

        }),
    };
    const mousepadModell = await prismadb.mousepadModel.findMany({
        where: {
            Mousepad: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    Mousepad: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const mousepadModel: Filter = {
        title: "model",
        list: mousepadModell.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.Mousepad ?? 0,

            }

        }),
    };
    const markk = await prismadb.manufacturer.findMany({
        where: {
            Mousepad: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    Mousepad: {
                        where: {
                            product: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const manufacturer: Filter = {
        title: "Mark",
        list: markk.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.Mousepad ?? 0,

            }

        }),
    };


    return {


        title: "mousePad",
        data: {
            manufacturer,
            mousepadModel,
            mousepadSize
        }
    }
}
export const screensFilters = async () => {
    const markk = await prismadb.mark.findMany({
        where: {
            screens: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {

                select: {
                    screens: {
                        where: {
                            products: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const mark: Filter = {
        title: "Mark",
        list: markk.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.screens ?? 0,

            }

        }),
    };
    const poucee = await prismadb.pouce.findMany({
        where: {
            screens: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: {
                    screens: {
                        where: {
                            products: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const pouce: Filter = {
        title: "Pouce",
        list: poucee.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.screens ?? 0,

            }

        }),
    };
    const refreshRatee = await prismadb.refreshRate.findMany({
        where: {
            screens: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: {
                    screens: {
                        where: {
                            products: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const refreshRate: Filter = {
        title: "Refresh Rate",
        list: refreshRatee.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.screens ?? 0,

            }

        }),
    };
    const resolutionn = await prismadb.resolution.findMany({
        where: {
            screens: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: {
                    screens: {
                        where: {
                            products: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const resolution: Filter = {
        title: "Resolution",
        list: resolutionn.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.screens ?? 0,

            }

        }),
    };
    return {

        title: "screen",
        data: {
            mark,
            pouce,
            refreshRate,
            resolution,
        }
    }
}
export const gpusFilters = async () => {
    const graphiccardNamee = await prismadb.graphiccardName.findMany({
        where: {
            motherboards: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: {
                    motherboards: {
                        where: {
                            products: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const graphiccardName: Filter = {
        title: "Carte graphique",
        list: graphiccardNamee.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.motherboards ?? 0,

            }

        }),
    };
    const gpuArchBrandd = await prismadb.gpuArchBrand.findMany({
        where: {
            motherboards: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: {
                    motherboards: {
                        where: {
                            products: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const gpuArchBrand: Filter = {
        title: "Marque d'achitecture",
        list: gpuArchBrandd.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.motherboards ?? 0,

            }

        }),
    };
    const gpuBrandd = await prismadb.gpuBrand.findMany({
        where: {
            motherboards: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: {
                    motherboards: {
                        where: {
                            products: { some: {} }
                        }
                    }
                }
            }
        }
    })

    const gpuBrand: Filter = {
        title: "Marque",
        list: gpuBrandd.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.motherboards ?? 0,

            }

        }),
    };
    return {

        title: "gpu",
        data: {
            gpuArchBrand,
            gpuBrand,
            graphiccardName,
        }
    }
}
export const coolingFilters = async () => {
    const coolingcPUSupportt = await prismadb.cPUSupport.findMany({
        where: {
            cooling: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { cooling: {} }
            }
        }
    })

    const coolingcPUSupport: Filter = {
        title: "Support du processeur",
        list: coolingcPUSupportt.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.cooling ?? 0,

            }

        }),
    };
    const fansNumberr = await prismadb.fansNumber.findMany({
        where: {
            cooling: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { cooling: {} }
            }
        }
    })

    const fansNumber: Filter = {
        title: "Nombre de Ventilateurs Pré-installés",
        list: fansNumberr.map((manufacturer) => {
            return {
                name: manufacturer.number.toString(),
                number: manufacturer._count?.cooling ?? 0,

            }

        }),
    };
    const coolingTypee = await prismadb.coolingType.findMany({
        where: {
            cooling: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { cooling: {} }
            }
        }
    })

    const coolingType: Filter = {
        title: "Type",
        list: coolingTypee.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.cooling ?? 0,

            }

        }),
    };
    const coolingMarkk = await prismadb.coolingMark.findMany({
        where: {
            cooling: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { cooling: {} }
            }
        }
    })

    const coolingMark: Filter = {
        title: "Marque",
        list: coolingMarkk.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.cooling ?? 0,

            }

        }),
    };
    return {

        title: "cooling",
        data: {
            coolingMark,
            coolingType,
            coolingcPUSupport,
            fansNumber,
        }
    }
}
export const casesFilters = async () => {
    const pCcaseRGBTypee = await prismadb.pCcaseRGBType.findMany({
        where: {
            pccase: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { pccase: {} }
            }
        }
    })

    const pCcaseRGBType: Filter = {
        title: "RGB",
        list: pCcaseRGBTypee.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.pccase ?? 0,

            }

        }),
    };
    const pCcaseNumberofFansPreinstalledd = await prismadb.pCcaseNumberofFansPreinstalled.findMany({
        where: {
            pccase: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { pccase: {} }
            }
        }
    })

    const pCcaseNumberofFansPreinstalled: Filter = {
        title: "Nombre de Ventilateurs Pré-installés",
        list: pCcaseNumberofFansPreinstalledd.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.pccase ?? 0,

            }

        }),
    };
    const pCcaseCaseformatt = await prismadb.pCcaseCaseformat.findMany({
        where: {
            pccase: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { pccase: {} }
            }
        }
    })

    const pCcaseCaseformat: Filter = {
        title: "Format du boitier",
        list: pCcaseCaseformatt.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.pccase ?? 0,

            }

        }),
    };
    const pCcaseBrandd = await prismadb.pCcaseBrand.findMany({
        where: {
            pccase: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { pccase: {} }
            }
        }
    })

    const pCcaseBrand: Filter = {
        title: "Marque",
        list: pCcaseBrandd.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.pccase ?? 0,

            }

        }),
    };
    return {
        title: "case",
        data: {
            pCcaseBrand,
            pCcaseCaseformat,
            pCcaseNumberofFansPreinstalled,
            pCcaseRGBType,
        }

    }
}
export const powersuppliesFilters = async () => {
    const psCertificationn = await prismadb.psCertification.findMany({
        where: {
            powersupplies: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { powersupplies: {} }
            }
        }
    })

    const psCertification: Filter = {
        title: "Certification",
        list: psCertificationn.map((manufacturer) => {
            return {

                name: manufacturer.name,
                number: manufacturer._count?.powersupplies ?? 0,

            }

        }),
    };
    const powersupplyMarquee = await prismadb.powersupplyMarque.findMany({
        where: {
            powersupplies: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { powersupplies: {} }
            }
        }
    })

    const powersupplyMarque: Filter = {
        title: "Certification 80+",
        list: powersupplyMarquee.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.powersupplies ?? 0,

            }

        }),
    };
    return {

        title: "power",
        data: {
            powersupplyMarque,
            psCertification
        }
    }

}
export const storagesFilters = async () => {

    const harddiskTypee = await prismadb.harddiskType.findMany({
        where: {
            harddisk: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { harddisk: {} }
            }
        }
    })

    const harddiskType: Filter = {
        title: "Type",
        list: harddiskTypee.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.harddisk ?? 0,

            }

        }),
    };
    const harddiskComputerinterfacee = await prismadb.harddiskComputerinterface.findMany({
        where: {
            harddisk: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { harddisk: {} }
            }
        }
    })

    const harddiskComputerinterface: Filter = {
        title: "Interface",
        list: harddiskComputerinterfacee.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.harddisk ?? 0,

            }

        }),
    };

    const harddiskCapacityy = await prismadb.harddiskCapacity.findMany({
        where: {
            harddisk: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { harddisk: {} }
            }
        }
    })

    const harddiskCapacity: Filter = {
        title: "Capacité",
        list: harddiskCapacityy.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.harddisk ?? 0,

            }

        }),
    };

    const harddiskBrandd = await prismadb.harddiskBrand.findMany({
        where: {
            harddisk: {
                some: {
                    product: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { harddisk: {} }
            }
        }
    })

    const harddiskBrand: Filter = {
        title: "Marque",
        list: harddiskBrandd.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.harddisk ?? 0,

            }

        }),
    };
    return {
        title: "hardDisk",
        data: {
            harddiskBrand,
            harddiskCapacity,
            harddiskComputerinterface,
            harddiskType,
        }


    }
}
export const cpusFilters = async () => {

    const processorModell = await prismadb.processorModel.findMany({
        where: {
            processor: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { processor: {} }
            }
        }
    })

    const processorModel: Filter = {
        title: "Processeur support",
        list: processorModell.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.processor ?? 0,

            }

        }),
    };
    const cPUSupportt = await prismadb.cPUSupport.findMany({
        where: {
            processor: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { processor: {} }
            }
        }
    })

    const cPUSupport: Filter = {
        title: "Processeur support",
        list: cPUSupportt.map((manufacturer) => {
            return {

                name: manufacturer.name,
                number: manufacturer._count?.processor ?? 0,

            }

        }),
    };
    return {

        title: "cpu",
        data: {
            cPUSupport,
            processorModel
        }
    }
}
export const memoriesFilters = async () => {
    const memoryFrequencyy = await prismadb.memoryFrequency.findMany({
        where: {
            memoryboards: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { memoryboards: {} }
            }
        }
    })

    const memoryFrequency: Filter = {
        title: "Frequence",
        list: memoryFrequencyy.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.memoryboards ?? 0,

            }

        }),
    };
    const memoryMarquee = await prismadb.memoryMarque.findMany({
        where: {
            memoryboards: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { memoryboards: {} }
            }
        }
    })
    const memoryMarque: Filter = {
        title: "Marque",
        list: memoryMarquee.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.memoryboards ?? 0,

            }

        }),
    };
    const memoryNumberr = await prismadb.memoryNumber.findMany({
        where: {
            memoryboards: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { memoryboards: {} }
            }
        }
    })
    const memoryNumber: Filter = {
        title: "Capacity",
        list: memoryNumberr.map((manufacturer) => {
            return {
                name: manufacturer.number.toString() + " Gb",
                number: manufacturer._count?.memoryboards ?? 0,

            }

        }),
    };
    const memoryTypee = await prismadb.memoryType.findMany({
        where: {
            memoryboards: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { memoryboards: {} }
            }
        }
    })
    const memoryType: Filter = {
        title: "Type",
        list: memoryTypee.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.memoryboards ?? 0,

            }

        }),
    };

    return {

        title: "ram",
        data: {
            memoryFrequency,
            memoryMarque,
            memoryNumber,
            memoryType,
        }
    }

}
export const motherboardFilters = async () => {

    const motherboardmanufacturerr = await prismadb.manufacturer.findMany({
        where: {
            motherboards: {
                some: {
                    products: { some: {} }
                }
            }
        }
        , include: {
            _count: {
                select: { motherboards: {} }
            }
        }
    })
    const motherboardmanufacturer: Filter = {
        title: "Marque",
        list: motherboardmanufacturerr.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.motherboards ?? 0,

            }

        }),
    };
    const motherboardramslotss = await prismadb.ramSlots.findMany({
        where: {
            motherboards: {
                some: {
                    products: { some: {} }
                }

            }
        }, include: {
            _count: {
                select: { motherboards: {} }
            }
        }
    })
    const motherboardramslots: Filter = {
        title: "Nombre de barrettes RAM",
        list: motherboardramslotss.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.motherboards ?? 0,

            }

        }),
    };
    const motherboardchipsett = await prismadb.motherboardChipset.findMany({
        where: {
            motherboards: {
                some: {
                    products: { some: {} }
                }
            }
        }, include: {
            _count: {
                select: { motherboards: {} }
            }
        }
    })
    const motherboardchipset: Filter = {
        title: "Chipset de la carte mère",
        list: motherboardchipsett.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.motherboards ?? 0,

            }

        }),
    };
    const motherboardcpusupportt = await prismadb.cPUSupport.findMany({
        where: {
            motherboards: {
                some: {
                    products: { some: {} }
                }
            }
        }, include: {
            _count: {
                select: { motherboards: {} }
            }
        }
    })
    const motherboardcpusupport: Filter = {
        title: "Support du processeur",
        list: motherboardcpusupportt.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.motherboards ?? 0,

            }

        }),
    };
    const motherboardformatt = await prismadb.motherboardFormat.findMany({
        where: {
            motherboards: {
                some: {
                    products: { some: {} }
                }
            }
        }, include: {
            _count: {
                select: { motherboards: {} }
            }
        }
    })
    const motherboardformat: Filter = {
        title: "Format de carte mère",
        list: motherboardformatt.map((manufacturer) => {
            return {
                name: manufacturer.name,
                number: manufacturer._count?.motherboards ?? 0,

            }

        }),
    };

    return {

        title: "Carte Mére",
        data: {
            motherboardchipset,
            motherboardcpusupport,
            motherboardformat,
            motherboardramslots,
            motherboardmanufacturer,
        }

    }

} 
