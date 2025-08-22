interface CrudItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface CrudResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class CrudService {
  private baseUrl = 'http://localhost:3000/api';
  private storage = new Map<string, CrudItem[]>();

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
    };
  }

  // Fallback to localStorage when API is not available
  private getFromStorage<T extends CrudItem>(resource: string): T[] {
    const stored = localStorage.getItem(`crud_${resource}`);
    return stored ? JSON.parse(stored) : [];
  }

  private saveToStorage<T extends CrudItem>(resource: string, data: T[]): void {
    localStorage.setItem(`crud_${resource}`, JSON.stringify(data));
  }

  async getAll<T extends CrudItem>(
    resource: string,
    params?: { page?: number; limit?: number; search?: string; sort?: string }
  ): Promise<CrudResponse<PaginatedResponse<T>>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sort) queryParams.append('sort', params.sort);

      const response = await fetch(`${this.baseUrl}/${resource}?${queryParams}`, {
        headers: this.getHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { data, status: response.status };
      }
    } catch (error) {
      console.warn('API not available, using localStorage fallback');
    }

    // Fallback to localStorage
    const allData = this.getFromStorage<T>(resource);
    let filteredData = [...allData];

    // Apply search filter
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredData = filteredData.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply sorting
    if (params?.sort) {
      const [field, direction] = params.sort.split(':');
      filteredData.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return direction === 'desc' ? -comparison : comparison;
      });
    }

    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const result: PaginatedResponse<T> = {
      data: paginatedData,
      total: filteredData.length,
      page,
      limit,
      totalPages: Math.ceil(filteredData.length / limit),
    };

    return { data: result, status: 200 };
  }

  async getById<T extends CrudItem>(resource: string, id: string): Promise<CrudResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${resource}/${id}`, {
        headers: this.getHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { data, status: response.status };
      }
    } catch (error) {
      console.warn('API not available, using localStorage fallback');
    }

    // Fallback to localStorage
    const allData = this.getFromStorage<T>(resource);
    const item = allData.find(item => item.id === id);

    if (item) {
      return { data: item, status: 200 };
    } else {
      return { error: 'Item not found', status: 404 };
    }
  }

  async create<T extends CrudItem>(resource: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<CrudResponse<T>> {
    const newItem = {
      ...data,
      id: `${resource}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as T;

    try {
      const response = await fetch(`${this.baseUrl}/${resource}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        const data = await response.json();
        return { data, status: response.status };
      }
    } catch (error) {
      console.warn('API not available, using localStorage fallback');
    }

    // Fallback to localStorage
    const allData = this.getFromStorage<T>(resource);
    allData.push(newItem);
    this.saveToStorage(resource, allData);

    return { data: newItem, status: 201 };
  }

  async update<T extends CrudItem>(resource: string, id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<CrudResponse<T>> {
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${this.baseUrl}/${resource}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const data = await response.json();
        return { data, status: response.status };
      }
    } catch (error) {
      console.warn('API not available, using localStorage fallback');
    }

    // Fallback to localStorage
    const allData = this.getFromStorage<T>(resource);
    const index = allData.findIndex(item => item.id === id);

    if (index !== -1) {
      allData[index] = { ...allData[index], ...updateData };
      this.saveToStorage(resource, allData);
      return { data: allData[index], status: 200 };
    } else {
      return { error: 'Item not found', status: 404 };
    }
  }

  async delete(resource: string, id: string): Promise<CrudResponse<{ message: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/${resource}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (response.ok) {
        return { data: { message: 'Item deleted successfully' }, status: 200 };
      }
    } catch (error) {
      console.warn('API not available, using localStorage fallback');
    }

    // Fallback to localStorage
    const allData = this.getFromStorage(resource);
    const index = allData.findIndex(item => item.id === id);

    if (index !== -1) {
      allData.splice(index, 1);
      this.saveToStorage(resource, allData);
      return { data: { message: 'Item deleted successfully' }, status: 200 };
    } else {
      return { error: 'Item not found', status: 404 };
    }
  }

  // Bulk operations
  async bulkCreate<T extends CrudItem>(resource: string, items: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<CrudResponse<T[]>> {
    const newItems = items.map(item => ({
      ...item,
      id: `${resource}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })) as T[];

    try {
      const response = await fetch(`${this.baseUrl}/${resource}/bulk`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(newItems),
      });

      if (response.ok) {
        const data = await response.json();
        return { data, status: response.status };
      }
    } catch (error) {
      console.warn('API not available, using localStorage fallback');
    }

    // Fallback to localStorage
    const allData = this.getFromStorage<T>(resource);
    allData.push(...newItems);
    this.saveToStorage(resource, allData);

    return { data: newItems, status: 201 };
  }

  async bulkDelete(resource: string, ids: string[]): Promise<CrudResponse<{ message: string; deletedCount: number }>> {
    try {
      const response = await fetch(`${this.baseUrl}/${resource}/bulk`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        body: JSON.stringify({ ids }),
      });

      if (response.ok) {
        const data = await response.json();
        return { data, status: response.status };
      }
    } catch (error) {
      console.warn('API not available, using localStorage fallback');
    }

    // Fallback to localStorage
    const allData = this.getFromStorage(resource);
    const initialCount = allData.length;
    const filteredData = allData.filter(item => !ids.includes(item.id));
    const deletedCount = initialCount - filteredData.length;
    
    this.saveToStorage(resource, filteredData);

    return {
      data: { message: `${deletedCount} items deleted successfully`, deletedCount },
      status: 200
    };
  }
}

export const crudService = new CrudService();
export type { CrudItem, CrudResponse, PaginatedResponse };