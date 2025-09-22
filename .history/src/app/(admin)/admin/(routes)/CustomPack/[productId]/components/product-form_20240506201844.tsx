"use client"

import * as z from "zod"
const axios = require("axios");
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { CPUSupport, Category, ComponentOnPc, ComponentOnPcGroupeEntityProfile, EntityProfile, Image, PreBuiltPcmodel, Product, pcTemplate } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUpload from "@/components/ui/image-upload"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea";
import Addtioanlinfos from "./addtioanlinfos";
import InputArray from "./addtioanlinfos";
import { ProdCol } from "@/types";
import Pctemplate from "./pc-template";

type Field = {
  name: string;
  value: string;
};

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array().min(1),
  price: z.coerce.number().min(0).optional(),
  categoryId: z.string().min(1),
  dicountPrice: z.coerce.number().optional(),
  description: z.string().min(1),
  discountOnPc:z.coerce.number().optional(),
  stock: z.coerce.number().min(0).optional(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  additionalDetails: z.object({ name: z.string(), value: z.string() }).array(),

});
export type motherboardata = {
  products: Product[]
  cpusupport: CPUSupport
}
type ramSlot = {
  rams: ProdCol[];
}
type DiskSlot = {
  disk: ProdCol[];
}
type ProductFormValues = z.infer<typeof formSchema>

