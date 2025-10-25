import React, { useState } from 'react';
import { TreeNode } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DataStructureLayout from './DataStructureLayout';
import { useHistoryState } from '../../hooks/useHistoryState';
import { UndoIcon } from '../icons/UndoIcon';
import { RedoIcon } from '../icons/RedoIcon';

let nodeIdCounter = 2;
const initialTree: TreeNode = { id: 1, value: 10, children: [] };

const findNodeAndParent = (root: TreeNode, id: number): { node: TreeNode | null, parent: TreeNode | null } => {
  const queue: { node: TreeNode, parent: TreeNode | null }[] = [{ node: root, parent: null }];
  while (queue.length > 0) {
    const { node, parent } = queue.shift()!;
    if (node.id === id) return { node, parent };
    for (const child of node.children) {
      queue.push({ node: child, parent: node });
    }
  }
  return { node: null, parent: null };
};

const NodeComponent: React.FC<{ node: TreeNode, selectedId: number | null, onSelect: (id: number) => void }> = ({ node, selectedId, onSelect }) => {
  const isSelected = node.id === selectedId;
  return (
    <div className="flex flex-col items-center relative p-4">
      <button 
        onClick={() => onSelect(node.id)}
        className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300
          ${isSelected ? 'bg-cyan-500 border-cyan-300 text-white scale-110' : 'bg-gray-700 border-gray-600 text-white'}
        `}
      >
        {node.value}
      </button>
      {node.children.length > 0 && (
        <div className="flex absolute top-full mt-4 justify-center">
          {node.children.map((child, i) => (
             <div key={child.id} className="relative px-2">
               <div
                  className="absolute left-1/2 top-0 h-4 w-px bg-gray-500"
                  style={{ transform: `translateX(-50%)` }}
                />
               <NodeComponent node={child} selectedId={selectedId} onSelect={onSelect} />
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TreeVisualizer: React.FC = () => {
  const { state: root, set: setRoot, undo, redo, canUndo, canRedo } = useHistoryState<TreeNode>(initialTree);
  const [inputValue, setInputValue] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(1);

  const handleAddChild = () => {
    if (selectedId === null || inputValue.trim() === '') return;
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) return;
    
    const newRoot = JSON.parse(JSON.stringify(root));
    const { node: parentNode } = findNodeAndParent(newRoot, selectedId);
    if(parentNode) {
      parentNode.children.push({ id: ++nodeIdCounter, value, children: [] });
      setRoot(newRoot);
      setInputValue('');
    }
  };
  
  const handleRemoveNode = () => {
    if (selectedId === null || selectedId === root.id) return; // Cannot remove root
    
    const newRoot = JSON.parse(JSON.stringify(root));
    const { parent: nodeParent } = findNodeAndParent(newRoot, selectedId);
    if (nodeParent) {
      nodeParent.children = nodeParent.children.filter(child => child.id !== selectedId);
      setRoot(newRoot);
      setSelectedId(root.id);
    }
  };

  const controls = (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button onClick={undo} disabled={!canUndo} variant="icon" aria-label="Undo"><UndoIcon className="w-5 h-5" /></Button>
        <Button onClick={redo} disabled={!canRedo} variant="icon" aria-label="Redo"><RedoIcon className="w-5 h-5" /></Button>
      </div>
      <p className="text-sm text-gray-400">Select a node to modify it.</p>
       <div className="p-2 border border-gray-700 rounded-md space-y-2">
        <Input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Value"
          className="w-full"
        />
        <Button onClick={handleAddChild} disabled={selectedId === null} className="w-full">Add Child to Selected</Button>
      </div>
      <div className="p-2 border border-gray-700 rounded-md">
        <Button onClick={handleRemoveNode} variant="secondary" disabled={selectedId === null || selectedId === root.id} className="w-full">Remove Selected Node</Button>
      </div>
    </div>
  );

  const visualization = (
    <div className="w-full h-full flex items-start justify-center overflow-auto p-8 pt-16">
       {root ? <NodeComponent node={root} selectedId={selectedId} onSelect={setSelectedId} /> : <div className="text-gray-500">Tree is empty</div>}
    </div>
  );

  return (
    <DataStructureLayout
      dsId="tree"
      dsName="Tree"
      controls={controls}
      visualization={visualization}
    />
  );
};

export default TreeVisualizer;