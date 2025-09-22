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
  
  const removeInput = (index:number) => {
    const updatedInputs = [...inputArray];
    updatedInputs.splice(index, 1);
    setInputArray(updatedInputs);
  };

  return (
    <div>

      {inputArray.map((input, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Name"
            value={input.name}
            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
          />
          <input
            type="text"
            placeholder="Value"
            value={input.value}
            onChange={(e) => handleInputChange(index, 'value', e.target.value)}
          />
          <button onClick={() => removeInput(index)}>Remove</button>
        </div>
        
      ))}
            <button onClick={addInput}>Add Inputs</button>
    </div>
  );
}

export default InputArray;
