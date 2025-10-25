import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DataStructureLayout from './DataStructureLayout';
import { useHistoryState } from '../../hooks/useHistoryState';
import { UndoIcon } from '../icons/UndoIcon';
import { RedoIcon } from '../icons/RedoIcon';

interface Node {
  id: number;
  value: number;
}

let nextId = 4;

const LinkedListVisualizer: React.FC = () => {
  const { state: list, set: setList, undo, redo, canUndo, canRedo } = useHistoryState<Node[]>([
    { id: 1, value: 10 },
    { id: 2, value: 99 },
    { id: 3, value: 37 },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() === '') return;
    const value = parseInt(inputValue, 10);
    if (!isNaN(value)) {
      setList([...list, { id: nextId++, value }]);
      setInputValue('');
    }
  };

  const handleRemove = (idToRemove: number) => {
    setList(list.filter((node) => node.id !== idToRemove));
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
      <div className="flex gap-2">
        <Input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a value"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 min-w-0"
        />
        <Button onClick={handleAdd}>Add to Tail</Button>
      </div>
      <p className="text-sm text-gray-400">Click on a node to remove it.</p>
    </div>
  );

  const visualization = (
    <div className="w-full h-full flex items-center justify-center overflow-x-auto p-4">
      <div className="flex items-center gap-0">
        {list.map((node, index) => (
          <div key={node.id} className="flex items-center">
            <button 
              onClick={() => handleRemove(node.id)}
              className="group relative w-20 h-20 bg-gray-700 rounded-md border-2 border-gray-600 flex items-center justify-center text-lg font-bold text-white transition-all duration-200 hover:bg-red-500 hover:border-red-400"
            >
              {node.value}
              <span className="absolute -bottom-6 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Remove</span>
            </button>
            {index < list.length - 1 && (
              <div className="w-12 h-1 bg-cyan-500 mx-1"></div>
            )}
          </div>
        ))}
        {list.length > 0 && (
          <div className="ml-3 text-2xl font-mono text-gray-500">null</div>
        )}
        {list.length === 0 && <div className="text-gray-500">List is empty</div>}
      </div>
    </div>
  );

  return (
    <DataStructureLayout
      dsId="linked_list"
      dsName="Linked List"
      controls={controls}
      visualization={visualization}
    />
  );
};

export default LinkedListVisualizer;
