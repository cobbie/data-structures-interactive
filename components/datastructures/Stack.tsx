import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DataStructureLayout from './DataStructureLayout';

const StackVisualizer: React.FC = () => {
  const [stack, setStack] = useState<number[]>([10, 20, 30]);
  const [inputValue, setInputValue] = useState('');
  const [peekedValue, setPeekedValue] = useState<number | null>(null);
  const [poppedValue, setPoppedValue] = useState<number | null>(null);

  const handlePush = () => {
    if (inputValue.trim() === '') return;
    const value = parseInt(inputValue, 10);
    if (!isNaN(value)) {
      setStack([...stack, value]);
      setInputValue('');
      setPeekedValue(null);
      setPoppedValue(null);
    }
  };

  const handlePop = () => {
    if (stack.length === 0) return;
    const newStack = [...stack];
    const popped = newStack.pop();
    setPoppedValue(popped ?? null);
    setStack(newStack);
    setPeekedValue(null);
  };

  const handlePeek = () => {
    if (stack.length > 0) {
      setPeekedValue(stack[stack.length - 1]);
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
          onKeyDown={(e) => e.key === 'Enter' && handlePush()}
          className="flex-1 min-w-0"
        />
        <Button onClick={handlePush}>Push</Button>
      </div>
      <div className="flex gap-2">
        <Button onClick={handlePop} variant="secondary" disabled={stack.length === 0}>Pop</Button>
        <Button onClick={handlePeek} variant="secondary" disabled={stack.length === 0}>Peek</Button>
      </div>
      <div className="pt-4 text-sm text-gray-400">
        {poppedValue !== null && <p>Popped: <span className="font-mono text-amber-400">{poppedValue}</span></p>}
        {peekedValue !== null && <p>Peeked: <span className="font-mono text-lime-400">{peekedValue}</span></p>}
      </div>
    </div>
  );

  const visualization = (
    <div className="w-full h-full flex items-end justify-center">
        <div className="flex flex-col-reverse gap-2 p-2 bg-gray-800 rounded-t-lg border-x-2 border-t-2 border-gray-600 min-h-[250px] w-28">
            {stack.map((item, index) => (
                <div key={index} className={`h-12 w-full rounded-md flex items-center justify-center text-lg font-bold text-white transition-all duration-300 ${index === stack.length-1 ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                    {item}
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <DataStructureLayout
      dsId="stack"
      dsName="Stack"
      controls={controls}
      visualization={visualization}
    />
  );
};

export default StackVisualizer;
