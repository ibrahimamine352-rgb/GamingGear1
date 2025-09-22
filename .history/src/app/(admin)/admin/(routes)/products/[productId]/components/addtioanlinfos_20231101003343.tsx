import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@/components/ui/button'
import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';

type Field = {
  name: string; // Use 'string' for string values
  value: string; // Use 'string' for string values
};

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  processorModelId: z.string().min(1),
  supportduprocesseurId: z.string().min(1),
  
});
type ProductFormValues = z.infer<typeof formSchema>

interface PopUpProps {
     form :  UseFormReturn<ProductFormValues>;
     loading:boolean
     
}
const Addtioanlinfos : React.FC<PopUpProps> = ({

  form,
  loading,
 
}) => {
  const [data,setData]=useState<Field[]>([])
  return ( 
    <div className='w-full'>
      <Button className='w-full' type='button' >+ New detail</Button>


    </div>
  )
}

Addtioanlinfos.propTypes = {}

export default Addtioanlinfos