'use client';

import { useState, useEffect } from 'react';
import { Dataset } from '@/types/dataset';
import { fetchDatasets } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import DatasetBrowser from '@/components/DatasetBrowser';
import Trends from '@/components/Trends';
import Leaderboard from '@/components/Leaderboard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('browse');
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        setLoading(true);
        const data = await fetchDatasets(100);
        setDatasets(data);
        setError(null);
      } catch {
        setError('Failed to load datasets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadDatasets();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
            <p className="text-slate-400">Loading datasets from Texas Open Data Portal...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-emerald-500 text-slate-900 rounded-lg font-medium hover:bg-emerald-400"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'browse':
        return <DatasetBrowser datasets={datasets} />;
      case 'trends':
        return <Trends datasets={datasets} />;
      case 'leaderboard':
        return <Leaderboard datasets={datasets} />;
      default:
        return <DatasetBrowser datasets={datasets} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
