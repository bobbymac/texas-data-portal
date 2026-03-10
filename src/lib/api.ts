import axios from 'axios';
import { Dataset } from '@/types/dataset';

const BASE_URL = 'https://data.texas.gov/api';

interface ApiDataset {
  id?: string;
  viewId?: string;
  name?: string;
  description?: string;
  displayType?: string;
  createdAt?: string;
  viewLastModified?: string;
  viewCount?: number;
  downloadCount?: number;
  category?: string;
  tags?: string[];
  owner?: { displayName: string };
  metadata?: {
    custom_fields?: {
      Domain?: string;
      Category?: string;
    };
  };
}

export async function fetchDatasets(limit: number = 100): Promise<Dataset[]> {
  try {
    const response = await axios.get(`${BASE_URL}/views.json?limit=${limit}`);
    return response.data.map((item: ApiDataset) => ({
      id: item.id || item.viewId || '',
      name: item.name || 'Untitled Dataset',
      description: item.description || '',
      displayType: item.displayType || 'table',
      createdAt: item.createdAt || item.viewLastModified || new Date().toISOString(),
      updatedAt: item.viewLastModified || item.createdAt || new Date().toISOString(),
      viewCount: item.viewCount || 0,
      downloadCount: item.downloadCount || 0,
      category: item.category || item.metadata?.custom_fields?.Category || 'Uncategorized',
      tags: item.tags || [],
      owner: item.owner || { displayName: 'Unknown' },
      metadata: item.metadata || {},
    }));
  } catch (error) {
    console.error('Error fetching datasets:', error);
    return [];
  }
}

export async function fetchDatasetById(id: string): Promise<Dataset | null> {
  try {
    const response = await axios.get(`${BASE_URL}/views/${id}.json`);
    const item: ApiDataset = response.data;
    return {
      id: item.id || item.viewId || '',
      name: item.name || 'Untitled Dataset',
      description: item.description || '',
      displayType: item.displayType || 'table',
      createdAt: item.createdAt || item.viewLastModified || new Date().toISOString(),
      updatedAt: item.viewLastModified || item.createdAt || new Date().toISOString(),
      viewCount: item.viewCount || 0,
      downloadCount: item.downloadCount || 0,
      category: item.category || item.metadata?.custom_fields?.Category || 'Uncategorized',
      tags: item.tags || [],
      owner: item.owner || { displayName: 'Unknown' },
      metadata: item.metadata || {},
    };
  } catch (error) {
    console.error('Error fetching dataset:', error);
    return null;
  }
}
