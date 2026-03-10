'use client';

import { Dataset } from '@/types/dataset';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Calendar } from 'lucide-react';

interface DatasetCardProps {
  dataset: Dataset;
}

export default function DatasetCard({ dataset }: DatasetCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/30 transition-all group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-100 line-clamp-2 group-hover:text-emerald-400 transition-colors">
            {dataset.name}
          </h3>
        </div>
        {dataset.category && dataset.category !== 'Uncategorized' && (
          <Badge variant="secondary" className="mt-2 bg-slate-800 text-slate-300 border-slate-700">
            {dataset.category}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-slate-400 line-clamp-2 mb-4">
          {dataset.description || 'No description available'}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{formatNumber(dataset.viewCount || 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download size={14} />
            <span>{formatNumber(dataset.downloadCount || 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(dataset.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
