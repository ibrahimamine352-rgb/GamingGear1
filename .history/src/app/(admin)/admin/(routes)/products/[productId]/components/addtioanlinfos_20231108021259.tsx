import Editor from '@/components/custom/Editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash } from 'lucide-react';
import React, { useState } from 'react';

type InputArrayProps = {
  inputArrayp: any [];
  onChange: (value: Array<{ name: string; value: string }>) => void;
 
};

function InputArray({  inputArrayp ,onChange}: InputArrayProps) {
  const [inputArray, setInputArray] = useState<any[]>(inputArrayp);

  const addInput = () => {
    setInputArray([...inputArray, { name: '', value: '' }]);
    exportInputArray();
  };

  const handleInputChange = (index: number, field: 'name' | 'value', newValue: string) => {
    const updatedInputs = [...inputArray];
    updatedInputs[index][field] = newValue;
    setInputArray(updatedInputs);
    onChange(updatedInputs)
    exportInputArray();
  };

  const removeInput = (index: number) => {
    const updatedInputs = [...inputArray];
    updatedInputs.splice(index, 1);
    setInputArray(updatedInputs);
    onChange(updatedInputs)
    exportInputArray();
  };

  // Pass the inputArray to the parent component
  const exportInputArray = () => {
   
  };

  return (
    <>
    <Editor/>
    <div className="space-y-4">
      
      {inputArray.map((input, index) => (
        <div key={index} className="flex space-x-4 items-center">
          <Input
            type="text"
            placeholder="Name"
            value={input.name}
            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
            className="w-1/2 p-2 border rounded"
            required
          />
          <Input
            type="text"
            placeholder="Value"
            value={input.value}
            onChange={(e) => handleInputChange(index, 'value', e.target.value)}
            className="w-1/2 p-2 border rounded"
            required
          />
          <Button
            type="button"
            onClick={() =>{ removeInput(index);exportInputArray}}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            <Trash  onClick={() =>{ removeInput(index)}}/>
          </Button>
        </div>
      ))}
      <Button
        variant={'secondary'}
        type="button"
        onClick={addInput}
        className="py-2 px-4 rounded hover-bg-blue-600"
      >
        Add Inputs
      </Button>
    </div>
    </>
    
  );
}

export default InputArray;
