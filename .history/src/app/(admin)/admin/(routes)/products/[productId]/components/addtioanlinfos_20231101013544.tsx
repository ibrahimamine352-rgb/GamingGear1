import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import React, { useState } from 'react';

function InputArray() {
  const [inputArray, setInputArray] = useState([{ name: '', value: '' }]);

  const addInput = () => {
    setInputArray([...inputArray, { name: '', value: '' }]);
  };

  const handleInputChange = (index: number, field: 'name' | 'value', newValue: string) => {
    const updatedInputs = [...inputArray];
    updatedInputs[index][field] = newValue;
    setInputArray(updatedInputs);
  };

  const removeInput = (index: number) => {
    const updatedInputs = [...inputArray];
    updatedInputs.splice(index, 1);
    setInputArray(updatedInputs);
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
          />
          <input
            type="text"
            placeholder="Value"
            value={input.value}
            onChange={(e) => handleInputChange(index, 'value', e.target.value)}
            className="w-1/2 p-2 border rounded"
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
       type='button'
        onClick={addInput}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" 
      >
        Add Inputs
      </Button>
    </div>
  );
}

export default InputArray;
