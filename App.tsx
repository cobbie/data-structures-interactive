import React, { useState, useMemo } from 'react';
import { DATA_STRUCTURES } from './constants';
import { DataStructureId, Difficulty } from './types';
import StackVisualizer from './components/datastructures/Stack';
import QueueVisualizer from './components/datastructures/Queue';
import LinkedListVisualizer from './components/datastructures/LinkedList';
import BinarySearchTreeVisualizer from './components/datastructures/BinarySearchTree';
import HashTableVisualizer from './components/datastructures/HashTable';
import GraphVisualizer from './components/datastructures/Graph';
import ArrayVisualizer from './components/datastructures/Array';
import PlaceholderVisualizer from './components/datastructures/Placeholder';
import { CubeTransparentIcon } from './components/icons/CubeTransparentIcon';

const App: React.FC = () => {
  const [selectedDS, setSelectedDS] = useState<DataStructureId>('array');

  const selectedDSInfo = useMemo(() => DATA_STRUCTURES.find(ds => ds.id === selectedDS), [selectedDS]);

  const renderVisualizer = () => {
    if (!selectedDSInfo) return <div className="text-center p-8">Select a data structure to begin.</div>;

    switch (selectedDS) {
      case 'array':
        return <ArrayVisualizer />;
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
        return <PlaceholderVisualizer dsId={selectedDS} dsName={selectedDSInfo.name} />;
    }
  };

  const groupedDataStructures = useMemo(() => {
    const groups: Record<Difficulty, typeof DATA_STRUCTURES> = {
      easy: [],
      medium: [],
      hard: [],
    };
    for (const ds of DATA_STRUCTURES) {
      groups[ds.difficulty].push(ds);
    }
    return groups;
  }, []);

  const difficultyOrder: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-200 font-sans flex flex-col">
      <header className="bg-[#161B22]/80 backdrop-blur-sm border-b border-gray-700 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CubeTransparentIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold tracking-wider text-white">
              Data Structure Visualizer
            </h1>
          </div>
        </div>
      </header>
      
      <div className="flex-grow container mx-auto p-4 flex flex-col md:flex-row gap-6">
        <aside className="md:w-72 flex-shrink-0">
          <nav className="bg-[#161B22] border border-gray-700 rounded-lg p-4 sticky top-24">
            {difficultyOrder.map(difficulty => (
              <div key={difficulty} className="mb-6 last:mb-0">
                <h2 className="text-sm font-semibold mb-3 text-cyan-400 uppercase tracking-wider">
                  {difficulty}
                </h2>
                <ul className="space-y-2">
                  {groupedDataStructures[difficulty].map((ds) => (
                    <li key={ds.id}>
                      <button
                        onClick={() => setSelectedDS(ds.id)}
                        className={`w-full text-left px-4 py-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                          selectedDS === ds.id
                            ? 'bg-cyan-500 text-white font-semibold shadow-md'
                            : 'bg-gray-700/50 hover:bg-gray-600/70'
                        }`}
                      >
                        {ds.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
        
        <main className="flex-grow bg-[#161B22] border border-gray-700 rounded-lg shadow-inner overflow-hidden">
          {renderVisualizer()}
        </main>
      </div>
    </div>
  );
};

export default App;
