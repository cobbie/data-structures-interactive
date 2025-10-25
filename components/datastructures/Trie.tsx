import React, { useState } from 'react';
import { TrieNode } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DataStructureLayout from './DataStructureLayout';
import { useHistoryState } from '../../hooks/useHistoryState';
import { UndoIcon } from '../icons/UndoIcon';
import { RedoIcon } from '../icons/RedoIcon';

const createTrieNode = (id: string): TrieNode => ({ children: {}, isEndOfWord: false, id });
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
let nodeIdCounter = 0;

const NodeComponent: React.FC<{ node: TrieNode, char: string, highlightedNodes: Set<string> }> = ({ node, char, highlightedNodes }) => {
  const isHighlighted = highlightedNodes.has(node.id);
  const nodeClasses = `w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300
    ${isHighlighted ? 'bg-cyan-500 border-cyan-300 text-white scale-110' : 'bg-gray-700 border-gray-600'}
    ${node.isEndOfWord ? 'border-amber-400' : ''}
  `;
  const children = Object.entries(node.children);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex items-center">
        <div className={nodeClasses}>{char || 'root'}</div>
      </div>
      {children.length > 0 && (
        <div className="flex mt-8 justify-center gap-2">
          {/* FIX: Explicitly type the destructured array from Object.entries to resolve type inference issue. */}
          {children.map(([char, childNode]: [string, TrieNode]) => (
            <div key={childNode.id} className="flex flex-col items-center relative">
              <div className="absolute -top-4 text-sm text-gray-400">{char}</div>
              <NodeComponent node={childNode} char={char} highlightedNodes={highlightedNodes} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TrieVisualizer: React.FC = () => {
  const { state: root, set: setRoot, undo, redo, canUndo, canRedo } = useHistoryState<TrieNode>(() => createTrieNode(`${nodeIdCounter++}`));
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const handleInsert = async () => {
    if (!inputValue) return;
    setIsAnimating(true);
    setSearchResult(null);
    
    const newRoot = JSON.parse(JSON.stringify(root));
    let current = newRoot;
    const path: string[] = [current.id];

    for (const char of inputValue) {
      if (!current.children[char]) {
        current.children[char] = createTrieNode(`${nodeIdCounter++}`);
      }
      current = current.children[char];
      path.push(current.id);
    }
    current.isEndOfWord = true;
    
    // Animate path
    for (let i = 0; i < path.length; i++) {
        setHighlightedNodes(new Set(path.slice(0, i + 1)));
        await sleep(200);
    }
    
    setRoot(newRoot);
    setInputValue('');
    await sleep(1000);
    setHighlightedNodes(new Set());
    setIsAnimating(false);
  };
  
  const handleSearch = async () => {
    if (!inputValue) return;
    setIsAnimating(true);
    setSearchResult(null);
    let current = root;
    const path: string[] = [current.id];

    for (const char of inputValue) {
        if (!current.children[char]) {
            setSearchResult(`Prefix "${inputValue}" not found.`);
            break;
        }
        current = current.children[char];
        path.push(current.id);
    }

    for (let i = 0; i < path.length; i++) {
        setHighlightedNodes(new Set(path.slice(0, i + 1)));
        await sleep(200);
    }

    if(!searchResult) {
        setSearchResult(current.isEndOfWord ? `Word "${inputValue}" found!` : `Prefix "${inputValue}" found, but not a full word.`);
    }

    await sleep(2000);
    setHighlightedNodes(new Set());
    setIsAnimating(false);
  }

  const controls = (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button onClick={undo} disabled={!canUndo || isAnimating} variant="icon"><UndoIcon className="w-5 h-5" /></Button>
        <Button onClick={redo} disabled={!canRedo || isAnimating} variant="icon"><RedoIcon className="w-5 h-5" /></Button>
      </div>
      <div className="flex gap-2">
        <Input value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Enter word" disabled={isAnimating} className="flex-1 min-w-0" />
      </div>
       <div className="flex gap-2">
        <Button onClick={handleInsert} disabled={isAnimating || !inputValue} className="flex-1">Insert</Button>
        <Button onClick={handleSearch} variant="secondary" disabled={isAnimating || !inputValue} className="flex-1">Search</Button>
      </div>
      {searchResult && <p className="text-sm text-lime-400">{searchResult}</p>}
    </div>
  );

  const visualization = (
     <div className="w-full h-full flex items-start justify-center overflow-auto p-8 pt-16">
       <NodeComponent node={root} char="" highlightedNodes={highlightedNodes} />
    </div>
  );

  return (
    <DataStructureLayout dsId="trie" dsName="Trie (Prefix Tree)" controls={controls} visualization={visualization} />
  );
};

export default TrieVisualizer;