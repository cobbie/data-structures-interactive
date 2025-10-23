import React, { useState } from 'react';
import { DATA_STRUCTURES } from './constants';
import { DataStructureId } from './types';
import StackVisualizer from './components/datastructures/Stack';
import QueueVisualizer from './components/datastructures/Queue';
import LinkedListVisualizer from './components/datastructures/LinkedList';
import BinarySearchTreeVisualizer from './components/datastructures/BinarySearchTree';
import HashTableVisualizer from './components/datastructures/HashTable';
import GraphVisualizer from './components/datastructures/Graph';
import { CodeIcon } from './components/icons/CodeIcon';

const App: React.FC = () => {
  const [selectedDS, setSelectedDS] = useState<DataStructureId>('stack');

  const renderVisualizer = () => {
    switch (selectedDS) {
      case 'stack':
        return <StackVisualizer />;
      case 'queue':
        return <QueueVisualizer />;
      case 'linked_list':
        return <LinkedListVisualizer />;
      case 'binary_search_tree':
        return <BinarySearchTreeVisualizer />;
      case 'hash_table':
        return <HashTableVisualizer />;
      case 'graph':
        return <GraphVisualizer />;
      default:
        return <div className="text-center p-8">Select a data structure to begin.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CodeIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold tracking-wider text-white">
              Data Structure Visualizer
            </h1>
          </div>
        </div>
      </header>
      
      <div className="flex-grow container mx-auto p-4 flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 flex-shrink-0">
          <nav className="bg-gray-800 rounded-lg p-4 sticky top-24">
            <h2 className="text-lg font-semibold mb-4 text-cyan-400">Structures</h2>
            <ul className="space-y-2">
              {DATA_STRUCTURES.map((ds) => (
                <li key={ds.id}>
                  <button
                    onClick={() => setSelectedDS(ds.id)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      selectedDS === ds.id
                        ? 'bg-cyan-500 text-white font-semibold shadow-md'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {ds.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        <main className="flex-grow bg-gray-800/50 rounded-lg shadow-inner overflow-hidden">
          {renderVisualizer()}
        </main>
      </div>
    </div>
  );
};

export default App;
