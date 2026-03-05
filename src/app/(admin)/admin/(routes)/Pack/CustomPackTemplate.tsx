"use client"

import * as z from "zod"
import axios from "axios"
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Category, Image, Product, Manufacturer, Pack, AccessoryPack, Field } from "@prisma/client"
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
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array().min(1),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
    comingSoon: z.boolean().default(false).optional(),
    outOfStock: z.boolean().default(false).optional(),
    manufacturerId: z.string().optional(),
    dicountPrice: z.coerce.number().optional(),
    stock: z.coerce.number().min(0),
    description: z.string().min(1),
    packType: z.string().min(1).default("Custom Pack"),
    discountOnPack: z.coerce.number().optional(),

    // Pack Components Lists (IDs)
    Clavier: z.object({ id: z.string() }).array().optional(),
    Mouse: z.object({ id: z.string() }).array().optional(),
    MousePad: z.object({ id: z.string() }).array().optional(),
    Mic: z.object({ id: z.string() }).array().optional(),
    Headset: z.object({ id: z.string() }).array().optional(),
    Camera: z.object({ id: z.string() }).array().optional(),
    Screen: z.object({ id: z.string() }).array().optional(),
    Speaker: z.object({ id: z.string() }).array().optional(),
    Manette: z.object({ id: z.string() }).array().optional(),
    Chair: z.object({ id: z.string() }).array().optional(),

    // Defaults (Single ID)
    DefaultClavier: z.string().optional(),
    DefaultMouse: z.string().optional(),
    DefaultMousePad: z.string().optional(),
    DefaultMic: z.string().optional(),
    DefaultHeadset: z.string().optional(),
    DefaultCamera: z.string().optional(),
    DefaultScreen: z.string().optional(),
    DefaultSpeaker: z.string().optional(),
    DefaultManette: z.string().optional(),
    DefaultChair: z.string().optional(),

    additionalDetails: z.object({ name: z.string(), value: z.string() }).array().optional()
});

type ProductFormValues = z.infer<typeof formSchema>

interface CustomPackTemplateProps {
    initialData: Product & {
        images: Image[],
        PackProduct: (AccessoryPack & {
            Clavier: Product[],
            Mouse: Product[],
            MousePad: Product[],
            Mic: Product[],
            Headset: Product[],
            Camera: Product[],
            Screen: Product[],
            Speaker: Product[],
            Manette: Product[],
            Chair: Product[]
        })[],
        additionalDetails: Field[]
    } | null;
    categories: Category[];
    manufacturers: Manufacturer[];

    // Available Components
    keyboards: Product[];
    mice: Product[];
    mousePads: Product[];
    mics: Product[];
    headsets: Product[];
    cameras: Product[];
    screens: Product[];
    speakers: Product[];
    controllers: Product[]; // Manette
    chairs: Product[];
};

