import { useState, useEffect } from 'react';
import { moduleService } from '../services/ModuleService';
import { eventService, APP_EVENTS } from '../services/EventService';
import { AppModule } from '../types';

export const useModule = (moduleId: string) => {
  const [module, setModule] = useState<AppModule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModule = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const loadedModule = await moduleService.loadModule(moduleId);
        setModule(loadedModule);
        
        if (loadedModule?.isLoaded) {
          eventService.emit(APP_EVENTS.MODULE_LOADED, { moduleId }, 'useModule');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load module';
        setError(errorMessage);
        eventService.emit(APP_EVENTS.ERROR_OCCURRED, { moduleId, error: errorMessage }, 'useModule');
      } finally {
        setIsLoading(false);
      }
    };

    loadModule();
  }, [moduleId]);

  const reloadModule = async () => {
    moduleService.unloadModule(moduleId);
    const loadedModule = await moduleService.loadModule(moduleId);
    setModule(loadedModule);
  };

  return {
    module,
    isLoading,
    error,
    reloadModule,
    isLoaded: module?.isLoaded || false,
  };
};

export const useModules = () => {
  const [modules, setModules] = useState<AppModule[]>([]);

  useEffect(() => {
    const updateModules = () => {
      setModules(moduleService.getAllLoadedModules());
    };

    const unsubscribe = eventService.on(APP_EVENTS.MODULE_LOADED, updateModules);
    updateModules(); // Initial load

    return unsubscribe;
  }, []);

  return {
    modules,
    loadedCount: modules.filter(m => m.isLoaded).length,
    totalCount: modules.length,
  };
};