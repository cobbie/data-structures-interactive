import React from 'react';
import useGeminiDSInfo from '../../hooks/useGeminiDSInfo';
import { DataStructureId } from '../../types';
import Accordion from '../ui/Accordion';
import Loader from '../ui/Loader';
import { marked } from 'marked';

interface DataStructureLayoutProps {
  dsId: DataStructureId;
  dsName: string;
  controls: React.ReactNode;
  visualization: React.ReactNode;
}

const DataStructureLayout: React.FC<DataStructureLayoutProps> = ({ dsId, dsName, controls, visualization }) => {
  const { info, isLoading } = useGeminiDSInfo(dsId, dsName);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-3xl font-bold text-white">{dsName}</h2>
        {isLoading && !info ? (
          <div className="h-6 bg-gray-700 rounded-md w-3/4 animate-pulse mt-2"></div>
        ) : (
          <p className="text-gray-300 mt-1">{info?.description}</p>
        )}
      </div>

      <div className="flex-grow flex flex-col lg:flex-row p-4 gap-4 overflow-auto">
        <div className="lg:w-1/3 xl:w-1/4 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-cyan-400">Controls</h3>
          {controls}
        </div>
        <div className="flex-grow bg-gray-900/50 p-4 rounded-lg border border-gray-700 min-h-[300px] lg:min-h-0 flex items-center justify-center">
          {visualization}
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        <Accordion title="Theory & Technical Concepts">
          {isLoading ? <Loader /> : (
            <div className="prose prose-invert max-w-none prose-pre:bg-gray-900 prose-table:border prose-table:border-gray-600 prose-th:border-gray-600 prose-td:border-gray-600">
              <h4>Time Complexity</h4>
              <div dangerouslySetInnerHTML={{ __html: marked(info?.theory?.timeComplexity || '') }} />
              <h4>Space Complexity</h4>
              <p>{info?.theory?.spaceComplexity}</p>
              <h4>Use Cases</h4>
              <div dangerouslySetInnerHTML={{ __html: marked(info?.theory?.useCases || '') }} />
              <h4>Real-world Examples</h4>
              <div dangerouslySetInnerHTML={{ __html: marked(info?.theory?.realWorldExamples || '') }} />
            </div>
          )}
        </Accordion>
      </div>
    </div>
  );
};

export default DataStructureLayout;