export const CustomPackTemplate: React.FC<CustomPackTemplateProps> = ({
    initialData,
    categories,
    manufacturers,
    keyboards,
    mice,
    mousePads,
    mics,
    headsets,
    cameras,
    screens,
    speakers,
    controllers,
    chairs
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit Pack' : 'Create Pack';
    const description = initialData ? 'Edit a pack.' : 'Add a new pack';
    const toastMessage = initialData ? 'Pack updated.' : 'Pack created.';
    const action = initialData ? 'Save changes' : 'Create';

    const packData = initialData?.PackProduct?.[0];

    const defaultValues = initialData ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)),
        dicountPrice: parseFloat(String(initialData?.dicountPrice)),
        stock: parseFloat(String(initialData?.stock)),

        // Wait, Product has NO manufacturerId in the schema shown earlier. 
        // `model Product` has `manufacturerId` (No). It has relations.
        // Actually, `ProductForm` used `manufacturerId`. Let's assume it handles it via relation or loose typings. 
        // `AccessoryPack` has `manufacturerId`.

        packType: "Custom Pack",
        discountOnPack: packData ? parseFloat(String(packData.discountOnPack)) : 0,

        Clavier: packData?.Clavier.map(i => ({ id: i.id })) || [],
        Mouse: packData?.Mouse.map(i => ({ id: i.id })) || [],
        MousePad: packData?.MousePad.map(i => ({ id: i.id })) || [],
        Mic: packData?.Mic.map(i => ({ id: i.id })) || [],
        Headset: packData?.Headset.map(i => ({ id: i.id })) || [],
        Camera: packData?.Camera.map(i => ({ id: i.id })) || [],
        Screen: packData?.Screen.map(i => ({ id: i.id })) || [],
        Speaker: packData?.Speaker.map(i => ({ id: i.id })) || [],
        Manette: packData?.Manette.map(i => ({ id: i.id })) || [],
        Chair: packData?.Chair.map(i => ({ id: i.id })) || [],

        DefaultClavier: packData?.DefaultClavier || '',
        DefaultMouse: packData?.DefaultMouse || '',
        DefaultMousePad: packData?.DefaultMousePad || '',
        DefaultMic: packData?.DefaultMic || '',
        DefaultHeadset: packData?.DefaultHeadset || '',
        DefaultCamera: packData?.DefaultCamera || '',
        DefaultScreen: packData?.DefaultScreen || '',
        DefaultSpeaker: packData?.DefaultSpeaker || '',
        DefaultManette: packData?.DefaultManette || '',
        DefaultChair: packData?.DefaultChair || '',

        additionalDetails: (initialData?.additionalDetails || []).map((item) => ({
            name: item.name,
            value: item.value || ''
        })),
    } : {
        name: '',
        images: [],
        price: 0,
        dicountPrice: 0,
        stock: 0,
        description: '',
        categoryId: '',
        isFeatured: false,
        isArchived: false,
        comingSoon: false,
        outOfStock: false,
        packType: "Custom Pack",
        discountOnPack: 0,
        Clavier: [], Mouse: [], MousePad: [], Mic: [], Headset: [], Camera: [], Screen: [], Speaker: [], Manette: [], Chair: [],
        additionalDetails: []
    }

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                // Validation for update: need packid and prodid
                const payload = {
                    ...data,
                    prodid: initialData.id,
                    packid: packData?.id
                }
                await axios.patch(`/api/Pack/${params.productId}`, payload);
            } else {
                await axios.post(`/api/Pack`, data);
            }
            router.refresh();
            router.push(`/admin/Pack`);
            toast.success(toastMessage);
        } catch (error: any) {
            toast.error('Something went wrong: ' + error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/Pack/${params.productId}`);
            router.refresh();
            router.push(`/admin/Pack`);
            toast.success('Pack deleted.');
        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    // Helper component for Accessory Selection
    const AccessorySection = ({
        label,
        listName,
        items,
        defaultName
    }: {
        label: string,
        listName: any,
        items: Product[],
        defaultName: any
    }) => {
        const selectedItems = form.watch(listName) || [];
        const selectedIds = new Set(selectedItems.map((i: any) => i.id));

        return (
            <Card className="mb-4">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">{label}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name={listName}
                            render={() => (
                                <FormItem>
                                    <FormLabel className="mb-2 block">Select Available {label}s</FormLabel>
                                    <div className="h-[200px] overflow-y-auto border rounded-md p-2">
                                        {items.map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={form.control}
                                                name={listName}
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0 py-2"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={selectedIds.has(item.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field.value, { id: item.id }])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value: any) => value.id !== item.id
                                                                                )
                                                                            )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <div className="space-y-1 leading-none">
                                                                <FormLabel className="font-normal text-xs cursor-pointer">
                                                                    {item.name}
                                                                </FormLabel>
                                                            </div>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={defaultName}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Default {label}</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={`Select default ${label}`} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="">None</SelectItem>
                                            {items.filter(i => selectedIds.has(i.id)).map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Must be selected in the list first.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>
        );
    };

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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mt-5">

                    {/* Basic Info */}
                    <div className="md:grid md:grid-cols-3 gap-8">
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

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pack Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Pack Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="0.00" {...field} />
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
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="discountOnPack"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount On Pack (Global)</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea disabled={loading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Separator />
                    <Heading title="Pack Composition" description="Select available components and defaults for this pack." />

                    <div className="space-y-4">
                        <AccessorySection label="Keyboard" listName="Clavier" items={keyboards} defaultName="DefaultClavier" />
                        <AccessorySection label="Mouse" listName="Mouse" items={mice} defaultName="DefaultMouse" />
                        <AccessorySection label="MousePad" listName="MousePad" items={mousePads} defaultName="DefaultMousePad" />
                        <AccessorySection label="Headset" listName="Headset" items={headsets} defaultName="DefaultHeadset" />
                        <AccessorySection label="Microphone" listName="Mic" items={mics} defaultName="DefaultMic" />
                        <AccessorySection label="Camera" listName="Camera" items={cameras} defaultName="DefaultCamera" />
                        <AccessorySection label="Screen" listName="Screen" items={screens} defaultName="DefaultScreen" />
                        <AccessorySection label="Speaker" listName="Speaker" items={speakers} defaultName="DefaultSpeaker" />
                        <AccessorySection label="Controller" listName="Manette" items={controllers} defaultName="DefaultManette" />
                        <AccessorySection label="Gaming Chair" listName="Chair" items={chairs} defaultName="DefaultChair" />
                    </div>

                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
};
