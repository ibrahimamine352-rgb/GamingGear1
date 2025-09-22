import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';

type Field = {
  name: string;
  value: string;
};


const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array().min(1),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  dicountPrice: z.coerce.number().optional(),
  description:z.string().min(1),
  stock: z.coerce.number().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  additionalDetails : z.object({ name: z.string(),value:z.string() }).array()
});


type ProductFormValues = z.infer<typeof formSchema>;

interface PopUpProps {
  disabled?: boolean;
  onChange: (value: Field) => void;
  value: Field[];
  onRemove: (value: Field) => void;
       
}

const Addtioanlinfos: React.FC<PopUpProps> = ({  value ,disabled,onChange,onRemove}) => {
  const [data, setData] = useState<Field[]>([]);

  const addField = () => {
    onChange({ name: '', value: '' });
    data.push();
   console.log(value)
  };

  return (
    <div className="w-full">
      <div>
      
      </div>
      <Button className="w-full" type="button" onClick={addField}>
        + New detail
      </Button>
    </div>
  );
};

export default Addtioanlinfos;
