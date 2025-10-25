import React from 'react';
import { ComplexityClass } from '../../types';

interface ComplexityChartProps {
  n: number;
  setN: (n: number) => void;
  hoveredClass: ComplexityClass | null;
}

const factorial = (num: number): number => {
  if (num < 0) return -1;
  else if (num === 0) return 1;
  else {
    let result = 1;
    for (let i = 1; i <= num; i++) {
      if (result > 1000) return 1001; // Cap to prevent overflow
      result *= i;
    }
    return result;
  }
};

const functions: Record<ComplexityClass, (n: number) => number> = {
  'O(1)': n => 1,
  'O(log n)': n => Math.log2(n),
  'O(n)': n => n,
  'O(n log n)': n => n * Math.log2(n),
  'O(n^2)': n => n * n,
  'O(2^n)': n => Math.pow(2, n),
  'O(n!)': n => factorial(n),
};

const colors: Record<ComplexityClass, string> = {
  'O(1)': '#34d399', // Emerald
  'O(log n)': '#60a5fa', // Blue
  'O(n)': '#facc15', // Yellow
  'O(n log n)': '#fb923c', // Orange
  'O(n^2)': '#f87171', // Red
  'O(2^n)': '#f472b6', // Pink
  'O(n!)': '#c084fc', // Purple
};

const MAX_N = 50;
const MAX_OPS = 100;

const ComplexityChart: React.FC<ComplexityChartProps> = ({ n, setN, hoveredClass }) => {
  const width = 500;
  const height = 300;
  const padding = 40;

  const getPathData = (fn: (n: number) => number) => {
    let d = `M ${padding} ${height - padding}`;
    for (let i = 1; i <= MAX_N; i++) {
      const x = padding + (i / MAX_N) * (width - 2 * padding);
      const val = fn(i);
      const y = height - padding - (Math.min(val, MAX_OPS) / MAX_OPS) * (height - 2 * padding);
      d += ` L ${x} ${y}`;
    }
    return d;
  };

  return (
    <div className="flex flex-col items-center">
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="bg-black/30 rounded-lg">
            {/* Axes */}
            <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#4b5563" />
            <line x1={padding} y1={padding} x2={padding} y2={height-padding} stroke="#4b5563" />
            <text x={width - padding} y={height - padding + 15} textAnchor="end" fill="#6b7280" fontSize="10">n (Input Size)</text>
            <text x={padding - 10} y={padding} textAnchor="end" transform={`rotate(-90, ${padding-10}, ${padding})`} fill="#6b7280" fontSize="10">Operations</text>
            <text x={padding} y={height - padding + 15} fill="#6b7280" fontSize="10">0</text>
            <text x={width-padding} y={height-padding+15} fill="#6b7280" fontSize="10">{MAX_N}</text>
            <text x={padding-10} y={padding+5} fill="#6b7280" fontSize="10">{MAX_OPS}+</text>


            {/* Paths */}
            {Object.entries(functions).map(([key, fn]) => (
                <path 
                    key={key} 
                    d={getPathData(fn)} 
                    fill="none" 
                    stroke={colors[key as ComplexityClass]} 
                    strokeWidth={hoveredClass === key || !hoveredClass ? 3 : 1.5}
                    opacity={hoveredClass === key || !hoveredClass ? 1 : 0.3}
                    className="transition-all duration-200"
                />
            ))}

            {/* Current N line */}
            <line 
                x1={padding + (n / MAX_N) * (width - 2 * padding)} 
                y1={padding} 
                x2={padding + (n / MAX_N) * (width - 2 * padding)} 
                y2={height-padding} 
                stroke="#fff" 
                strokeDasharray="4 2"
            />
        </svg>
      <div className="w-full mt-4">
        <label htmlFor="n-slider" className="block text-center mb-2">Input Size (n): <span className="font-bold text-cyan-400">{n}</span></label>
        <input 
            id="n-slider"
            type="range"
            min="1"
            max={MAX_N}
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
       <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
          {Object.entries(colors).map(([key, color]) => (
             <div key={key} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: color}}></div>
                <span>{key}</span>
             </div>
          ))}
       </div>
    </div>
  );
};

export default ComplexityChart;