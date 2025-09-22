"use client"
import { CompatibiltyProfile, RamSlots } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { Filter, ProfileType } from '../page'
import { Motherboard } from './Motherboard'
import { Processor } from './Processor'
import { Product } from '@/types'
import { AllProductsCompatibility, defaultAllProductsCompatibility } from './comps'
import { Memory, Ram } from './Ram'
import { HardDisk } from './HardDisk'
import { Power } from './Power'
import { Case } from './Case'
import { Cooling } from './Cooling'
import Details from './details'
import { GraphicCard } from './GraphicCard'
import { Screen } from './Screen'
import axios from 'axios'
export interface SelectedFeatures {
  [key: string]: number | undefined; // Allow string indexing with number or undefined values
}

const EXPIRATION_TIME = 12 * 60 * 60 * 1000; // 5 minutes in milliseconds

const saveToLocalStorage = (key: string, value: any) => {


    if (value != retrieveFromLocalStorage(key)) {
        const data = {
            value,
            timestamp: new Date().getTime(),
        };

        localStorage.setItem(key, JSON.stringify(data));
    }

};
const retrieveFromLocalStorage = (key: string) => {
    // Check if localStorage is available (for example, in a browser environment)
    if (typeof localStorage !== 'undefined' && localStorage.getItem(key)) {
        const data = localStorage.getItem(key);
        if (data) {
            const parsedData = JSON.parse(data);
            const { value, timestamp } = parsedData;
            const currentTime = new Date().getTime();

            // Check if the data is still within the expiration time
            if (currentTime - timestamp < EXPIRATION_TIME) {
                if (key == "ramId" && (value.length == 1 || value.length == 3)) {

                    return [...value, null]

                }
                return value;
            } else {
                // Data has expired, remove it
                localStorage.removeItem(key);
            }
        } else if (key === "ramId") {
            return [null, null, null, null];
        }
    } if (key == "ramId") {
        return [null, null, null, null];
    }

    return null;
};

