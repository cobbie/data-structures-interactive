import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DataStructureLayout from './DataStructureLayout';
import { useHistoryState } from '../../hooks/useHistoryState';
import { UndoIcon } from '../icons/UndoIcon';
import { RedoIcon } from '../icons/RedoIcon';

const ArrayVisualizer: React.FC = () => {
  const { state: array, set: setArray, undo, redo, canUndo, canRedo } = useHistoryState<number[]>([10, 20, 30, 40, 50]);
  const [indexInput, setIndexInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const handleUpdate = () => {
    const index = parseInt(indexInput, 10);
    const value = parseInt(valueInput, 10);

    if (!isNaN(index) && !isNaN(value) && index >= 0 && index < array.length) {
      const newArray = [...array];
      newArray[index] = value;
      setArray(newArray);
      setIndexInput('');
      setValueInput('');
      animateIndex(index);
    }
  };

  const handleAdd = () => {
    const value = parseInt(valueInput, 10);
    if (!isNaN(value)) {
      setArray([...array, value]);
      setValueInput('');
      animateIndex(array.length);
    }
  };

  const animateIndex = (index: number) => {
    setHighlightedIndex(index);
    setTimeout(() => {
      setHighlightedIndex(null);
    }, 1000);
  };

  const controls = (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button onClick={undo} disabled={!canUndo} variant="icon" aria-label="Undo">
          <UndoIcon className="w-5 h-5" />
        </Button>
        <Button onClick={redo} disabled={!canRedo} variant="icon" aria-label="Redo">
          <RedoIcon className="w-5 h-5" />
        </Button>
      </div>
      <div className="p-2 border border-gray-700 rounded-md space-y-2">
        <Input
          type="number"
          value={indexInput}
          onChange={(e) => setIndexInput(e.target.value)}
          placeholder="Index"
          className="w-full"
        />
        <Input
          type="number"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          placeholder="Value"
          className="w-full"
        />
        <Button onClick={handleUpdate} className="w-full" disabled={!indexInput || !valueInput}>Update at Index</Button>
      </div>
       <div className="p-2 border border-gray-700 rounded-md space-y-2">
        <Input
          type="number"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          placeholder="Value to add"
          className="w-full"
        />
        <Button onClick={handleAdd} className="w-full" disabled={!valueInput}>Add to End</Button>
      </div>
    </div>
  );

  const visualization = (
     <div className="w-full h-full flex items-center justify-center overflow-x-auto p-4">
        <div className="flex flex-row gap-0.5 p-2 bg-gray-800 rounded-lg border-2 border-gray-600">
            {array.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div className={`h-16 w-16 rounded-md flex items-center justify-center text-lg font-bold text-white transition-all duration-300 border-2 ${highlightedIndex === index ? 'bg-cyan-500 border-cyan-300 scale-110' : 'bg-gray-700 border-transparent'}`}>
                        {item}
                    </div>
                    <div className="text-xs mt-1 text-gray-400 font-mono">
                        [{index}]
                    </div>
                </div>
            ))}
             {array.length === 0 && <div className="h-16 w-48 text-gray-500 flex items-center justify-center">Array is empty</div>}
        </div>
    </div>
  );

  return (
    <DataStructureLayout
      dsId="array"
      dsName="Array"
      controls={controls}
      visualization={visualization}
    />
  );
};

export default ArrayVisualizer;
