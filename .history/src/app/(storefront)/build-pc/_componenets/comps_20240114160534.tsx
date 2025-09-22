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