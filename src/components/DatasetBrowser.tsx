'use client';

import { useState, useMemo } from 'react';
import { Dataset, DatasetFilters } from '@/types/dataset';
import DatasetCard from './DatasetCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal } from 'lucide-react';

interface DatasetBrowserProps {
  datasets: Dataset[];
}

export default function DatasetBrowser({ datasets }: DatasetBrowserProps) {
  const [filters, setFilters] = useState<DatasetFilters>({
    search: '',
    category: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const categories = useMemo(() => {
    const cats = new Set<string>();
    datasets.forEach((d) => {
      if (d.category && d.category !== 'Uncategorized') {
        cats.add(d.category);
      }
    });
    return Array.from(cats).sort();
  }, [datasets]);

  const filteredDatasets = useMemo(() => {
    let result = [...datasets];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(searchLower) ||
          (d.description && d.description.toLowerCase().includes(searchLower))
      );
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter((d) => d.category === filters.category);
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'views':
          comparison = (a.viewCount || 0) - (b.viewCount || 0);
          break;
        case 'date':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [datasets, filters]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">Dataset Browser</h2>
          <span className="text-sm text-slate-400">
            {filteredDatasets.length} of {datasets.length} datasets
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <Input
              placeholder="Search datasets..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10 bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as 'date' | 'name' | 'views' })}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="views">Sort by Views</option>
          </select>

          <button
            onClick={() =>
              setFilters({ ...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })
            }
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 text-sm hover:bg-slate-800"
          >
            {filters.sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-slate-400"><SlidersHorizontal size={14} className="inline mr-1" /> Filter:</span>
          <Badge
            variant={filters.category === 'all' ? 'default' : 'secondary'}
            className={`cursor-pointer ${
              filters.category === 'all'
                ? 'bg-emerald-500 hover:bg-emerald-600'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
            onClick={() => setFilters({ ...filters, category: 'all' })}
          >
            All
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={filters.category === cat ? 'default' : 'secondary'}
              className={`cursor-pointer ${
                filters.category === cat
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              onClick={() => setFilters({ ...filters, category: cat })}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDatasets.map((dataset) => (
          <DatasetCard key={dataset.id} dataset={dataset} />
        ))}
      </div>

      {filteredDatasets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No datasets found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