export interface ProductFormProps {
  initialData: Product & {
    images: Image[]
    PackProduct:{
        Clavier: ProdCol[],
        Headset:ProdCol[],
        Mic:ProdCol[],
        Mouse:ProdCol[],
        MousePad:ProdCol[],
        Screen:ProdCol[],   
        Speaker:ProdCol[], 
        Manette:ProdCol[], 
        Chair:ProdCol[],  
        Camera:ProdCol[],
        DefaultClavier:String
        DefaultMouse:String
        DefaultMousePad:String
        DefaultMic:String
        DefaultHeadset:String
        DefaultCamera:String
        DefaultScreen:String
        DefaultSpeaker :String
        DefaultManette:String
        DefaultChair   :String
        discountOnPack: number
    }[]

   
  } | null;
  categories: Category[];

 
  keyboards: ProdCol[];
  Mouses: ProdCol[];
  Mousepads: ProdCol[];
  Mics: ProdCol[];
  Headsets: ProdCol[]
  Cameras: ProdCol[];
  screens: ProdCol[]
  Hautparleurs: ProdCol[]
  Manettes:ProdCol[],
  Chaisegamings:ProdCol[]
};

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  keyboards,
  Mouses,
  Mousepads,
  Mics,
  Headsets,
  Cameras,
  screens,  
  Hautparleurs,  
  Manettes,
  Chaisegamings, 
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit product' : 'Create product';
  const description = initialData ? 'Edit a product.' : 'Add a new product';
  const toastMessage = initialData ? 'Product updated.' : 'Product created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
    images:initialData.images,
    price: parseFloat(String(initialData?.price)),
    dicountPrice: parseFloat(String(initialData?.price)),
    stock: parseInt(String(initialData?.price)),
    PackProduct:{
      Clavier:initialData.PackProduct[0].Clavier ,
      Headset:initialData.PackProduct[0].Headset,
      Mic:initialData.PackProduct[0].Mic,
      Mouse:initialData.PackProduct[0].Mouse,
      MousePad:initialData.PackProduct[0].MousePad,
      Screen:initialData.PackProduct[0].Screen, 
      Speaker:initialData.PackProduct[0].Speaker, 
      Manette:initialData.PackProduct[0].Manette, 
      Chair:initialData.PackProduct[0].Chair, 
      Camera:initialData.PackProduct[0].Camera, 
      DefaultClavier:initialData.PackProduct[0].DefaultClavier,
      DefaultMouse:initialData.PackProduct[0].DefaultMouse,
      DefaultMousePad:initialData.PackProduct[0].DefaultMousePad,
      DefaultMic:initialData.PackProduct[0].DefaultMic,
      DefaultHeadset:initialData.PackProduct[0].DefaultHeadset,
      DefaultCamera:initialData.PackProduct[0].DefaultCamera,
      DefaultScreen:initialData.PackProduct[0].DefaultScreen,
      DefaultSpeaker:initialData.PackProduct[0].DefaultSpeaker,
      DefaultManette:initialData.PackProduct[0].DefaultManette,
      DefaultChair:initialData.PackProduct[0].DefaultChair,


    }
   } : {
    name: '',
    images: [],
    price: 0,
    categoryId: '',
    dicountPrice: 0,
    description: '',
    stock: 0,
    isFeatured: false,
    isArchived: false,
    additionalDetails: [],
    PackProduct:{
      Clavier:[],
      Headset:[],
      Mic:[],
      Mouse:[],
      MousePad:[],
      Screen:[],
      Speaker:[],
      Manette:[],
      Chair:[],
      Camera:[],
      discountOnPack:0,
      DefaultClavier:"",
        DefaultMouse:"",
        DefaultMousePad:"",
        DefaultMic:"",
        DefaultHeadset:"",
        DefaultCamera:"",
        DefaultScreen:"",
        DefaultSpeaker:"",
        DefaultManette:"",
        DefaultChair:"",
    }
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    console.log("data")
    const dis=form.getValues('discountOnPc')
  
      try {
        setLoading(true);
        if(total)
        data.price=parseInt(total.toString())
        const pct = {
Clavier:keyboardList,
Mouse:MouseList,
MousePad:MousepadsList,
Mic:MicsList,
Headset:HeadsetsList,
Camera:CamerasList,
Screen:screensList,
Speaker:HautparleursList,
Manette:ManettesList,
Chair:ChaisegamingsList,
discountOnPack:dis,
DefaultClavier:defaultKeyboard,
DefaultMouse:defaultMouse,
DefaultMousePad:defaultMousePad,
DefaultMic:defaultMics,
DefaultHeadset:defaultHeadset,
DefaultCamera:defaultCamera,
DefaultScreen:defaultScreen,
DefaultSpeaker:DefaultSpeaker,
DefaultManette:DefaultManette,
DefaultChair:DefaultChair
        }
      
        
        if (initialData) {
          await axios.patch(`/api/Pack/${params.productId}`, { ...data, ...pct });
        } else {
          await axios.post(`/api/Pack`, { ...data, ...pct });
        }
        router.refresh();
        router.push(`/admin/CustomPack`);
        toast.success(toastMessage);
      } catch (error: any) {

        toast.error('Something went wrong.');
     console.log(error)
      } finally {
        setLoading(false);
      }
    
  
 
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/Pack/${params.productId}`);
      router.refresh();
      router.push(`/products`);
      toast.success('Product deleted.');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }


  // const handleInputArrayChange = (inputArray: Array<{ name: string; value: string }>) => {
  //   setParentInputArray(inputArray);

  //   console.log(parentInputArray)
  // };
  const [pcTemplate, setPcTemplate] = useState({})






  const [keyboardList, setkeyboardList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Clavier
    ? keyboards.filter(e => initialData?.PackProduct[0].Clavier.find(ee => e.id === ee.id))
    : []);
    const [MouseList, setMouseList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Mouse
      ? Mouses.filter(e => initialData?.PackProduct[0].Mouse.find(ee => e.id === ee.id))
      : []);
  
  const [MousepadsList, setMousepadsList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].MousePad
      ? Mousepads.filter(e => initialData?.PackProduct[0].MousePad.find(ee => e.id === ee.id))
      : []);
  
  const [MicsList, setMicsList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Mic
      ? Mics.filter(e => initialData?.PackProduct[0].Mic.find(ee => e.id === ee.id))
      : []);
  
  const [HeadsetsList, setHeadsetsList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Headset
      ? Headsets.filter(e => initialData?.PackProduct[0].Headset.find(ee => e.id === ee.id))
      : []);
  
  const [CamerasList, setCamerasList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Camera
      ? Cameras.filter(e => initialData?.PackProduct[0].Camera.find(ee => e.id === ee.id))
      : []);
  
  const [screensList, setscreensList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Screen
      ? screens.filter(e => initialData?.PackProduct[0].Screen.find(ee => e.id === ee.id))
      : []);
  
  const [HautparleursList, setHautparleursList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Speaker
      ? Hautparleurs.filter(e => initialData?.PackProduct[0].Speaker.find(ee => e.id === ee.id))
      : []);
  
  const [ManettesList, setManettesList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Manette
      ? Manettes.filter(e => initialData?.PackProduct[0].Manette.find(ee => e.id === ee.id))
      : []);
  
  const [ChaisegamingsList, setChaisegamingsList] = useState<ProdCol[]>(initialData && initialData.PackProduct && initialData.PackProduct[0].Chair
      ? Chaisegamings.filter(e => initialData?.PackProduct[0].Chair.find(ee => e.id === ee.id))
      : []);
  
  console.log(initialData?.PackProduct[0].Clavier)

  const [defaultKeyboard,setDefaultKeyboard]= useState<String>(initialData?.PackProduct[0].DefaultClavier??"")
  const [defaultMouse,setDefaultMouse]= useState<String>(initialData?.PackProduct[0].DefaultMouse??"")
  const [defaultMousePad,setDefaultMousePad]= useState<String>(initialData?.PackProduct[0].DefaultMousePad??"")
  const [defaultMics,setDefaultMics]= useState<String>(initialData?.PackProduct[0].DefaultMic??"")
  const [defaultHeadset,setDefaultHeadset]= useState<String>(initialData?.PackProduct[0].DefaultHeadset??"")
  const [defaultCamera,setDefaultCamera]= useState<String>(initialData?.PackProduct[0].DefaultCamera??"")
  const [defaultScreen,setDefaultScreen]= useState<String>(initialData?.PackProduct[0].DefaultScreen??"")
  const [DefaultSpeaker,setDefaultSpeDefaultSpeaker]= useState<String>(initialData?.PackProduct[0].DefaultSpeaker??"")
  const [DefaultManette,setDefaultSpeDefaultManette]= useState<String>(initialData?.PackProduct[0].DefaultManette??"")
  const [DefaultChair,setDefaultSpeDefaultChair]= useState<String>(initialData?.PackProduct[0].DefaultChair??"")
 


  const [total,setTotal]=useState(initialData?.price??0)
const CalculeTotal=()=>{
  let pr=0
  if(defaultKeyboard.length>0){
    const prod=keyboardList.find((e)=>e.id==defaultKeyboard)
    if(prod)
    pr+=prod?.price
  }
  if(defaultMouse.length>0){
    const prod=MouseList.find((e)=>e.id==defaultMouse)
    if(prod)
    pr+=prod?.price
  }
  if(defaultMousePad.length>0){
    const prod=MousepadsList.find((e)=>e.id==defaultMousePad)
    if(prod)
    pr+=prod?.price
  }
  if(defaultMics.length>0){
    const prod=MicsList.find((e)=>e.id==defaultMics)
    if(prod)
    pr+=prod?.price
  }
  if(defaultHeadset.length>0){
    const prod=HeadsetsList.find((e)=>e.id==defaultHeadset)
    if(prod)
    pr+=prod?.price
  }
  if(defaultCamera.length>0){
    const prod=CamerasList.find((e)=>e.id==defaultCamera)
    if(prod)
    pr+=prod?.price
  }
  if(defaultScreen.length>0){
    const prod=screensList.find((e)=>e.id==defaultScreen)
    if(prod)
    pr+=prod?.price
  
  }
  if(DefaultSpeaker.length>0){
   
    const prod=HautparleursList.find((e)=>e.id==DefaultSpeaker)
    if(prod)
    pr+=prod?.price
  
  }
  
  if(DefaultManette.length>0){
   
    const prod=ManettesList.find((e)=>e.id==DefaultManette)
    if(prod)
    pr+=prod?.price
  
  
  }
  if(DefaultChair.length>0){
   
    const prod=ManettesList.find((e)=>e.id==DefaultChair)
    if(prod)
    pr+=prod?.price
  
  }
  
  const dis=form.getValues('discountOnPc')
  if(dis&&dis>0)
  pr=pr-dis
setTotal(pr)
}
useEffect(()=>{
  CalculeTotal()
  console.log(initialData)
},[
  form.watch('discountOnPc'),
  DefaultChair,
  DefaultManette,
  DefaultSpeaker,
  defaultCamera,
  defaultHeadset,
  defaultKeyboard,
  defaultMics,
  defaultMouse,
  defaultMousePad,
  defaultScreen
])
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) => field.onChange([...field.value, { url }])}
                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea disabled={loading} placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
            
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dicountPrice"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>DicountPrice</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Featured
                    </FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Archived
                    </FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

          </div>


          <FormField
            control={form.control}
            name="additionalDetails"
            
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>Infos</FormLabel>

                <FormControl>

                  <InputArray

                    onChange={(url: any[]) => field.onChange([...url])}
                    inputArrayp={field.value.map((i) => ({ name: i.name, value: i.value }))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full fixed bottom-0 left-0 z-40 bg-white dark:bg-black border-t-small py-3 px-3">
          <div>Total : {total.toString()} TND</div>
           <FormField
              control={form.control}
              name="discountOnPc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>discount On Pc</FormLabel>
                  <FormControl>
                    <Input type="number" onKeyDown={(ke)=>{if(ke.key=="Enter"){form.trigger()};console.log(ke.key)}} disabled={loading} placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                 <Button onClick={() => {
      
          }} disabled={loading} className="ml-auto my-3 w-full" type="submit">
          Product  {action}
          </Button>
          </div>
           
        
          <Pctemplate
          Cameras={Cameras}
          CamerasList={CamerasList}
          Chaisegamings={Chaisegamings}
          ChaisegamingsList={ChaisegamingsList}
          DefaultCamera={defaultCamera}
          DefaultChair={DefaultChair}
          DefaultClavier={defaultKeyboard}
          DefaultHeadset={defaultHeadset}
          DefaultManette={DefaultManette}
          DefaultMic={defaultMics}
          DefaultMouse={defaultMouse}
          DefaultMousePad={defaultMousePad}
          DefaultScreen={defaultScreen}
          DefaultSpeaker={DefaultSpeaker}
          Hautparleurs={Hautparleurs}
          HautparleursList={HautparleursList}
          Headsets={Headsets}
          HeadsetsList={HeadsetsList}
          Manettes={Manettes}
          ManettesList={ManettesList}
          Mics={Mics}
          MicsList={MicsList}
          MouseList={MouseList}
          Mousepads={Mousepads}
          MousepadsList={MousepadsList}
          Mouses={Mouses}
          initialData={initialData}
          keyboardList={keyboardList}
          keyboards={keyboards}
          screens={screens}
          screensList={screensList}
          setCamerasList={setCamerasList}
          setChaisegamingsList={setChaisegamingsList}
          setDefaultCamera={setDefaultCamera}
          setDefaultHeadset={setDefaultHeadset}
          setDefaultKeyboard={setDefaultKeyboard}
          setDefaultMics={setDefaultMics}
          setDefaultMouse={setDefaultMouse}
          setDefaultMousePad={setDefaultMousePad}
          setDefaultScreen={setDefaultScreen}
          setDefaultSpeDefaultChair={setDefaultSpeDefaultChair}
          setDefaultSpeDefaultManette={setDefaultSpeDefaultManette}
          setDefaultSpeDefaultSpeaker={setDefaultSpeDefaultSpeaker}
          setHautparleursList={setHautparleursList}
          setHeadsetsList={setHeadsetsList}
          setManettesList={setManettesList}
          setMicsList={setMicsList}
          setMouseList={setMouseList}
          setMousepadsList={setMousepadsList}
          setkeyboardList={setkeyboardList}
          setscreensList={setscreensList}
          />
     
        </form>
      </Form>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};
