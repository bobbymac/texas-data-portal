'use client';

import { useState, useMemo } from 'react';
import { Dataset } from '@/types/dataset';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Calendar, Award } from 'lucide-react';

interface LeaderboardProps {
  datasets: Dataset[];
}

type SortField = 'views' | 'downloads' | 'date' | 'name';

export default function Leaderboard({ datasets }: LeaderboardProps) {
  const [sortField, setSortField] = useState<SortField>('views');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const topDatasets = useMemo(() => {
    const sorted = [...datasets].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'views':
          comparison = (a.viewCount || 0) - (b.viewCount || 0);
          break;
        case 'downloads':
          comparison = (a.downloadCount || 0) - (b.downloadCount || 0);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    return sorted.slice(0, 10);
  }, [datasets, sortField, sortOrder]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Award className="text-yellow-400" size={20} />;
    if (index === 1) return <Award className="text-slate-300" size={20} />;
    if (index === 2) return <Award className="text-amber-600" size={20} />;
    return <span className="text-slate-500 font-mono w-5 text-center">{index + 1}</span>;
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return 'bg-yellow-500/10 border-yellow-500/30';
    if (index === 1) return 'bg-slate-400/10 border-slate-400/30';
    if (index === 2) return 'bg-amber-600/10 border-amber-600/30';
    return 'bg-slate-900/50 border-slate-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Popular Datasets</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Sort by:</span>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-slate-100 text-sm"
          >
            <option value="views">Most Viewed</option>
            <option value="downloads">Most Downloaded</option>
            <option value="date">Recently Added</option>
            <option value="name">Name</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-slate-100 text-sm hover:bg-slate-800"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {topDatasets.map((dataset, index) => (
          <Card
            key={dataset.id}
            className={`border transition-all hover:border-emerald-500/30 ${getRankStyle(index)}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 mt-1">
                  {getRankIcon(index)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-100 truncate">
                      {dataset.name}
                    </h3>
                    {dataset.category && dataset.category !== 'Uncategorized' && (
                      <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700 shrink-0">
                        {dataset.category}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-slate-400 line-clamp-1 mt-1">
                    {dataset.description || 'No description available'}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Eye size={14} className="text-emerald-400" />
                      <span className="font-medium text-slate-300">
                        {formatNumber(dataset.viewCount || 0)}
                      </span>
                      <span>views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download size={14} className="text-emerald-400" />
                      <span className="font-medium text-slate-300">
                        {formatNumber(dataset.downloadCount || 0)}
                      </span>
                      <span>downloads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(dataset.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
