import { create } from 'zustand';
import { apiService } from '../services/apiService';
import { storageService } from '../services/storageService';
import { LoadingState } from '../types';

interface DataState<T = any> {
  data: T[];
  loading: LoadingState;
}

interface DataController {
  users: DataState;
  projects: DataState;
  
  fetchData: <T>(endpoint: string, fallbackKey: string) => Promise<T[]>;
  createData: <T>(endpoint: string, data: Partial<T>, fallbackKey: string) => Promise<T | null>;
  updateData: <T>(endpoint: string, id: string, data: Partial<T>, fallbackKey: string) => Promise<T | null>;
  deleteData: (endpoint: string, id: string, fallbackKey: string) => Promise<boolean>;
  setLoading: (dataType: string, loading: boolean, error?: string) => void;
}

export const useDataController = create<DataController>((set, get) => ({
  users: { data: [], loading: { isLoading: false, error: null } },
  projects: { data: [], loading: { isLoading: false, error: null } },

  fetchData: async <T>(endpoint: string, fallbackKey: string): Promise<T[]> => {
    const dataType = endpoint.split('/').pop() || 'data';
    get().setLoading(dataType, true);

    try {
      const response = await apiService.get<T[]>(endpoint);
      
      if (response.data) {
        set((state) => ({
          [dataType]: { 
            data: response.data, 
            loading: { isLoading: false, error: null } 
          }
        }));
        storageService.set(fallbackKey, response.data);
        return response.data;
      } else {
        // Fallback to localStorage
        const fallbackData = storageService.get<T[]>(fallbackKey) || [];
        set((state) => ({
          [dataType]: { 
            data: fallbackData, 
            loading: { isLoading: false, error: null } 
          }
        }));
        return fallbackData;
      }
    } catch (error) {
      const fallbackData = storageService.get<T[]>(fallbackKey) || [];
      get().setLoading(dataType, false, error instanceof Error ? error.message : 'Failed to fetch data');
      return fallbackData;
    }
  },

  createData: async <T>(endpoint: string, data: Partial<T>, fallbackKey: string): Promise<T | null> => {
    try {
      const response = await apiService.post<T>(endpoint, data);
      
      if (response.data) {
        const dataType = endpoint.split('/').pop() || 'data';
        const currentData = get()[dataType as keyof DataController] as DataState;
        const newData = [...currentData.data, response.data];
        
        set((state) => ({
          [dataType]: { 
            ...currentData, 
            data: newData 
          }
        }));
        
        storageService.set(fallbackKey, newData);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Create operation failed:', error);
      return null;
    }
  },

  updateData: async <T>(endpoint: string, id: string, data: Partial<T>, fallbackKey: string): Promise<T | null> => {
    try {
      const response = await apiService.put<T>(`${endpoint}/${id}`, data);
      
      if (response.data) {
        const dataType = endpoint.split('/').pop() || 'data';
        const currentData = get()[dataType as keyof DataController] as DataState;
        const newData = currentData.data.map((item: any) => 
          item.id === id ? { ...item, ...response.data } : item
        );
        
        set((state) => ({
          [dataType]: { 
            ...currentData, 
            data: newData 
          }
        }));
        
        storageService.set(fallbackKey, newData);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Update operation failed:', error);
      return null;
    }
  },

  deleteData: async (endpoint: string, id: string, fallbackKey: string): Promise<boolean> => {
    try {
      const response = await apiService.delete(`${endpoint}/${id}`);
      
      if (response.status === 200) {
        const dataType = endpoint.split('/').pop() || 'data';
        const currentData = get()[dataType as keyof DataController] as DataState;
        const newData = currentData.data.filter((item: any) => item.id !== id);
        
        set((state) => ({
          [dataType]: { 
            ...currentData, 
            data: newData 
          }
        }));
        
        storageService.set(fallbackKey, newData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Delete operation failed:', error);
      return false;
    }
  },

  setLoading: (dataType: string, loading: boolean, error?: string) => {
    set((state) => ({
      [dataType]: {
        ...state[dataType as keyof DataController] as DataState,
        loading: { isLoading: loading, error: error || null }
      }
    }));
  },
}));