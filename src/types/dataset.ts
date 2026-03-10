export interface Dataset {
  id: string;
  name: string;
  description: string;
  displayType: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  downloadCount: number;
  category?: string;
  tags?: string[];
  owner?: {
    displayName: string;
  };
  metadata?: {
    custom_fields?: {
      Domain?: string;
      Category?: string;
    };
  };
}

export interface DatasetFilters {
  search: string;
  category: string;
  sortBy: 'date' | 'name' | 'views';
  sortOrder: 'asc' | 'desc';
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface MonthlyData {
  month: string;
  count: number;
}
