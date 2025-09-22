import React, { useState } from 'react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Product } from '@/types'
import { Bold } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Memory } from './Ram'
import useCart, { CartItem, PCCustom } from '@/hooks/use-cart'
import { AllProductsCompatibility, motherboardCompatibility } from './comps'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
type compatibiltyItemResult = {
    message: string,
    error: boolean
}
const Details = (props: {
    motherboardId: Product | undefined,
    processorId: Product | undefined,
    ramId: (Memory | null)[],
    hardDiskPrimaireId: Product | undefined,
    hardDiskSecondaire: Product | undefined,
    caseId: Product | undefined,
    powerId: Product | undefined,
    cooling: Product | undefined,
    gpuId: Product | undefined,
    screen: Product | undefined,
    prix: number,
    allProductCompatibility: AllProductsCompatibility
    vider:()=>void
}
) => {
    const [openAleert,setOpenAleert]=useState(false)
    const router=useRouter()
    function generateHashId() {
        const timestamp = new Date().getTime().toString(16); // Convert timestamp to hexadecimal
        const random = Math.random().toString(16).substring(2); // Generate random hexadecimal string

        return `${timestamp}-${random}`;
    }

    function findAllErrorCompatibilities(compatibility: motherboardCompatibility): compatibiltyItemResult[] {
        return Object.values(compatibility).filter(item => item.error);
    }


    const cart = useCart();
    const sendTocart = () => {
        const d = findAllErrorCompatibilities(props.allProductCompatibility.Compatibility)
        console.log(d)
        if (d.length > 0) {
         setOpenAleert(true)
        } else {
            if (props.motherboardId &&
                props.processorId &&
                props.gpuId &&
                props.caseId &&
                props.powerId &&
                props.ramId &&
                props.hardDiskPrimaireId
    
            ) {
    
    
                // Example usage:
                const uniqueId = generateHashId();
                const pc: CartItem = {
                    idd: uniqueId,
                    Title:"PC sur mesure",
                    motherboard: props.motherboardId,
                    processor: props.processorId,
                    gpu: props.gpuId,
                    case: props.caseId,
                    power: props.powerId,
                    ram: props.ramId.filter((e)=>e!=null) as Product[],
                    disk: props.hardDiskPrimaireId,
                    price: props.prix,
                    reduction:0,
                    number: 1
                }
                cart.addItem(pc)
                props.vider()
            }
        }
      

    }
 const sendTocart2 = () => {
        const d = findAllErrorCompatibilities(props.allProductCompatibility.Compatibility)
        console.log(d)
        if (d.length > 0) {
         setOpenAleert(true)
        } else {
            if (props.motherboardId &&
                props.processorId &&
                props.gpuId &&
                props.caseId &&
                props.powerId &&
                props.ramId &&
                props.hardDiskPrimaireId
    
            ) {
    
    
                // Example usage:
                const uniqueId = generateHashId();
                const pc: CartItem = {
                    reduction:0,
                    idd: uniqueId,
                    Title:"PC sur mesure",
                    motherboard: props.motherboardId,
                    processor: props.processorId,
                    gpu: props.gpuId,
                    case: props.caseId,
                    power: props.powerId,
                    ram: props.ramId.filter((e)=>e!=null) as Product[],
                    disk: props.hardDiskPrimaireId,
                    price: props.prix,
                    number: 1
                }
                cart.addItem(pc)
                props.vider()
                router.push("cart")
            }
        }
      

    }
    return (
        <div>

<AlertDialog open={openAleert}  onOpenChange={()=>setOpenAleert(!openAleert)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Vous avez un ou plusieur problem</AlertDialogTitle>
          <AlertDialogDescription>
            <ul>
            {findAllErrorCompatibilities(props.allProductCompatibility.Compatibility).map((e,k)=>(
<><li className='font-semibold text-red-500'>*{e.message}</li></>
))}
            </ul>
        
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        
          <AlertDialogAction>Fermer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
            <Popover >
                <PopoverTrigger  asChild>
                <button className='fixed bottom-0 right-0 z-50 mr-7 mb-7'>
                        <Btn CompNumber={0}  Total={props.prix} />
                    </button>
                 
                </PopoverTrigger>
                <PopoverContent className=" dark:bg-black mr-7 mb-0 w-screen  lg:w-auto md:w-auto">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <p>

                                <div className='text-sm'>  <span className='font-bold text-lg'>Mon PC </span>sur mesure, l&apos;outil parfait, conçu exactement pour moi !</div>
                            </p>

                        </div>
                        <div className="grid gap-2">
                            <div>

                            </div>
                            <Card>
                                <CardContent className='p-0 flex align-middle  '>
                                    <div className=' p-2 text-sm font-semibold flex-shrink-1'>
                                        Carte mére
                                    </div>
                                    {props.motherboardId ? <>
                                        <div className='text-sm p-2 h-full border-l-1'>
                                            {props.motherboardId.name + ' '}
                                            <span className='font-semibold ml-1'> {' ' + props.motherboardId.price} (TND) X 1</span>
                                        </div>

                                    </> : <>
                                        <div className='text-xs m-auto'>
                                            Veuillez choisir une carte mère
                                        </div>
                                    </>}

                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className='p-0 flex align-middle '>
                                    <div className=' p-2 text-sm font-semibold'>
                                        Processuer
                                    </div>
                                    {props.processorId ? <>
                                        <div className='text-sm p-2 h-full border-l-1'>
                                            {props.processorId.name + ' '}
                                            <span className='font-semibold ml-1'> {' ' + props.processorId.price} (TND) X 1</span>
                                        </div>

                                    </> : <>
                                        <div className='text-xs m-auto'>
                                            Veuillez choisir un processeur
                                        </div>
                                    </>}

                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className='p-0 flex align-middle '>
                                    <div className=' p-2 text-sm font-semibold'>
                                        Carte graphiqe
                                    </div>
                                    {props.gpuId ? <>
                                        <div className='text-sm p-2 h-full border-l-1'>
                                            {props.gpuId.name + ' '}
                                            <span className='font-semibold ml-1'> {' ' + props.gpuId.price} (TND) X 1</span>
                                        </div>

                                    </> : <>
                                        <div className='text-xs m-auto'>
                                        Veuillez vérifier si une carte graphique est déjà intégrée.
                                        </div>
                                    </>}

                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className='p-0  flex align-middle  '>
                                    <div className=' p-2 my-auto text-sm font-semibold'>
                                        Ram
                                    </div>
                                    {props.ramId && props.ramId.findIndex((e) => e != null) != -1 ? <>
                                        <div className='flex flex-col'>
                                            {
                                                props.ramId.map((item) => (
                                                    <><div className='flex flex-row'>


                                                        {item ? <>

                                                            <div >
                                                                <div className='text-sm p-2 h-full border-l-1'>
                                                                    {item.name + ' '}
                                                                    <span className='font-semibold ml-1'> {' ' + item.price} (TND) X 1</span>
                                                                </div>

                                                            </div>
                                                        </> : <></>} </div>
                                                    </>
                                                ))
                                            } </div>


                                    </> : <>
                                        <div className='text-xs m-auto'>
                                            Veuillez choisir une barette memoire
                                        </div>
                                    </>}

                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className='p-0 flex align-middle '>
                                    <div className=' p-2 text-sm font-semibold'>
                                        Stockage Principal
                                    </div>
                                    {props.hardDiskPrimaireId ? <>
                                        <div className='text-sm p-2 h-full border-l-1'>
                                            {props.hardDiskPrimaireId.name + ' '}
                                            <span className='font-semibold ml-1'> {' ' + props.hardDiskPrimaireId.price} (TND) X 1</span>
                                        </div>

                                    </> : <>
                                        <div className='text-xs m-auto'>
                                            Veuillez choisir un disque dur
                                        </div>
                                    </>}

                                </CardContent>
                            </Card>
                            {props.hardDiskSecondaire ? <>
                                <Card>
                                    <CardContent className='p-0 flex align-middle '>
                                        <div className=' p-2 text-sm font-semibold'>
                                            Stockage Secondaire
                                        </div>

                                        <div className='text-sm p-2 h-full border-l-1'>
                                            {props.hardDiskSecondaire.name + ' '}
                                            <span className='font-semibold ml-1'> {' ' + props.hardDiskSecondaire.price} (TND) X 1</span>
                                        </div>




                                    </CardContent>
                                </Card> </> : <></>}

                            <Card>
                                <CardContent className='p-0 flex align-middle '>
                                    <div className=' p-2 text-sm font-semibold'>
                                        Boitier
                                    </div>
                                    {props.caseId ? <>
                                        <div className='text-sm p-2 h-full border-l-1'>
                                            {props.caseId.name + ' '}
                                            <span className='font-semibold ml-1'> {' ' + props.caseId.price} (TND) X 1</span>
                                        </div>

                                    </> : <>
                                        <div className='text-xs m-auto'>
                                            Veuillez choisir une boitier
                                        </div>
                                    </>}

                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className='p-0 flex align-middle '>
                                    <div className=' p-2 text-sm font-semibold'>
                                        Bloc d&apos;alimentation
                                    </div>
                                    {props.powerId ? <>
                                        <div className='text-sm p-2 h-full border-l-1'>
                                            {props.powerId.name + ' '}
                                            <span className='font-semibold ml-1'> {' ' + props.powerId.price} (TND) X 1</span>
                                        </div>

                                    </> : <>
                                        <div className='text-xs m-auto'>
                                            Veuillez choisir un bloc d&apos;alimentation
                                        </div>
                                    </>}

                                </CardContent>
                            </Card>
                            {props.cooling ? <>
                                <Card>
                                    <CardContent className='p-0 flex align-middle '>
                                        <div className=' p-2 text-sm font-semibold'>
                                            Refroidisseur CPU
                                        </div>

                                        <div className='text-sm p-2 h-full border-l-1'>
                                            {props.cooling.name + ' '}
                                            <span className='font-semibold ml-1'> {' ' + props.cooling.price} (TND) X 1</span>
                                        </div>




                                    </CardContent>
                                </Card> </> : <></>}
                            {props.screen ? <>
                                <Card>
                                    <CardContent className='p-0 flex align-middle '>
                                        <div className=' p-2 text-sm font-semibold'>
                                            Ecran
                                        </div>

                                        <div className='text-sm p-2 h-full border-l-1'>
                                            {props.screen.name + ' '}
                                            <span className='font-semibold ml-1'> {' ' + props.screen.price} (TND) X 1</span>
                                        </div>




                                    </CardContent>
                                </Card> </> : <></>}
                            <div>
                                <span>Total :</span> {props.prix} (TND)
                            </div>
                        </div>
                    </div>
                    <div className='w-full mt-3 flex justify-end'>
                        <div className='ml-auto'>
                            <Button variant={'outline'} className='bg-transparent' onClick={() => sendTocart()} >Ajouter au panier <Shopcard /></Button>


                            <Button onClick={() => {
sendTocart2()

                            }}>Commander</Button>

                        </div>

                    </div>
                </PopoverContent>
            </Popover></div>
    )
}
const Shopcard = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 " viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
    )
}
interface btnProp{
    Total:number,
    CompNumber:number
}
const Btn :React.FC<btnProp>= ({Total,CompNumber}) => {
    return (<>

        <div className='shadow-md flex flex-row-reverse dark:bg-black drop-shadow hover:opacity-100 opacity-80  bg-amber-50 rounded-full p-2 border  '
        >
        <div className='flex align-middle'>
            <div className='flex align-middle mx-2'>
            {Total} TND
            </div>
            
            </div> 
                   <svg version="1.0"
            width="50" height="50" viewBox="0 0 1280.000000 765.000000"
        >

                <g transform="translate(0.000000,765.000000) scale(0.100000,-0.100000)"
                    fill="currentColor" stroke="none">
                    <path d="M9620 7641 c-69 -21 -130 -73 -166 -141 -18 -34 -19 -144 -19 -3675
0 -3531 1 -3641 19 -3675 26 -49 74 -98 121 -123 l40 -22 1500 0 1500 0 40 22
c47 25 95 74 121 123 18 34 19 144 19 3675 0 3531 -1 3641 -19 3675 -26 49
-74 98 -121 123 l-40 22 -1485 2 c-817 1 -1496 -2 -1510 -6z m2384 -823 c9
-12 16 -32 16 -43 0 -11 -7 -31 -16 -43 l-15 -22 -939 0 -939 0 -15 22 c-9 12
-16 32 -16 43 0 11 7 31 16 43 l15 22 939 0 939 0 15 -22z m0 -320 c22 -31 20
-64 -4 -88 -20 -20 -33 -20 -950 -20 -917 0 -930 0 -950 20 -24 24 -26 57 -4
88 l15 22 939 0 939 0 15 -22z m-203 -610 c52 -15 117 -73 140 -122 22 -49 25
-143 6 -189 -65 -155 -273 -193 -389 -70 -61 64 -78 171 -41 253 50 110 168
163 284 128z m147 -1400 c7 -7 12 -29 12 -49 0 -74 74 -69 -961 -69 -916 0
-929 0 -949 20 -22 22 -26 60 -10 91 10 19 32 19 953 19 720 0 946 -3 955 -12z
m0 -390 c7 -7 12 -29 12 -49 0 -74 74 -69 -961 -69 -916 0 -929 0 -949 20 -22
22 -26 60 -10 91 10 19 32 19 953 19 720 0 946 -3 955 -12z m0 -390 c7 -7 12
-29 12 -49 0 -74 64 -69 -967 -69 -910 0 -923 0 -943 20 -22 22 -26 60 -10 91
10 19 32 19 953 19 720 0 946 -3 955 -12z m0 -390 c7 -7 12 -29 12 -49 0 -74
64 -69 -967 -69 -910 0 -923 0 -943 20 -22 22 -26 60 -10 91 10 19 32 19 953
19 720 0 946 -3 955 -12z m222 -1329 c21 -12 47 -38 59 -59 20 -37 21 -49 21
-432 0 -393 0 -395 -22 -428 -13 -18 -36 -43 -51 -54 -27 -20 -42 -21 -315
-24 -282 -3 -288 -2 -332 20 -33 17 -51 35 -67 68 -23 43 -23 50 -23 415 0
211 4 385 10 404 5 19 20 45 32 59 45 49 63 51 367 52 270 0 285 -1 321 -21z"/>
                    <path d="M109 7597 c-29 -16 -54 -40 -74 -72 l-30 -48 -3 -2801 c-3 -3086 -7
-2846 58 -2913 67 -68 -94 -63 1919 -63 1617 0 1821 -2 1821 -15 0 -15 -78
-1007 -82 -1055 l-3 -25 -677 -5 c-813 -6 -733 11 -733 -156 l0 -108 34 -23
34 -23 2024 0 c2206 0 2081 -3 2103 55 14 36 13 168 -1 199 -26 55 -32 56
-724 56 -598 0 -635 1 -635 18 0 9 -18 240 -40 512 -22 272 -40 512 -40 533
l0 37 1818 0 c1736 0 1819 1 1857 19 58 26 101 80 115 143 8 39 10 779 8 2833
-3 2568 -4 2782 -20 2810 -20 38 -63 78 -105 99 -29 15 -392 16 -4306 16
l-4274 0 -44 -23z m8526 -2937 l0 -2675 -4207 -3 -4208 -2 0 2680 0 2680 4208
-2 4207 -3 0 -2675z"/>
                </g>
            </svg>
            <div className='bg-purple-500 text-white  fixed border rounded-full p-1 w-6 h-6 translate-x-1 -translate-y-3 text-xs'>?</div>

        </div>

    </>)
}
export default Details