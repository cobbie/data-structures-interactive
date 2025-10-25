import React from 'react';
import { ComplexityClass } from '../../types';

interface ComplexityCardProps {
  complexity: ComplexityClass;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const complexityData = {
  'O(1)': {
    name: 'Constant Time',
    description: "The runtime is constant. It does not change regardless of the input size 'n'.",
    code: `function getFirstElement(arr) {\n  return arr[0];\n}`
  },
  'O(log n)': {
    name: 'Logarithmic Time',
    description: 'The runtime grows logarithmically. Common in algorithms that divide the problem in half with each step, like binary search.',
    code: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1; // Not found
}`
  },
  'O(n)': {
    name: 'Linear Time',
    description: "The runtime grows directly proportional to the input size 'n'. If 'n' doubles, the runtime doubles.",
    code: `function findElement(arr, val) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === val) return i;\n  }\n}`
  },
  'O(n log n)': {
    name: 'Log-Linear Time',
    description: 'A common complexity for efficient sorting algorithms. It scales better than quadratic time.',
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  // Merge the sorted halves
  const merged = [];
  while(left.length && right.length) {
    if (left[0] < right[0]) {
      merged.push(left.shift());
    } else {
      merged.push(right.shift());
    }
  }
  return [...merged, ...left, ...right];
}`
  },
  'O(n^2)': {
    name: 'Quadratic Time',
    description: "The runtime is proportional to the square of the input size. Common with nested loops over the input.",
    code: `function hasDuplicates(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length; j++) {\n      if (i !== j && arr[i] === arr[j]) return true;\n    }\n  }\n}`
  },
  'O(2^n)': {
    name: 'Exponential Time',
    description: 'The runtime doubles with each addition to the input size. These algorithms become impractical very quickly. Example: recursive calculation of Fibonacci numbers.',
    code: `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}`
  },
  'O(n!)': {
    name: 'Factorial Time',
    description: 'The runtime grows factorially. Extremely slow for even small inputs. Example: solving the traveling salesman problem via brute force.',
    code: `function getPermutations(arr) {
  if (arr.length === 0) return [[]];
  const first = arr[0];
  const rest = arr.slice(1);
  
  const permsWithoutFirst = getPermutations(rest);
  const allPermutations = [];
  
  permsWithoutFirst.forEach(perm => {
    for (let i = 0; i <= perm.length; i++) {
      const p = [...perm.slice(0, i), first, ...perm.slice(i)];
      allPermutations.push(p);
    }
  });
  return allPermutations;
}`
  }
};

const ComplexityCard: React.FC<ComplexityCardProps> = ({ complexity, onMouseEnter, onMouseLeave }) => {
  const data = complexityData[complexity];

  return (
    <div 
      className="bg-[#161B22] border border-gray-700 rounded-lg p-4 transition-all duration-300 hover:shadow-cyan-500/20 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h3 className="text-xl font-bold text-cyan-400 font-mono">{complexity}</h3>
      <h4 className="text-md font-semibold text-white mb-2">{data.name}</h4>
      <p className="text-sm text-gray-300 mb-4">{data.description}</p>
      <div className="bg-black/40 p-3 rounded-md">
        <pre className="text-xs text-gray-200 overflow-x-auto">
          <code>{data.code}</code>
        </pre>
      </div>
    </div>
  );
};

export default ComplexityCard;