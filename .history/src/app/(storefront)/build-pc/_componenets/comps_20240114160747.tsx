type compatibiltyItemResult = {
    message: string,
    error: boolean
}
type motherboardCompatibility ={
    processorCompatibility: compatibiltyItemResult
    ramCompatibility: compatibiltyItemResult
    hardDiskCompatibility: compatibiltyItemResult
    caseCompatibility: compatibiltyItemResult
    powerCompatibility: compatibiltyItemResult
}
type processorCompatibility ={
    motherboardCompatibility: compatibiltyItemResult
    ramCompatibility: compatibiltyItemResult
    hardDiskCompatibility: compatibiltyItemResult
    caseCompatibility: compatibiltyItemResult
    powerCompatibility: compatibiltyItemResult
}
type ramCompatibility ={
    processorCompatibility: compatibiltyItemResult
    motherboardCompatibility: compatibiltyItemResult
    hardDiskCompatibility: compatibiltyItemResult
    caseCompatibility: compatibiltyItemResult
    powerCompatibility: compatibiltyItemResult
}
type hardDiskCompatibility ={
    processorCompatibility: compatibiltyItemResult
    ramCompatibility: compatibiltyItemResult
    motherboardCompatibility: compatibiltyItemResult
    caseCompatibility: compatibiltyItemResult
    powerCompatibility: compatibiltyItemResult
}
type powerCompatibility ={
    processorCompatibility: compatibiltyItemResult
    ramCompatibility: compatibiltyItemResult
    hardDiskCompatibility: compatibiltyItemResult
    caseCompatibility: compatibiltyItemResult
    motherboardCompatibility: compatibiltyItemResult
}
type caseCompatibility ={
    processorCompatibility: compatibiltyItemResult
    ramCompatibility: compatibiltyItemResult
    hardDiskCompatibility: compatibiltyItemResult
    motherboardCompatibility: compatibiltyItemResult
    powerCompatibility: compatibiltyItemResult
}
export type AllProductsCompatibility = {
    motherboardCompatibility: motherboardCompatibility
    processorCompatibility: processorCompatibility
    ramCompatibility: ramCompatibility
    hardDiskCompatibility: hardDiskCompatibility
    caseCompatibility: caseCompatibility
    powerCompatibility: powerCompatibility
}
export const defaultAllProductsCompatibility: AllProductsCompatibility = {
    motherboardCompatibility:{
        processorCompatibility: {
            message: 'Veuillez sélectionner un processeur',
            error: true,
        },
        ramCompatibility: {
            message: 'Veuillez sélectionner au moins une barrette RAM',
            error: true,
        },
        hardDiskCompatibility: {
            message: 'Veuillez sélectionner un disque dur',
            error: true,
        },
        caseCompatibility: {
            message: 'Veuillez sélectionner un boîtier',
            error: true,
        },
        powerCompatibility: {
            message: 'Veuillez sélectionner la boîte d\'alimentation',
            error: true,
        },
    },
    processorCompatibility: {
        motherboardCompatibility:{
            message: 'Veuillez sélectionner une cate mére',
            error: true,
        },
        ramCompatibility: {
            message: 'Veuillez sélectionner au moins une barrette RAM',
            error: true,
        },
        hardDiskCompatibility: {
            message: 'Veuillez sélectionner un disque dur',
            error: true,
        },
        caseCompatibility: {
            message: 'Veuillez sélectionner un boîtier',
            error: true,
        },
        powerCompatibility: {
            message: 'Veuillez sélectionner la boîte d\'alimentation',
            error: true,
        },
    },
    ramCompatibility: {
        motherboardCompatibility:{
            message: 'Veuillez sélectionner une cate mére',
            error: true,
        },
        processorCompatibility: {
            message: 'Veuillez sélectionner un processeur',
            error: true,
        },
        hardDiskCompatibility: {
            message: 'Veuillez sélectionner un disque dur',
            error: true,
        },
        caseCompatibility: {
            message: 'Veuillez sélectionner un boîtier',
            error: true,
        },
        powerCompatibility: {
            message: 'Veuillez sélectionner la boîte d\'alimentation',
            error: true,
        },
    },
    hardDiskCompatibility: {
        motherboardCompatibility:{
            message: 'Veuillez sélectionner une cate mére',
            error: true,
        },
        processorCompatibility: {
            message: 'Veuillez sélectionner un processeur',
            error: true,
        },
        ramCompatibility: {
            message: 'Veuillez sélectionner au moins une barrette RAM',
            error: true,
        },
        caseCompatibility: {
            message: 'Veuillez sélectionner un boîtier',
            error: true,
        },
        powerCompatibility: {
            message: 'Veuillez sélectionner la boîte d\'alimentation',
            error: true,
        },
    },
    caseCompatibility: {
        motherboardCompatibility:{
            message: 'Veuillez sélectionner une cate mére',
            error: true,
        },
        processorCompatibility: {
            message: 'Veuillez sélectionner un processeur',
            error: true,
        },
        ramCompatibility: {
            message: 'Veuillez sélectionner au moins une barrette RAM',
            error: true,
        },
        hardDiskCompatibility: {
            message: 'Veuillez sélectionner un disque dur',
            error: true,
        },
       
        powerCompatibility: {
            message: 'Veuillez sélectionner la boîte d\'alimentation',
            error: true,
        },
    },
    powerCompatibility: {
        motherboardCompatibility:{
            message: 'Veuillez sélectionner une cate mére',
            error: true,
        },
        processorCompatibility: {
            message: 'Veuillez sélectionner un processeur',
            error: true,
        },
        ramCompatibility: {
            message: 'Veuillez sélectionner au moins une barrette RAM',
            error: true,
        },
        hardDiskCompatibility: {
            message: 'Veuillez sélectionner un disque dur',
            error: true,
        },
        caseCompatibility: {
            message: 'Veuillez sélectionner un boîtier',
            error: true,
        },
       
    },
};