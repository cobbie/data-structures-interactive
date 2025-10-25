import React, { useState } from 'react';
import { AvlNode } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DataStructureLayout from './DataStructureLayout';
import { useHistoryState } from '../../hooks/useHistoryState';
import { UndoIcon } from '../icons/UndoIcon';
import { RedoIcon } from '../icons/RedoIcon';

let nodeIdCounter = 0;
const createNode = (value: number): AvlNode => ({ value, id: nodeIdCounter++, left: null, right: null, height: 1 });
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const NodeComponent: React.FC<{ node: AvlNode | null }> = ({ node }) => {
  if (!node) return null;
  return (
    <div className="flex flex-col items-center relative">
      <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 bg-gray-700 border-gray-600 text-white">
        {node.value}
        <span className="absolute -bottom-5 text-xs text-cyan-400">h:{node.height}</span>
      </div>
      {(node.left || node.right) && (
        <div className="flex absolute top-full mt-8 w-full">
          <div className="w-1/2 relative">
            {node.left && <div className="absolute right-0 top-[-25px] h-6 w-px bg-gray-500 transform -rotate-45 origin-top-right"></div>}
            <NodeComponent node={node.left} />
          </div>
          <div className="w-1/2 relative">
            {node.right && <div className="absolute left-0 top-[-25px] h-6 w-px bg-gray-500 transform rotate-45 origin-top-left"></div>}
            <NodeComponent node={node.right} />
          </div>
        </div>
      )}
    </div>
  );
};


const SelfBalancingBstVisualizer: React.FC = () => {
  const { state: root, set: setRoot, undo, redo, canUndo, canRedo } = useHistoryState<AvlNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const height = (node: AvlNode | null) => node ? node.height : 0;
  const getBalance = (node: AvlNode | null) => node ? height(node.left) - height(node.right) : 0;

  const rightRotate = (y: AvlNode) => {
    let x = y.left!;
    let T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    return x;
  };

  const leftRotate = (x: AvlNode) => {
    let y = x.right!;
    let T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    y.height = Math.max(height(y.left), height(y.right)) + 1;
    return y;
  };

  const handleInsert = async () => {
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) return;
    setIsAnimating(true);
    
    const insertAndBalance = async (node: AvlNode | null, val: number): Promise<AvlNode> => {
      if (!node) return createNode(val);

      if (val < node.value) {
        node.left = await insertAndBalance(node.left, val);
      } else if (val > node.value) {
        node.right = await insertAndBalance(node.right, val);
      } else {
        return node;
      }
      
      node.height = 1 + Math.max(height(node.left), height(node.right));
      
      const balance = getBalance(node);
      
      // Left Left Case
      if (balance > 1 && val < node.left!.value) return rightRotate(node);
      // Right Right Case
      if (balance < -1 && val > node.right!.value) return leftRotate(node);
      // Left Right Case
      if (balance > 1 && val > node.left!.value) {
        node.left = leftRotate(node.left!);
        return rightRotate(node);
      }
      // Right Left Case
      if (balance < -1 && val < node.right!.value) {
        node.right = rightRotate(node.right!);
        return leftRotate(node);
      }

      setRoot(JSON.parse(JSON.stringify(newRoot))); // Update UI progressively
      await sleep(500);
      return node;
    }
    
    // We need a wrapper to hold the root reference
    const newRoot = await insertAndBalance(root ? JSON.parse(JSON.stringify(root)) : null, value);
    setRoot(newRoot);
    setInputValue('');
    setIsAnimating(false);
  };
  

  const controls = (
    <div className="space-y-4">
       <div className="flex justify-end gap-2">
        <Button onClick={undo} disabled={!canUndo || isAnimating} variant="icon"><UndoIcon className="w-5 h-5" /></Button>
        <Button onClick={redo} disabled={!canRedo || isAnimating} variant="icon"><RedoIcon className="w-5 h-5" /></Button>
      </div>
      <div className="flex gap-2">
        <Input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Value" disabled={isAnimating} className="flex-1 min-w-0"/>
        <Button onClick={handleInsert} disabled={isAnimating}>Insert</Button>
      </div>
      <p className="text-sm text-gray-400">Nodes show height (h). Insert triggers auto-balancing rotations.</p>
    </div>
  );

  const visualization = (
    <div className="w-full h-full flex items-start justify-center overflow-auto p-8 pt-16">
       {root ? <NodeComponent node={root} /> : <div className="text-gray-500">Tree is empty</div>}
    </div>
  );

  return (
    <DataStructureLayout dsId="self_balancing_bst" dsName="Self-Balancing BST (AVL)" controls={controls} visualization={visualization} />
  );
};

export default SelfBalancingBstVisualizer;