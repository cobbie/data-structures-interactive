import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DataStructureLayout from './DataStructureLayout';
import { useHistoryState } from '../../hooks/useHistoryState';
import { UndoIcon } from '../icons/UndoIcon';
import { RedoIcon } from '../icons/RedoIcon';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const NodeComponent: React.FC<{ value: number, index: number, totalNodes: number, highlight: boolean, level: number, pos: number }> = ({ value, highlight }) => {
  const nodeClasses = `w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300
    ${highlight ? 'bg-cyan-500 border-cyan-300 text-white scale-110' : 'bg-gray-700 border-gray-600 text-white'}
  `;
  return <div className={nodeClasses}>{value}</div>;
};

const HeapVisualizer: React.FC = () => {
  const { state: heap, set: setHeap, undo, redo, canUndo, canRedo } = useHistoryState<number[]>([4, 10, 8, 20, 15, 12, 9]);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);

  const animateAndSet = async (newHeap: number[], indices: number[]) => {
    setHighlightedIndices(indices);
    await sleep(400);
    setHeap(newHeap);
    setHighlightedIndices([]);
  };

  const handleInsert = async () => {
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) return;
    setIsAnimating(true);
    let newHeap = [...heap, value];
    let i = newHeap.length - 1;
    while (i > 0) {
      let parent = Math.floor((i - 1) / 2);
      if (newHeap[i] < newHeap[parent]) {
        [newHeap[i], newHeap[parent]] = [newHeap[parent], newHeap[i]];
        await animateAndSet([...newHeap], [i, parent]);
        i = parent;
      } else {
        break;
      }
    }
    setHeap(newHeap);
    setInputValue('');
    setIsAnimating(false);
  };
  
  const handleExtractMin = async () => {
    if (heap.length === 0) return;
    setIsAnimating(true);
    let newHeap = [...heap];
    [newHeap[0], newHeap[newHeap.length - 1]] = [newHeap[newHeap.length - 1], newHeap[0]];
    newHeap.pop();
    setHeap(newHeap);
    await sleep(400);

    let i = 0;
    while (true) {
      let left = 2 * i + 1;
      let right = 2 * i + 2;
      let smallest = i;
      if (left < newHeap.length && newHeap[left] < newHeap[smallest]) smallest = left;
      if (right < newHeap.length && newHeap[right] < newHeap[smallest]) smallest = right;
      if (smallest !== i) {
        [newHeap[i], newHeap[smallest]] = [newHeap[smallest], newHeap[i]];
        await animateAndSet([...newHeap], [i, smallest]);
        i = smallest;
      } else {
        break;
      }
    }
    setHeap(newHeap);
    setIsAnimating(false);
  };

  const renderHeap = (index: number = 0) => {
    if (index >= heap.length) return null;
    const leftChild = renderHeap(2 * index + 1);
    const rightChild = renderHeap(2 * index + 2);
    return (
      <div key={index} className="flex flex-col items-center relative p-4">
        <NodeComponent value={heap[index]} index={index} totalNodes={heap.length} highlight={highlightedIndices.includes(index)} level={0} pos={0}/>
        {(leftChild || rightChild) && (
          <div className="flex absolute top-full mt-4 justify-center">
             {leftChild && <div className="relative px-2"><div className="absolute left-1/2 top-0 h-4 w-px bg-gray-500 transform -rotate-[25deg] origin-top"></div>{leftChild}</div>}
             {rightChild && <div className="relative px-2"><div className="absolute left-1/2 top-0 h-4 w-px bg-gray-500 transform rotate-[25deg] origin-top"></div>{rightChild}</div>}
          </div>
        )}
      </div>
    );
  };

  const controls = (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button onClick={undo} disabled={!canUndo || isAnimating} variant="icon"><UndoIcon className="w-5 h-5" /></Button>
        <Button onClick={redo} disabled={!canRedo || isAnimating} variant="icon"><RedoIcon className="w-5 h-5" /></Button>
      </div>
      <div className="flex gap-2">
        <Input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Value" disabled={isAnimating} className="flex-1 min-w-0" />
        <Button onClick={handleInsert} disabled={isAnimating}>Insert</Button>
      </div>
      <Button onClick={handleExtractMin} variant="secondary" disabled={isAnimating || heap.length === 0} className="w-full">Extract Min</Button>
    </div>
  );

  const visualization = (
    <div className="w-full h-full flex items-start justify-center overflow-auto p-8 pt-16">
       {heap.length > 0 ? renderHeap() : <div className="text-gray-500">Heap is empty</div>}
    </div>
  );

  return (
    <DataStructureLayout dsId="heap" dsName="Heap (Min-Heap)" controls={controls} visualization={visualization} />
  );
};

export default HeapVisualizer;