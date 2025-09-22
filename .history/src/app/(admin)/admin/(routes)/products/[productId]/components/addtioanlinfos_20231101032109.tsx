// InputArray.js
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import React, { useState } from 'react';
type InputArrayProps = {
  onInputArrayChange: (inputArray: Array<{ name: string; value: string }>) => void;
};

function InputArray({ onInputArrayChange }: InputArrayProps) {
  const [inputArray, setInputArray] = useState<any[]>([]);

  const addInput = () => {
    setInputArray([...inputArray, { name: '', value: '' }]);
  };

  const handleInputChange = (index: number, field: 'name' | 'value', newValue: string) => {
    const updatedInputs = [...inputArray];
    updatedInputs[index][field] = newValue;
    setInputArray(updatedInputs);
    exportInputArray()
  };

  const removeInput = (index: number) => {
    const updatedInputs = [...inputArray];
    updatedInputs.splice(index, 1);
    setInputArray(updatedInputs);
    exportInputArray()
  };

  // Pass the inputArray to the parent component
  const exportInputArray = () => {
    onInputArrayChange(inputArray);
  };

  return (
    <div className="space-y-4">
      {inputArray.map((input, index) => (
        <div key={index} className="flex space-x-4 items-center">
          <input
            type="text"
            placeholder="Name"
            value={input.name}
            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
            className="w-1/2 p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Value"
            value={input.value}
            onChange={(e) => handleInputChange(index, 'value', e.target.value)}
            className="w-1/2 p-2 border rounded"
            required
          />
          <Button
            type='button'
            onClick={() => removeInput(index)}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            <Trash/>
          </Button>
        </div>
      ))}
      <Button
      variant={'secondary'}
        type='button'
        onClick={addInput}
        className=" py-2 px-4 rounded hover-bg-blue-600"
      >
        Add Inputs
      </Button>
      
     
    </div>
  );
}

export default InputArray;
