import React, { useState, useMemo } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DataStructureLayout from './DataStructureLayout';
import { useHistoryState } from '../../hooks/useHistoryState';
import { UndoIcon } from '../icons/UndoIcon';
import { RedoIcon } from '../icons/RedoIcon';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
interface DsuState {
  parent: number[];
}

const DsuVisualizer: React.FC = () => {
  const { state: dsu, set: setDsu, undo, redo, canUndo, canRedo } = useHistoryState<DsuState>({ parent: Array.from({ length: 10 }, (_, i) => i) });
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedPath, setHighlightedPath] = useState<number[]>([]);
  const [unionA, setUnionA] = useState('');
  const [unionB, setUnionB] = useState('');

  const find = async (i: number): Promise<number> => {
    const path: number[] = [];
    let current = i;
    while (dsu.parent[current] !== current) {
      path.push(current);
      current = dsu.parent[current];
    }
    path.push(current);

    setHighlightedPath(path);
    await sleep(path.length * 300);

    // Path compression
    const newParent = [...dsu.parent];
    for (const node of path) {
      newParent[node] = current;
    }
    setDsu({ parent: newParent });
    
    await sleep(500);
    setHighlightedPath([]);
    return current;
  };

  const union = async () => {
    const a = parseInt(unionA, 10);
    const b = parseInt(unionB, 10);
    if (isNaN(a) || isNaN(b)) return;
    
    setIsAnimating(true);
    const rootA = await find(a);
    const rootB = await find(b);
    if (rootA !== rootB) {
      const newParent = [...dsu.parent];
      newParent[rootB] = rootA;
      setDsu({ parent: newParent });
    }
    setUnionA('');
    setUnionB('');
    setIsAnimating(false);
  };
  
  const forest = useMemo(() => {
    const roots: { [key: number]: number[] } = {};
    dsu.parent.forEach((p, i) => {
      let root = i;
      while (dsu.parent[root] !== root) root = dsu.parent[root];
      if (!roots[root]) roots[root] = [];
      roots[root].push(i);
    });
    return Object.values(roots);
  }, [dsu.parent]);

  const controls = (
    <div className="space-y-4">
       <div className="flex justify-end gap-2">
        <Button onClick={undo} disabled={!canUndo || isAnimating} variant="icon"><UndoIcon className="w-5 h-5" /></Button>
        <Button onClick={redo} disabled={!canRedo || isAnimating} variant="icon"><RedoIcon className="w-5 h-5" /></Button>
      </div>
      <div className="p-2 border border-gray-700 rounded-md space-y-2">
        <div className="flex gap-2">
          <Input value={unionA} onChange={e => setUnionA(e.target.value)} placeholder="Set A" disabled={isAnimating} />
          <Input value={unionB} onChange={e => setUnionB(e.target.value)} placeholder="Set B" disabled={isAnimating} />
        </div>
        <Button onClick={union} className="w-full" disabled={isAnimating}>Union</Button>
      </div>
      <p className="text-sm text-gray-400">Union operation runs find with path compression.</p>
    </div>
  );

  const visualization = (
     <div className="w-full h-full flex flex-wrap gap-4 p-4 items-start">
        {forest.map((set, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h4 className="font-bold text-cyan-400 mb-2">Set {index + 1}</h4>
                <div className="flex flex-wrap gap-2">
                    {set.map(item => (
                        <div key={item} className={`w-12 h-12 rounded-md flex items-center justify-center font-bold border-2 transition-all duration-300 ${highlightedPath.includes(item) ? 'bg-cyan-500 border-cyan-300 scale-110' : 'bg-gray-700 border-gray-600'}`}>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
  );

  return (
    <DataStructureLayout dsId="dsu" dsName="Disjoint Set Union" controls={controls} visualization={visualization} />
  );
};

export default DsuVisualizer;