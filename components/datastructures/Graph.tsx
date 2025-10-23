import React, { useState, useMemo, useCallback } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DataStructureLayout from './DataStructureLayout';
import { PlayIcon } from '../icons/PlayIcon';

interface Node {
  id: string;
  x: number;
  y: number;
}
interface Edge {
  source: string;
  target: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const GraphVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [adj, setAdj] = useState<Map<string, string[]>>(new Map());
  
  const [nodeInput, setNodeInput] = useState('');
  const [edgeSource, setEdgeSource] = useState('');
  const [edgeTarget, setEdgeTarget] = useState('');
  const [bfsStartNode, setBfsStartNode] = useState('');

  const [isAnimating, setIsAnimating] = useState(false);
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());
  const [queueNodes, setQueueNodes] = useState<string[]>([]);

  const nodePositions = useMemo(() => {
    const positions = new Map<string, {x: number, y: number}>();
    const count = nodes.length;
    if (count === 0) return positions;
    const radius = Math.min(200, 25 * count);
    const centerX = 250;
    const centerY = 150;
    nodes.forEach((node, i) => {
        const angle = (i / count) * 2 * Math.PI;
        positions.set(node.id, {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        });
    });
    return positions;
  }, [nodes]);

  const handleAddNode = () => {
    if (nodeInput && !nodes.find(n => n.id === nodeInput)) {
      setNodes([...nodes, { id: nodeInput, x: 0, y: 0 }]);
      setAdj(prev => new Map(prev).set(nodeInput, []));
      setNodeInput('');
    }
  };

  const handleAddEdge = () => {
    if (edgeSource && edgeTarget && adj.has(edgeSource) && adj.has(edgeTarget)) {
      setEdges([...edges, { source: edgeSource, target: edgeTarget }]);
      setAdj(prev => {
        // FIX: The original code was mutating state, which is incorrect in React and can lead to type errors.
        // This ensures immutability by creating a new array for the adjacency list.
        const newAdj = new Map(prev);
        const sourceNeighbors = newAdj.get(edgeSource) || [];
        newAdj.set(edgeSource, [...sourceNeighbors, edgeTarget]);
        return newAdj;
      });
      setEdgeSource('');
      setEdgeTarget('');
    }
  };
  
  const runBFS = useCallback(async () => {
    if (!adj.has(bfsStartNode)) return;
    
    setIsAnimating(true);
    setVisitedNodes(new Set());
    
    const q: string[] = [bfsStartNode];
    const visited = new Set<string>([bfsStartNode]);

    setVisitedNodes(new Set(visited));
    setQueueNodes([...q]);
    await sleep(500);

    while (q.length > 0) {
      const u = q.shift() as string;
      setQueueNodes([...q]);
      
      const neighbors = adj.get(u) || [];
      for (const v of neighbors) {
        if (!visited.has(v)) {
          visited.add(v);
          setVisitedNodes(new Set(visited));
          q.push(v);
          setQueueNodes([...q]);
          await sleep(500);
        }
      }
    }
    await sleep(1000);
    setIsAnimating(false);
    setVisitedNodes(new Set());
    setQueueNodes([]);
  }, [adj, bfsStartNode]);

  const nodeOptions = useMemo(() => nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>), [nodes]);

  const controls = (
    <div className="space-y-4">
      <div className="p-2 border border-gray-700 rounded-md">
        <div className="flex gap-2">
          <Input value={nodeInput} onChange={e => setNodeInput(e.target.value)} placeholder="Node ID" className="flex-1 min-w-0"/>
          <Button onClick={handleAddNode}>Add Node</Button>
        </div>
      </div>
      <div className="p-2 border border-gray-700 rounded-md space-y-2">
        <div className="flex gap-2">
           <select value={edgeSource} onChange={e => setEdgeSource(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white flex-1 min-w-0"> <option value="">Source</option>{nodeOptions}</select>
           <select value={edgeTarget} onChange={e => setEdgeTarget(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white flex-1 min-w-0"> <option value="">Target</option>{nodeOptions}</select>
        </div>
        <Button onClick={handleAddEdge} className="w-full">Add Edge</Button>
      </div>
       <div className="p-2 border border-gray-700 rounded-md">
        <div className="flex gap-2">
          <select value={bfsStartNode} onChange={e => setBfsStartNode(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white flex-1 min-w-0"><option value="">Start Node</option>{nodeOptions}</select>
          <Button onClick={runBFS} disabled={isAnimating} variant="secondary"><PlayIcon className="w-5 h-5"/></Button>
        </div>
      </div>
    </div>
  );

  const visualization = (
    <div className="w-full h-full flex items-center justify-center p-4 min-h-[350px]">
      <div className="relative w-[500px] h-[300px]">
        <svg className="absolute top-0 left-0 w-full h-full overflow-visible" >
           <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
            </marker>
           </defs>
           {edges.map(({ source, target }, i) => {
               const sourcePos = nodePositions.get(source);
               const targetPos = nodePositions.get(target);
               if (!sourcePos || !targetPos) return null;
               
               const dx = targetPos.x - sourcePos.x;
               const dy = targetPos.y - sourcePos.y;
               const dist = Math.sqrt(dx * dx + dy * dy);
               const unitDx = dx / dist;
               const unitDy = dy / dist;

               return <line key={i} x1={sourcePos.x} y1={sourcePos.y} x2={targetPos.x - unitDx * 25} y2={targetPos.y - unitDy * 25} stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
           })}
        </svg>
        {nodes.map(node => {
          const pos = nodePositions.get(node.id);
          const isVisited = visitedNodes.has(node.id);
          const isCurrent = queueNodes[0] === node.id;
          const nodeClasses = `w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2
            ${isCurrent ? 'bg-yellow-500 border-yellow-300 text-black scale-110' : ''}
            ${isVisited && !isCurrent ? 'bg-cyan-500 border-cyan-300 scale-105' : ''}
            ${!isVisited && !isCurrent ? 'bg-gray-700 border-gray-600' : ''}
          `;
          return <div key={node.id} className={nodeClasses} style={{ left: pos?.x, top: pos?.y }}>{node.id}</div>;
        })}
      </div>
    </div>
  );

  return (
    <DataStructureLayout
      dsId="graph"
      dsName="Graph"
      controls={controls}
      visualization={visualization}
    />
  );
};

export default GraphVisualizer;