import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DataStructureLayout from './DataStructureLayout';

const QueueVisualizer: React.FC = () => {
  const [queue, setQueue] = useState<number[]>([10, 20, 30]);
  const [inputValue, setInputValue] = useState('');
  const [peekedValue, setPeekedValue] = useState<number | null>(null);
  const [dequeuedValue, setDequeuedValue] = useState<number | null>(null);

  const handleEnqueue = () => {
    if (inputValue.trim() === '') return;
    const value = parseInt(inputValue, 10);
    if (!isNaN(value)) {
      setQueue([...queue, value]);
      setInputValue('');
      setPeekedValue(null);
      setDequeuedValue(null);
    }
  };

  const handleDequeue = () => {
    if (queue.length === 0) return;
    const [first, ...rest] = queue;
    setDequeuedValue(first);
    setQueue(rest);
    setPeekedValue(null);
  };

  const handlePeek = () => {
    if (queue.length > 0) {
      setPeekedValue(queue[0]);
    } else {
      setPeekedValue(null);
    }
  };

  const controls = (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a value"
          onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()}
          className="flex-1 min-w-0"
        />
        <Button onClick={handleEnqueue}>Enqueue</Button>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleDequeue} variant="secondary" disabled={queue.length === 0}>Dequeue</Button>
        <Button onClick={handlePeek} variant="secondary" disabled={queue.length === 0}>Peek</Button>
      </div>
       <div className="pt-4 text-sm text-gray-400">
        {dequeuedValue !== null && <p>Dequeued: <span className="font-mono text-amber-400">{dequeuedValue}</span></p>}
        {peekedValue !== null && <p>Front: <span className="font-mono text-lime-400">{peekedValue}</span></p>}
      </div>
    </div>
  );

  const visualization = (
    <div className="w-full h-full flex items-center justify-start overflow-x-auto p-4">
        <div className="flex flex-row gap-2 p-2 bg-gray-800 rounded-lg border-2 border-gray-600">
            {queue.map((item, index) => (
                <div key={index} className={`h-16 w-16 rounded-md flex items-center justify-center text-lg font-bold text-white transition-all duration-300 ${index === 0 ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                    {item}
                </div>
            ))}
             {queue.length === 0 && <div className="h-16 w-48 text-gray-500 flex items-center justify-center">Queue is empty</div>}
        </div>
    </div>
  );

  return (
    <DataStructureLayout
      dsId="queue"
      dsName="Queue"
      controls={controls}
      visualization={visualization}
    />
  );
};

export default QueueVisualizer;
