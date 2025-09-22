import Editorr from '@/components/custom/Editor';
import Editor from '@/components/custom/Editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash } from 'lucide-react';
import React, { StrictMode, useState } from 'react';
import ReactDOM from 'react-dom';

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
  ReactDOM.render(
    <StrictMode>
      <Editor placeholder={'Write something...'} />
    </StrictMode>,
    document.getElementById('root')
  );

}

export default InputArray;
