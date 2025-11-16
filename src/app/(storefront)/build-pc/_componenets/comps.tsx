
type compatibiltyItemResult = {
    message: string,
    error: boolean
}
export type motherboardCompatibility ={
    motherboardCompatibility: compatibiltyItemResult
    processorCompatibility: compatibiltyItemResult
    ramCompatibility: compatibiltyItemResult
    hardDiskCompatibility: compatibiltyItemResult
    caseCompatibility: compatibiltyItemResult
    powerCompatibility: compatibiltyItemResult
    gpuCompatibility: compatibiltyItemResult
}
export type AllProductsCompatibility = {
    Compatibility: motherboardCompatibility
   
}
export const defaultAllProductsCompatibility: AllProductsCompatibility = {
    Compatibility:{
        motherboardCompatibility: {
            message: 'Please select a motherboard',
            error: true,
        },
        processorCompatibility: {
            message: 'Please select a processor',
            error: true,
        },
        ramCompatibility: {
            message: 'Please select at least one RAM module',
            error: true,
        },
        hardDiskCompatibility: {
            message: 'Please select a hard drive',
            error: true,
        },
        caseCompatibility: {
            message: 'Please select a case',
            error: true,
        },
        powerCompatibility: {
            message: 'Please select the power supply box',
            error: true,
        },
    gpuCompatibility: {
            message: 'Please select a graphics card',
            error: true,
        },
       
    },
    
    
};
// src/app/(storefront)/build-pc/_components/comps.tsx

// …(your compatibility types stay as-is)
export {
    CpuIcon,
    MotherboardIcon,
    GpuIcon,
    RamIcon,
    SsdIcon,
    HddIcon,
    PsuIcon,
    CaseIcon,
    CoolerIcon,
    ScreenIcon,
  } from "./gg1_solid_icons";