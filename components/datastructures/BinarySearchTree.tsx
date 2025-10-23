import React, { useState, useCallback } from 'react';
import { BstNode } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DataStructureLayout from './DataStructureLayout';

let nodeIdCounter = 100;

// Helper to create a new node
const createNode = (value: number): BstNode => ({
  value,
  id: nodeIdCounter++,
  left: null,
  right: null,
});

// Recursive component to render the tree
const NodeComponent: React.FC<{ node: BstNode | null, searchingId: number | null, foundId: number | null }> = ({ node, searchingId, foundId }) => {
  if (!node) return null;

  const isSearching = node.id === searchingId;
  const isFound = node.id === foundId;

  const nodeClasses = `w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300
    ${isFound ? 'bg-green-500 border-green-300 text-white scale-110' : ''}
    ${isSearching ? 'bg-yellow-500 border-yellow-300 text-black scale-110' : ''}
    ${!isFound && !isSearching ? 'bg-gray-700 border-gray-600 text-white' : ''}
  `;

  return (
    <div className="flex flex-col items-center relative">
      <div className={nodeClasses}>{node.value}</div>
      {(node.left || node.right) && (
        <div className="flex absolute top-full mt-4 w-full">
          <div className="w-1/2 relative">
            {node.left && <div className="absolute right-0 top-[-10px] h-6 w-px bg-gray-500 transform -rotate-45 origin-top-right"></div>}
            <NodeComponent node={node.left} searchingId={searchingId} foundId={foundId} />
          </div>
          <div className="w-1/2 relative">
            {node.right && <div className="absolute left-0 top-[-10px] h-6 w-px bg-gray-500 transform rotate-45 origin-top-left"></div>}
            <NodeComponent node={node.right} searchingId={searchingId} foundId={foundId} />
          </div>
        </div>
      )}
    </div>
  );
};

const BinarySearchTreeVisualizer: React.FC = () => {
  const [root, setRoot] = useState<BstNode | null>(() => {
    // Initial tree
    const r = createNode(50);
    r.left = createNode(30);
    r.right = createNode(70);
    r.left.left = createNode(20);
    r.left.right = createNode(40);
    r.right.left = createNode(60);
    r.right.right = createNode(80);
    return r;
  });

  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchingId, setSearchingId] = useState<number | null>(null);
  const [foundId, setFoundId] = useState<number | null>(null);

  const insert = useCallback((value: number) => {
    const insertNode = (node: BstNode | null): BstNode => {
      if (node === null) {
        return createNode(value);
      }
      if (value < node.value) {
        node.left = insertNode(node.left);
      } else if (value > node.value) {
        node.right = insertNode(node.right);
      }
      return node;
    };
    setRoot(prevRoot => insertNode(JSON.parse(JSON.stringify(prevRoot || null))));
  }, []);

  const handleInsert = () => {
    const value = parseInt(inputValue, 10);
    if (!isNaN(value)) {
      setIsAnimating(true);
      insert(value);
      setInputValue('');
      setTimeout(() => setIsAnimating(false), 500);
    }
  };
  
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSearch = async () => {
    const value = parseInt(inputValue, 10);
    if (isNaN(value) || !root) return;

    setIsAnimating(true);
    setFoundId(null);
    let current = root;
    while (current) {
        setSearchingId(current.id);
        await sleep(500);
        if (value === current.value) {
            setFoundId(current.id);
            break;
        } else if (value < current.value) {
            current = current.left as BstNode;
        } else {
            current = current.right as BstNode;
        }
    }
    await sleep(1000);
    setSearchingId(null);
    setIsAnimating(false);
  };


  const controls = (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a value"
          disabled={isAnimating}
          className="flex-1 min-w-0"
        />
        <Button onClick={handleInsert} disabled={isAnimating}>Insert</Button>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSearch} variant="secondary" disabled={isAnimating}>Search</Button>
      </div>
      {isAnimating && <div className="text-sm text-cyan-400">Animating...</div>}
    </div>
  );

  const visualization = (
    <div className="w-full h-full flex items-start justify-center overflow-auto p-8 pt-16">
       {root ? <NodeComponent node={root} searchingId={searchingId} foundId={foundId} /> : <div className="text-gray-500">Tree is empty</div>}
    </div>
  );

  return (
    <DataStructureLayout
      dsId="binary_search_tree"
      dsName="Binary Search Tree"
      controls={controls}
      visualization={visualization}
    />
  );
};

export default BinarySearchTreeVisualizer;
