import React, { useState } from 'react';
import ComplexityCard from './ComplexityCard';
import ComplexityChart from './ComplexityChart';
import { ComplexityClass } from '../../types';

const complexityClasses: ComplexityClass[] = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)', 'O(n!)'];

const ComplexityPage: React.FC = () => {
  const [n, setN] = useState(10);
  const [hoveredClass, setHoveredClass] = useState<ComplexityClass | null>(null);

  return (
    <div className="flex-grow container mx-auto p-4 md:p-6 text-gray-200">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">A Guide to Algorithmic Complexity</h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Understanding how the performance of an algorithm scales with the size of the input.
        </p>
      </div>

      <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-3">What is Complexity?</h2>
        <div className="grid md:grid-cols-2 gap-6 text-gray-300">
          <div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">Time Complexity</h3>
            <p>
              This measures the amount of time an algorithm takes to run as a function of the length of the input. We're not measuring seconds, but rather the number of operations. It tells us how the runtime grows as the input size increases.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">Space Complexity</h3>
            <p>
              This measures the amount of memory (or space) an algorithm requires as a function of the length of the input. It includes both the space for the input data and any auxiliary space used by the algorithm.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-3">Big O Notation & Interactive Chart</h2>
        <p className="text-gray-300 mb-4">
          Big O notation is used to classify algorithms according to their worst-case performance. It describes the upper bound of the complexity. Use the slider below to see how the number of operations (y-axis) grows as the input size 'n' (x-axis) increases for different complexity classes.
        </p>
        <ComplexityChart n={n} setN={setN} hoveredClass={hoveredClass} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complexityClasses.map(c => (
          <ComplexityCard 
            key={c} 
            complexity={c}
            onMouseEnter={() => setHoveredClass(c)}
            onMouseLeave={() => setHoveredClass(null)}
          />
        ))}
      </div>
    </div>
  );
};

export default ComplexityPage;