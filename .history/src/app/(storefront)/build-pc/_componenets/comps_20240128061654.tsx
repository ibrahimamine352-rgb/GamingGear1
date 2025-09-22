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
            message: 'Veuillez sélectionner une carte mére',
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
            message: 'Veuillez sélectionner une boîtier',
            error: true,
        },
        powerCompatibility: {
            message: 'Veuillez sélectionner la boîte d\'alimentation',
            error: true,
        },
    gpuCompatibility: {
            message: 'Veuillez sélectionner une carte graphique',
            error: true,
        },
       
    },
};