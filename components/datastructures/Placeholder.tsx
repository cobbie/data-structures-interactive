import React from 'react';
import DataStructureLayout from './DataStructureLayout';
import { DataStructureId } from '../../types';

interface PlaceholderVisualizerProps {
  dsId: DataStructureId;
  dsName: string;
}

const PlaceholderVisualizer: React.FC<PlaceholderVisualizerProps> = ({ dsId, dsName }) => {
  const controls = (
    <div>
      <p className="text-gray-400">Controls for this data structure are not yet implemented.</p>
    </div>
  );

  const visualization = (
     <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">Coming Soon!</h3>
        <p>The interactive visualizer for {dsName} is currently under construction.</p>
    </div>
  );

  return (
    <DataStructureLayout
      dsId={dsId}
      dsName={dsName}
      controls={controls}
      visualization={visualization}
    />
  );
};

export default PlaceholderVisualizer;