export const BuildForm = (props: {
    profiles: ProfileType[],
    mark: Filter
    pouce: Filter
    refreshRate: Filter
    resolution: Filter

    gpuBrand: Filter
    gpuArchBrand: Filter
    graphiccardName: Filter

    coolingcPUSupport: Filter
    fansNumber: Filter
    coolingType: Filter
    coolingMark: Filter


    psCertification: Filter
    powersupplyMarque: Filter

    pCcaseRGBType: Filter
    pCcaseNumberofFansPreinstalled: Filter
    pCcaseCaseformat: Filter
    pCcaseBrand: Filter

    harddiskType: Filter
    harddiskComputerinterface: Filter
    harddiskCapacity: Filter
    harddiskBrand: Filter
    processorModel: Filter
    cPUSupport: Filter
    motherboardchipset: Filter
    motherboardcpusupport: Filter
    motherboardformat: Filter
    motherboardramslots: Filter
    motherboardmanufacturer: Filter
    memoryFrequency: Filter
    memoryMarque: Filter
    memoryNumber: Filter
    memoryType: Filter
}) => {
    const [motherboardId, setMotherboardId] = useState<Product | undefined>(retrieveFromLocalStorage('motherboardId'))
    const [allProductCompatibility, setAllProductCompatibility] = useState<AllProductsCompatibility>(defaultAllProductsCompatibility)
    const [processorId, setProcessorId] = useState<Product | undefined>(retrieveFromLocalStorage('processorId'))
    const [gpuId, setGpuId] = useState<Product | undefined>(retrieveFromLocalStorage('gpuId'))
    const [ramId, setRamId] = useState<(Memory | null)[]>(retrieveFromLocalStorage('ramId') || [null, null])
    const [hardDiskSecondaire, setHardDiskSecondaire
    ] = useState<Product | undefined>(retrieveFromLocalStorage('hardDiskSecondaire'))
    const [hardDiskPrimaireId, sethardDiskPrimaireId] = useState<Product | undefined>(retrieveFromLocalStorage('hardDiskPrimaireId'))
    const [caseId, setCase] = useState<Product | undefined>(retrieveFromLocalStorage('caseId'))
    const [powerId, setPowerId] = useState<Product | undefined>(retrieveFromLocalStorage('powerId'))
    const [cooling, setcooling] = useState<Product | undefined>(retrieveFromLocalStorage('cooling'))
    const [screen, setscreen] = useState<Product | undefined>(retrieveFromLocalStorage('screen'))
    const [prix, setPrix] = useState<number>(0)
    console.log(props.profiles)
    const [ramSlotNumber, setRamSlotNumber] = useState(2)
    const [ramSlotType, setRamSlotType] = useState("")
    const [selectedFeatures, setSelectedFeatures] = useState<SelectedFeatures>({});
    // Function to add or update a feature
    const addFeature = (featureName:string, value:any) => {
        setSelectedFeatures(prev => ({
            ...prev,
            [featureName]: value
        }));
    };

    // Function to remove a feature
    const removeFeature = (featureName:string) => {
        setSelectedFeatures(prev => {
            const newFeatures = { ...prev };
            delete newFeatures[featureName];
            return newFeatures;
        });
    };

    const Number = async () => {
        try {
            const response = await axios.get(`/api/motherboard/RamSlots?id=${motherboardId?.id}`);
            const dataa: RamSlots = response.data;
            setRamSlotNumber(dataa.number);
            setRamSlotType(dataa.type);


        } catch (error) {

            console.error('Error fetching data:', error);
        }
    };
    function haveCommonElement<T>(set1: T[], array2: T[]): boolean {
        const array1 = Array.from(set1);

        for (const item of array1) {
            if (array2.includes(item)) {
                return true;
            }
        }

        return false;
    }
    const setCompatibility = (updates: Record<string, { message: string; error: boolean }>) => {
        const newCompatibility = {
            ...allProductCompatibility.Compatibility,
            ...updates,
        };
        setAllProductCompatibility({ Compatibility: newCompatibility });
    };

    useEffect(() => {
        const updates: Record<string, { message: string; error: boolean }> = {};

        if (motherboardId) {
            Number()
            const MProfiles = props.profiles.filter((e) => e.motherboards.find((ee) => ee.productId == motherboardId.id));
            if (processorId) {
                const PProfiles = props.profiles.filter((e) => e.CPUs.find((ee) => ee.productId == processorId.id));

                if (haveCommonElement(MProfiles, PProfiles)) {
                    if (cooling) {
                        const CProfiles = props.profiles.filter((e) => e.coolings.find((ee) => ee.productId == cooling.id));
                        if (haveCommonElement(CProfiles, PProfiles)) {
                            updates['processorCompatibility'] = { message: 'Compatible', error: false };
                        } else {
                            updates['processorCompatibility'] = { message: 'Refroidisseur CPU Non Compatible', error: true };
                        }
                    } else {
                        updates['processorCompatibility'] = { message: 'Compatible', error: false };
                    }

                    updates['motherboardCompatibility'] = { message: 'Compatible', error: false };
                } else {
                    updates['motherboardCompatibility'] = { message: 'Non Compatible', error: true };
                    updates['processorCompatibility'] = { message: 'Non Compatible', error: true };
                }
            }
        } else {
            setRamSlotType("")
            updates['motherboardCompatibility'] = { message: 'Veuillez sélectionner une carte mére', error: true };
            if (processorId) {
                updates['processorCompatibility'] = { message: 'Veuillez sélectionner une carte mére', error: true };
            }
        }

        if (processorId) {
            const PProfiles = props.profiles.filter((e) => e.CPUs.find((ee) => ee.productId == processorId.id));
            if (motherboardId) {
                const MProfiles = props.profiles.filter((e) => e.motherboards.find((ee) => ee.productId == motherboardId.id));

                if (haveCommonElement(MProfiles, PProfiles)) {
                    if (cooling) {
                        const CProfiles = props.profiles.filter((e) => e.coolings.find((ee) => ee.productId == cooling.id));
                        if (haveCommonElement(CProfiles, PProfiles)) {
                            updates['processorCompatibility'] = { message: 'Compatible', error: false };
                        } else {
                            updates['processorCompatibility'] = { message: 'Refroidisseur CPU Non Compatible', error: true };
                        }
                    } else {
                        updates['processorCompatibility'] = { message: 'Compatible', error: false };
                    }

                    updates['motherboardCompatibility'] = { message: 'Compatible', error: false };

                } else {
                    updates['motherboardCompatibility'] = { message: 'Non Compatible', error: true };
                    updates['processorCompatibility'] = { message: 'Non Compatible', error: true };
                }
            }
        } else {
            if (motherboardId) {
                updates['motherboardCompatibility'] = { message: 'Veuillez sélectionner un processeur', error: true };
            }
            updates['processorCompatibility'] = { message: 'Veuillez sélectionner un processeur', error: true };
        }
        if (processorId) {
            const PProfiles = props.profiles.filter((e) => e.CPUs.find((ee) => ee.productId == processorId.id));
            if (motherboardId) {
                const MProfiles = props.profiles.filter((e) => e.motherboards.find((ee) => ee.productId == motherboardId.id));

                if (haveCommonElement(MProfiles, PProfiles)) {
                    if (cooling) {
                        const CProfiles = props.profiles.filter((e) => e.coolings.find((ee) => ee.productId == cooling.id));
                        if (haveCommonElement(CProfiles, PProfiles)) {
                            updates['processorCompatibility'] = { message: 'Compatible', error: false };
                        } else {
                            updates['processorCompatibility'] = { message: 'Refroidisseur CPU Non Compatible', error: true };
                        }
                    } else {
                        updates['processorCompatibility'] = { message: 'Compatible', error: false };
                    }
                } else {
                    updates['motherboardCompatibility'] = { message: 'Non Compatible', error: true };
                    updates['processorCompatibility'] = { message: 'Non Compatible', error: true };
                }
            }
        }
        if (gpuId) {
            if (motherboardId) {
                updates['gpuCompatibility'] = { message: 'Compatible', error: false };
            } else {
                updates['gpuCompatibility'] = { message: 'Veuillez sélectionner une carte mére', error: true };
            }

        } else {
            updates['gpuCompatibility'] = { message: 'Veuillez vérifier si une carte graphique est déjà intégrée.', error: false };

        }
        const data: string[] = []
        if (motherboardId) {
            ramId.map((e, k) => {
                if (e != null) {
                    let comp = false
                    let message = "Veuillez sélectionner au moins une barrette RAM"
                    const MProfiles = props.profiles.filter((e) => e.motherboards.find((ee) => ee.productId == motherboardId.id));
                    if (e.memories[0].type.name === ramSlotType) {
                        const RProfiles = props.profiles.filter((xe) => xe.RAMs.find((ee) => ee.Components.find((re) => re.productId === e.id)));
                        if (haveCommonElement(MProfiles, RProfiles)) {
                            message = 'Compatible'
                        } else {
                            message = 'Non Compatible'
                        }

                        comp = true
                    } else {
                        if (ramSlotType == "") {
                            message = 'chargement en cours'
                            comp = false
                        } else {
                            message = ramSlotType + ' à ' + (k + 1) + ' est requis'
                            comp = false
                        }

                    }
                    data.push(message)

                }
            })
        } else {

        }
        if (data.length > 0) {
            const newdata = data.filter((e) => e != 'Compatible')
            if (newdata.length == 0) {
                updates['ramCompatibility'] = { message: 'Compatible', error: false };
            } else {
                if (newdata[0] == 'chargement en cours') {
                    updates['ramCompatibility'] = { message: 'chargement en cours', error: true };

                } else {
                    updates['ramCompatibility'] = { message: newdata.join(", "), error: true };

                }
            }
        } else {
            if (motherboardId) {
                updates['ramCompatibility'] = { message: 'Veuillez sélectionner au moins une barrette RAM', error: true };

            } else {
                updates['ramCompatibility'] = { message: 'Veuillez sélectionner une carte mére', error: true };

            }
        }
        if (hardDiskPrimaireId) {

            const PProfiles = props.profiles.filter((e) => e.disks.find((ee) => ee.Components.find((Xc) => Xc.productId == hardDiskPrimaireId.id)))
            if (motherboardId) {
                const MProfiles = props.profiles.filter((e) => e.motherboards.find((ee) => ee.productId == motherboardId.id))
                if (haveCommonElement(MProfiles, PProfiles)) {
                    if (hardDiskSecondaire) {
                        const PProfiless = props.profiles.filter((e) => e.disks.find((ee) => ee.Components.find((Xc) => Xc.productId == hardDiskSecondaire.id)))
                        if (haveCommonElement(MProfiles, PProfiless)) {
                            updates['hardDiskCompatibility'] = { message: 'Compatible', error: false };
                        } else {
                            updates['hardDiskCompatibility'] = { message: 'Stockage Secondaire Non Compatible', error: true };
                        }
                    } else {
                        updates['hardDiskCompatibility'] = { message: 'Compatible', error: false };

                    }
                } else {
                    updates['hardDiskCompatibility'] = { message: 'Non Compatible', error: true };

                }
            } else {
                updates['hardDiskCompatibility'] = { message: 'Veuillez sélectionner une carte mére', error: true };

            }

        } else {
            updates['hardDiskCompatibility'] = { message: 'Veuillez sélectionner un disque dur', error: true };
        }
        if (powerId) {
            const PProfiles = props.profiles.filter((e) => e.powersupplys.find((ee) => ee.productId == powerId.id));
            if (motherboardId) {
                const MProfiles = props.profiles.filter((e) => e.motherboards.find((ee) => ee.productId == motherboardId.id))
                if (haveCommonElement(MProfiles, PProfiles)) {
                    updates['powerCompatibility'] = { message: 'Compatible', error: false };

                } else {
                    updates['powerCompatibility'] = { message: 'Non Compatible', error: true };

                }
            } else {
                updates['powerCompatibility'] = { message: 'Veuillez sélectionner une carte mére', error: true };

            }
        } else {
            updates['powerCompatibility'] = { message: 'Veuillez sélectionner la boîte d\'alimentation', error: true };

        }
        if (caseId) {
            const PProfiles = props.profiles.filter((e) => e.cases.find((ee) => ee.productId == caseId.id));
            if (motherboardId) {
                const MProfiles = props.profiles.filter((e) => e.motherboards.find((ee) => ee.productId == motherboardId.id))
                if (haveCommonElement(MProfiles, PProfiles)) {
                    updates['caseCompatibility'] = { message: 'Compatible', error: false };

                } else {
                    updates['caseCompatibility'] = { message: 'Non Compatible', error: true };

                }
            } else {
                updates['caseCompatibility'] = { message: 'Veuillez sélectionner une carte mére', error: true };

            }
        } else {
            updates['caseCompatibility'] = { message: 'Veuillez sélectionner une boîtier', error: true };

        }


        setCompatibility(updates);

        console.log(allProductCompatibility);
    }, [motherboardId, processorId, gpuId, ramId, hardDiskPrimaireId, hardDiskSecondaire, caseId, powerId, cooling, screen]);
    useEffect(() => {

        const updates: Record<string, { message: string; error: boolean }> = {};

        const data: string[] = []
        if (motherboardId) {
            ramId.map((e, k) => {
                if (e != null) {
                    let comp = false
                    let message = "Veuillez sélectionner au moins une barrette RAM"
                    const MProfiles = props.profiles.filter((e) => e.motherboards.find((ee) => ee.productId == motherboardId.id));
                    if (e.memories[0].type.name === ramSlotType) {
                        const RProfiles = props.profiles.filter((xe) => xe.RAMs.find((ee) => ee.Components.find((re) => re.productId === e.id)));
                        if (haveCommonElement(MProfiles, RProfiles)) {
                            message = 'Compatible'
                        } else {
                            message = (k + 1) + ' non Compatible'
                        }

                    } else {
                        message = ramSlotType + ' à ' + (k + 1) + ' est requis'
                        comp = false
                    }
                    data.push(message)

                }
            })
        } else {

        }
        if (data.length > 0) {
            const newdata = data.filter((e) => e != 'Compatible')
            if (newdata.length == 0) {
                updates['ramCompatibility'] = { message: 'Compatible', error: false };
            } else {
                updates['ramCompatibility'] = { message: newdata.join(", "), error: true };
            }
        } else {
            if (motherboardId) {
                updates['ramCompatibility'] = { message: 'Veuillez sélectionner au moins une barrette RAM', error: true };

            } else {
                updates['ramCompatibility'] = { message: 'Veuillez sélectionner une carte mére', error: true };

            }
        }



        setCompatibility(updates);
    }, [ramSlotType])
    useEffect(() => {
        saveToLocalStorage('motherboardId', motherboardId);
        saveToLocalStorage('processorId', processorId);
        saveToLocalStorage('gpuId', gpuId);
        saveToLocalStorage('ramId', ramId);
        saveToLocalStorage('hardDiskPrimaireId', hardDiskPrimaireId);
        saveToLocalStorage('hardDiskSecondaire', hardDiskSecondaire);
        saveToLocalStorage('caseId', caseId);
        saveToLocalStorage('powerId', powerId);
        saveToLocalStorage('cooling', cooling);
        saveToLocalStorage('screen', screen);
        calculePrix()
        // ... save other state variables
    }, [motherboardId, processorId, gpuId, ramId, hardDiskPrimaireId, hardDiskSecondaire, caseId, powerId, cooling, screen]);

    const calculePrix = () => {
        let prix1 = 0
        if (motherboardId) {
            prix1 = (prix1 + parseInt(motherboardId.price.toString()))
        }

        if (processorId) {
            prix1 = (prix1 + parseInt(processorId.price.toString()))

        }

        if (gpuId) {
            prix1 = (prix1 + parseInt(gpuId.price.toString()))

        }


        ramId.map((e) => {
            if (e != null) {
                prix1 = (prix1 + parseInt(e.price.toString()))

            }
        })

        if (hardDiskPrimaireId) {
            prix1 = (prix1 + parseInt(hardDiskPrimaireId.price.toString()))

        }

        if (hardDiskSecondaire) {
            prix1 = (prix1 + parseInt(hardDiskSecondaire.price.toString()))

        }

        if (caseId) {
            prix1 = (prix1 + parseInt(caseId.price.toString()))

        }

        if (powerId) {
            prix1 = (prix1 + parseInt(powerId.price.toString()))

        }

        if (cooling) {
            prix1 = (prix1 + parseInt(cooling.price.toString()))

        }

        if (screen) {
            prix1 = (prix1 + parseInt(screen.price.toString()))

        }
        setPrix(prix1)
    }

    const viderTous = () => {
        setMotherboardId(undefined)
        setPowerId(undefined)
        setProcessorId(undefined)
        setPowerId(undefined)
        sethardDiskPrimaireId(undefined)
        setHardDiskSecondaire(undefined)
        setCase(undefined)
        setGpuId(undefined)
        setcooling(undefined)
        setscreen(undefined)
        setRamId([null, null])
    }
    return (
        <div>
            <Motherboard
                cpuId={processorId}
                selectedCompatibility={allProductCompatibility}
                motherboardId={motherboardId}
                setMotherboardId={setMotherboardId}
                profiles={props.profiles}
                motherboardchipset={props.motherboardchipset}
                motherboardcpusupport={props.motherboardcpusupport}
                motherboardformat={props.motherboardformat}
                motherboardramslots={props.motherboardramslots} motherboardmanufacturer={props.motherboardmanufacturer} />
            <Processor

             selectedFeatures={selectedFeatures}
                removeFeature={removeFeature}
                addFeature={addFeature}
                setProcessorId={setProcessorId}
                processorId={processorId}
                motherboardId={motherboardId}
                selectedCompatibility={allProductCompatibility}
                profiles={props.profiles}
                cPUSupport={props.cPUSupport}
                processorModel={props.processorModel}
            />
            <GraphicCard

                selectedFeatures={selectedFeatures}
                removeFeature={removeFeature}
                addFeature={addFeature}
            setProcessorId={setGpuId}
                processorId={gpuId}
                motherboardId={motherboardId}
                selectedCompatibility={allProductCompatibility}
                profiles={props.profiles}
                gpuArchBrand={props.gpuArchBrand}
                gpuBrand={props.gpuBrand}
                graphiccardName={props.graphiccardName}
            />
            <Ram
              selectedFeatures={selectedFeatures}
                removeFeature={removeFeature}
                addFeature={addFeature}
                ramSlotNumber={ramSlotNumber}
                ramSlotType={ramSlotType}
                rams={ramId}
                setRams={setRamId}
                selectedCompatibility={allProductCompatibility}
                motherboardId={motherboardId}
                setMotherboardId={setMotherboardId}
                profiles={props.profiles}
                memoryFrequency={props.memoryFrequency}
                memoryMarque={props.memoryMarque}
                memoryNumber={props.memoryNumber}
                memoryType={props.memoryType}
                setCompatibility={setCompatibility}

            />
            <HardDisk
                role={<>
                    Principal <p className='text-xs text-[#885bd7] p-1'>(*Obligatoire)</p>
                </>}
                setProcessorId={sethardDiskPrimaireId}
                processorId={hardDiskPrimaireId}
                motherboardId={motherboardId}
                selectedCompatibility={allProductCompatibility}
                profiles={props.profiles}
                harddiskBrand={props.harddiskBrand}
                harddiskCapacity={props.harddiskCapacity}
                harddiskComputerinterface={props.harddiskComputerinterface}
                harddiskType={props.harddiskType}


            />
            <HardDisk
                role={<>
                    Secondaire
                </>}
                setProcessorId={setHardDiskSecondaire}
                processorId={hardDiskSecondaire}
                motherboardId={motherboardId}
                selectedCompatibility={allProductCompatibility}
                profiles={props.profiles}
                harddiskBrand={props.harddiskBrand}
                harddiskCapacity={props.harddiskCapacity}
                harddiskComputerinterface={props.harddiskComputerinterface}
                harddiskType={props.harddiskType}


            />
            <Power
                setProcessorId={setPowerId}
                processorId={powerId}
                motherboardId={motherboardId}
                selectedCompatibility={allProductCompatibility}
                profiles={props.profiles}
                powersupplyMarque={props.powersupplyMarque}
                psCertification={props.psCertification}
            />
            <Case
                setProcessorId={setCase}
                processorId={caseId}
                motherboardId={motherboardId}
                selectedCompatibility={allProductCompatibility}
                profiles={props.profiles}
                pCcaseBrand={props.pCcaseBrand}
                pCcaseCaseformat={props.pCcaseCaseformat}
                pCcaseNumberofFansPreinstalled={props.pCcaseNumberofFansPreinstalled}
                pCcaseRGBType={props.pCcaseRGBType}
            />
            <Cooling
                setProcessorId={setcooling}
                processorId={cooling}
                motherboardId={motherboardId}
                selectedCompatibility={allProductCompatibility}
                profiles={props.profiles}
                coolingMark={props.coolingMark}
                coolingType={props.coolingType}
                coolingcPUSupport={props.coolingcPUSupport}
                fansNumber={props.fansNumber}
            />
            <Screen
                setProcessorId={setscreen}
                processorId={screen}
                motherboardId={motherboardId}
                selectedCompatibility={allProductCompatibility}
                profiles={props.profiles}
                mark={props.mark}
                pouce={props.pouce}
                refreshRate={props.refreshRate}
                resolution={props.resolution}

            />
            <Details
                motherboardId={motherboardId}
                processorId={processorId}
                ramId={ramId}
                gpuId={gpuId}
                hardDiskPrimaireId={hardDiskPrimaireId}
                hardDiskSecondaire={hardDiskSecondaire}
                caseId={caseId}
                powerId={powerId}
                cooling={cooling}
                screen={screen}
                prix={prix}
                allProductCompatibility={allProductCompatibility}
                vider={viderTous}
            />
        </div>
    )
}
