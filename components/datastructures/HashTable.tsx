import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DataStructureLayout from './DataStructureLayout';
import { TrashIcon } from '../icons/TrashIcon';
import { useHistoryState } from '../../hooks/useHistoryState';
import { UndoIcon } from '../icons/UndoIcon';
import { RedoIcon } from '../icons/RedoIcon';

interface Entry {
  key: string;
  value: string;
}

const TABLE_SIZE = 7;

const hash = (key: string, tableSize: number) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % tableSize;
  }
  return hash;
};

const HashTableVisualizer: React.FC = () => {
  // FIX: Explicitly type the empty array in the map to ensure the correct type `Entry[][]` is inferred.
  const { state: buckets, set: setBuckets, undo, redo, canUndo, canRedo } = useHistoryState<Entry[][]>(() => Array(TABLE_SIZE).fill(null).map((): Entry[] => []));
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [foundEntry, setFoundEntry] = useState<Entry | null>(null);

  const animate = (index: number | null, entry: Entry | null = null) => {
    setIsAnimating(true);
    setHighlightedIndex(index);
    setFoundEntry(entry);
    setTimeout(() => {
      setIsAnimating(false);
      setHighlightedIndex(null);
      setFoundEntry(null);
    }, 1500);
  };

  const handleInsert = () => {
    if (!keyInput) return;
    const index = hash(keyInput, TABLE_SIZE);
    animate(index);
    const newBuckets = buckets.map(b => [...b]);
    const chain = newBuckets[index];
    const existingEntryIndex = chain.findIndex(e => e.key === keyInput);
    if (existingEntryIndex > -1) {
      chain[existingEntryIndex] = { key: keyInput, value: valueInput };
    } else {
      chain.push({ key: keyInput, value: valueInput });
    }
    setBuckets(newBuckets);
    setKeyInput('');
    setValueInput('');
  };

  const handleRemove = (keyToRemove: string) => {
    const index = hash(keyToRemove, TABLE_SIZE);
    animate(index);
    const newBuckets = buckets.map(b => [...b]);
    newBuckets[index] = newBuckets[index].filter(e => e.key !== keyToRemove);
    setBuckets(newBuckets);
  };
  
  const handleSearch = () => {
    if (!keyInput) return;
    const index = hash(keyInput, TABLE_SIZE);
    const chain = buckets[index];
    const found = chain.find(e => e.key === keyInput) || null;
    animate(index, found);
  };

  const controls = (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button onClick={undo} disabled={!canUndo || isAnimating} variant="icon" aria-label="Undo">
          <UndoIcon className="w-5 h-5" />
        </Button>
        <Button onClick={redo} disabled={!canRedo || isAnimating} variant="icon" aria-label="Redo">
          <RedoIcon className="w-5 h-5" />
        </Button>
      </div>
      <div>
        <label className="text-sm text-gray-400">Key</label>
        <Input
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="Enter a key"
          disabled={isAnimating}
          className="w-full"
        />
      </div>
      <div>
        <label className="text-sm text-gray-400">Value</label>
        <Input
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          placeholder="Enter a value"
          disabled={isAnimating}
          className="w-full"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleInsert} disabled={isAnimating || !keyInput} className="flex-1">Insert / Update</Button>
        <Button onClick={handleSearch} variant="secondary" disabled={isAnimating || !keyInput} className="flex-1">Search</Button>
      </div>
      {isAnimating && <p className="text-sm text-cyan-400">Animating...</p>}
      {foundEntry && !isAnimating && <p className="text-sm text-lime-400">Found "{foundEntry.key}": "{foundEntry.value}"</p>}
    </div>
  );

  const visualization = (
    <div className="w-full h-full flex flex-col gap-4 p-4 font-mono">
      {buckets.map((bucket, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className={`w-12 h-12 flex-shrink-0 rounded-md flex items-center justify-center font-bold text-lg border-2 transition-all duration-300 ${highlightedIndex === index ? 'bg-cyan-500 border-cyan-300 scale-110' : 'bg-gray-700 border-gray-600'}`}>
            [{index}]
          </div>
          <div className="flex items-center gap-2">
            {bucket.map((entry, entryIndex) => (
               <React.Fragment key={entry.key}>
                <div className={`relative p-2 rounded-md border flex items-center gap-2 transition-all duration-300 ${foundEntry?.key === entry.key ? 'bg-lime-500 border-lime-300 scale-110' : 'bg-gray-800 border-gray-600'}`}>
                    <span className="text-amber-400">{entry.key}:</span>
                    <span className="text-white">{entry.value}</span>
                    <button onClick={() => handleRemove(entry.key)} className="absolute -top-2 -right-2 bg-red-600 rounded-full p-0.5 hover:bg-red-500 transition-colors">
                        <TrashIcon className="w-4 h-4 text-white"/>
                    </button>
                </div>
                {entryIndex < bucket.length - 1 && <div className="w-6 h-0.5 bg-gray-500"></div>}
               </React.Fragment>
            ))}
            {bucket.length === 0 && <div className="text-gray-600">empty</div>}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <DataStructureLayout
      dsId="hash_table"
      dsName="Hash Table"
      controls={controls}
      visualization={visualization}
    />
  );
};

export default HashTableVisualizer;