import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';

type Field = {
  name: string;
  value: string;
};

const formSchema = z.object({
  // ... other fields
  additionalDetails: z.array(
    z.object({ name: z.string(), value: z.string() })
  ),
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
