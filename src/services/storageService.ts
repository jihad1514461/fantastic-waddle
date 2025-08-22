class StorageService {
  private prefix = 'app_';

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(
        `${this.prefix}${key}`,
        JSON.stringify(value)
      );
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`${this.prefix}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(`${this.prefix}${key}`);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  clear(): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
}

export const storageService = new StorageService();