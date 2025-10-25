import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DataStructureLayout from './DataStructureLayout';
import { useHistoryState } from '../../hooks/useHistoryState';
import { UndoIcon } from '../icons/UndoIcon';
import { RedoIcon } from '../icons/RedoIcon';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const buildSegmentTree = (arr: number[]): number[] => {
  const n = arr.length;
  const tree = new Array(2 * n).fill(0);
  for (let i = 0; i < n; i++) tree[n + i] = arr[i];
  for (let i = n - 1; i > 0; i--) tree[i] = tree[2 * i] + tree[2 * i + 1];
  return tree;
};

const Node: React.FC<{ value: number, highlight: boolean }> = ({ value, highlight }) => (
  <div className={`w-12 h-12 rounded-md flex items-center justify-center font-bold border-2 transition-all duration-300 ${highlight ? 'bg-cyan-500 border-cyan-300 scale-110' : 'bg-gray-700 border-gray-600'}`}>{value}</div>
);

const SegmentTreeVisualizer: React.FC = () => {
  const { state: sourceArray, set: setSourceArray, undo, redo, canUndo, canRedo } = useHistoryState<number[]>([1, 3, 5, 7, 9, 11]);
  const [tree, setTree] = useState<number[]>(() => buildSegmentTree(sourceArray));
  const [updateIndex, setUpdateIndex] = useState('');
  const [updateValue, setUpdateValue] = useState('');
  const [queryL, setQueryL] = useState('');
  const [queryR, setQueryR] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState<Set<number>>(new Set());
  const [queryResult, setQueryResult] = useState<number | null>(null);

  const handleBuild = () => {
    const newTree = buildSegmentTree(sourceArray);
    setTree(newTree);
  };
  
  React.useEffect(handleBuild, [sourceArray]);

  const handleUpdate = async () => {
    const index = parseInt(updateIndex, 10);
    const value = parseInt(updateValue, 10);
    if (isNaN(index) || isNaN(value) || index < 0 || index >= sourceArray.length) return;
    
    setIsAnimating(true);
    const newArray = [...sourceArray];
    newArray[index] = value;
    setSourceArray(newArray); // This will trigger re-build via useEffect

    const newTree = buildSegmentTree(newArray);
    const path = new Set<number>();
    let i = sourceArray.length + index;
    path.add(i);
    for (; i > 1; i = Math.floor(i / 2)) {
      path.add(Math.floor(i/2));
    }
    setHighlightedIndices(path);
    await sleep(1500);
    setHighlightedIndices(new Set());
    
    setIsAnimating(false);
  };
  
  const handleQuery = async () => {
    let l = parseInt(queryL, 10);
    let r = parseInt(queryR, 10);
    if (isNaN(l) || isNaN(r) || l < 0 || r >= sourceArray.length || l > r) return;
    
    setIsAnimating(true);
    setQueryResult(null);
    let res = 0;
    const path = new Set<number>();
    l += sourceArray.length;
    r += sourceArray.length;
    for (; l <= r; l = Math.floor((l + 1) / 2), r = Math.floor((r - 1) / 2)) {
      if (l % 2 === 1) { path.add(l); res += tree[l]; }
      if (r % 2 === 0) { path.add(r); res += tree[r]; }
    }
    setHighlightedIndices(path);
    setQueryResult(res);
    await sleep(2000);
    setHighlightedIndices(new Set());
    setIsAnimating(false);
  };

  const renderTree = (index: number = 1, level: number = 0) => {
    if (index >= tree.length) return null;
    const leftChild = renderTree(2 * index, level + 1);
    const rightChild = renderTree(2 * index + 1, level + 1);
    return (
      <div key={index} className="flex flex-col items-center p-4">
        <Node value={tree[index]} highlight={highlightedIndices.has(index)} />
        {(leftChild || rightChild) && (
          <div className="flex absolute top-full mt-4 justify-center">
            {leftChild && <div className="relative px-2">{leftChild}</div>}
            {rightChild && <div className="relative px-2">{rightChild}</div>}
          </div>
        )}
      </div>
    );
  };

  const controls = (
    <div className="space-y-4">
      <div className="flex justify-end gap-2"><Button onClick={undo} disabled={!canUndo} variant="icon"><UndoIcon className="w-5 h-5" /></Button><Button onClick={redo} disabled={!canRedo} variant="icon"><RedoIcon className="w-5 h-5" /></Button></div>
      <div className="p-2 border border-gray-700 rounded-md space-y-2">
        <div className="flex gap-2"><Input value={updateIndex} onChange={e => setUpdateIndex(e.target.value)} placeholder="Index" /><Input value={updateValue} onChange={e => setUpdateValue(e.target.value)} placeholder="Value" /></div>
        <Button onClick={handleUpdate} className="w-full" disabled={isAnimating}>Update</Button>
      </div>
       <div className="p-2 border border-gray-700 rounded-md space-y-2">
        <div className="flex gap-2"><Input value={queryL} onChange={e => setQueryL(e.target.value)} placeholder="Left" /><Input value={queryR} onChange={e => setQueryR(e.target.value)} placeholder="Right" /></div>
        <Button onClick={handleQuery} variant="secondary" className="w-full" disabled={isAnimating}>Query Sum</Button>
        {queryResult !== null && <p className="text-lime-400 text-center">Sum: {queryResult}</p>}
      </div>
    </div>
  );

  const visualization = (
    <div className="w-full h-full flex flex-col items-center justify-between p-4">
       <div className="flex-grow flex items-center">{renderTree()}</div>
       <div className="flex gap-1 p-2 bg-gray-800 rounded-lg">{sourceArray.map((val, i) => <div key={i} className="w-12 h-12 flex flex-col items-center justify-center"><Node value={val} highlight={false} /><span className="text-xs text-gray-400 mt-1">[{i}]</span></div>)}</div>
    </div>
  );

  return <DataStructureLayout dsId="segment_tree" dsName="Segment Tree" controls={controls} visualization={visualization} />;
};

export default SegmentTreeVisualizer;