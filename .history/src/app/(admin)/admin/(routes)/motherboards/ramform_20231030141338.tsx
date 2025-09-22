import React from 'react'
import { z } from 'zod';

const ramformSchema = z.object({
    name: z.string().min(1),
    type:z.string().min(1),
    number: z.coerce.number().min(1),
  });
  type RamProductFormValues = z.infer<typeof ramformSchema>

export const ramform = () => {
  return (
    <div>ramform</div>
  )
}
