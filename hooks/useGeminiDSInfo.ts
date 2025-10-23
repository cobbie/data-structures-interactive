
import { useState, useEffect } from 'react';
import fetchDSInfo from '../services/geminiService';
import { DSInfo, DataStructureId } from '../types';

const useGeminiDSInfo = (dsId: DataStructureId, dsName: string) => {
  const [info, setInfo] = useState<DSInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getInfo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchDSInfo(dsName);
        if (data) {
          setInfo(data);
        } else {
          throw new Error('Failed to fetch data structure information.');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dsId]); // Re-fetch when the data structure changes

  return { info, isLoading, error };
};

export default useGeminiDSInfo;
