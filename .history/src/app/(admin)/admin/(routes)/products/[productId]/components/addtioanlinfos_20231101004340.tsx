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
  form: UseFormReturn<ProductFormValues>;
  loading: boolean;
}

const Addtioanlinfos: React.FC<PopUpProps> = ({ form, loading }) => {
  const [data, setData] = useState<Field[]>([]);

  const addField = () => {
    data.push({ name: '', value: '' });
    form.setValue('additionalDetails', data);
  };

  return (
    <div className="w-full">
      <div>
        {form.getValues('additionalDetails').map((field: Field, index: number) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              placeholder="Field Name"
              {...form.register(`additionalDetails[${index}].name` as any)}
            />
            <input
              type="text"
              placeholder="Field Value"
              {...form.register(`additionalDetails[${index}].value` as any)}
            />
          </div>
        ))}
      </div>
      <Button className="w-full" type="button" onClick={addField}>
        + New detail
      </Button>
    </div>
  );
};

export default Addtioanlinfos;
