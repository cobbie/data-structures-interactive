import React, { useState } from 'react';
import { BstNode } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DataStructureLayout from './DataStructureLayout';
import { useHistoryState } from '../../hooks/useHistoryState';
import { UndoIcon } from '../icons/UndoIcon';
import { RedoIcon } from '../icons/RedoIcon';

let nodeIdCounter = 0;
const createNode = (value: number): BstNode => ({ value, id: nodeIdCounter++, left: null, right: null });

const NodeComponent: React.FC<{ node: BstNode | null, visitedId: number | null }> = ({ node, visitedId }) => {
  if (!node) return null;

  const isVisited = node.id === visitedId;
  const nodeClasses = `w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300
    ${isVisited ? 'bg-cyan-500 border-cyan-300 text-white scale-110' : 'bg-gray-700 border-gray-600 text-white'}
  `;

  return (
    <div className="flex flex-col items-center relative">
      <div className={nodeClasses}>{node.value}</div>
      {(node.left || node.right) && (
        <div className="flex absolute top-full mt-4 w-full">
          <div className="w-1/2 relative">
            {node.left && <div className="absolute right-0 top-[-10px] h-6 w-px bg-gray-500 transform -rotate-45 origin-top-right"></div>}
            <NodeComponent node={node.left} visitedId={visitedId} />
          </div>
          <div className="w-1/2 relative">
            {node.right && <div className="absolute left-0 top-[-10px] h-6 w-px bg-gray-500 transform rotate-45 origin-top-left"></div>}
            <NodeComponent node={node.right} visitedId={visitedId} />
          </div>
        </div>
      )}
    </div>
  );
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const BinaryTreeVisualizer: React.FC = () => {
  const { state: root, set: setRoot, undo, redo, canUndo, canRedo } = useHistoryState<BstNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [visitedId, setVisitedId] = useState<number | null>(null);
  const [traversalOrder, setTraversalOrder] = useState<number[]>([]);

  const handleInsert = () => {
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) return;
    
    if (!root) {
      setRoot(createNode(value));
    } else {
      const newRoot = JSON.parse(JSON.stringify(root));
      const queue: BstNode[] = [newRoot];
      while (queue.length > 0) {
        const current = queue.shift()!;
        if (!current.left) {
          current.left = createNode(value);
          break;
        } else {
          queue.push(current.left);
        }
        if (!current.right) {
          current.right = createNode(value);
          break;
        } else {
          queue.push(current.right);
        }
      }
      setRoot(newRoot);
    }
    setInputValue('');
  };
  
  const animateTraversal = async (nodes: BstNode[]) => {
    setIsAnimating(true);
    setTraversalOrder([]);
    const order: number[] = [];
    for (const node of nodes) {
      setVisitedId(node.id);
      order.push(node.value);
      setTraversalOrder([...order]);
      await sleep(500);
    }
    await sleep(1000);
    setVisitedId(null);
    setIsAnimating(false);
  }
  
  const handleBfs = () => {
    if (!root) return;
    const order: BstNode[] = [];
    const queue = [root];
    while(queue.length > 0) {
      const node = queue.shift()!;
      order.push(node);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    animateTraversal(order);
  };
  
  const handleDfs = (type: 'pre' | 'in' | 'post') => {
    if (!root) return;
    const order: BstNode[] = [];
    const traverse = (node: BstNode) => {
      if (type === 'pre') order.push(node);
      if (node.left) traverse(node.left);
      if (type === 'in') order.push(node);
      if (node.right) traverse(node.right);
      if (type === 'post') order.push(node);
    };
    traverse(root);
    animateTraversal(order);
  }

  const controls = (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button onClick={undo} disabled={!canUndo || isAnimating} variant="icon"><UndoIcon className="w-5 h-5" /></Button>
        <Button onClick={redo} disabled={!canRedo || isAnimating} variant="icon"><RedoIcon className="w-5 h-5" /></Button>
      </div>
      <div className="flex gap-2">
        <Input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Value" disabled={isAnimating} className="flex-1 min-w-0" />
        <Button onClick={handleInsert} disabled={isAnimating}>Insert</Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={handleBfs} variant="secondary" disabled={isAnimating}>BFS</Button>
        <Button onClick={() => handleDfs('pre')} variant="secondary" disabled={isAnimating}>Pre-order</Button>
        <Button onClick={() => handleDfs('in')} variant="secondary" disabled={isAnimating}>In-order</Button>
        <Button onClick={() => handleDfs('post')} variant="secondary" disabled={isAnimating}>Post-order</Button>
      </div>
      {traversalOrder.length > 0 && <p className="text-sm text-gray-400">Order: <span className="font-mono text-cyan-400">{traversalOrder.join(' -> ')}</span></p>}
    </div>
  );

  const visualization = (
    <div className="w-full h-full flex items-start justify-center overflow-auto p-8 pt-16">
       {root ? <NodeComponent node={root} visitedId={visitedId} /> : <div className="text-gray-500">Tree is empty</div>}
    </div>
  );

  return (
    <DataStructureLayout
      dsId="binary_tree"
      dsName="Binary Tree"
      controls={controls}
      visualization={visualization}
    />
  );
};

export default BinaryTreeVisualizer;