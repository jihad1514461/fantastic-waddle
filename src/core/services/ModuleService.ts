import React from 'react';
import { ModuleConfig, getEnabledModules, getModuleById } from '../../config/modules.config';
import { AppModule, AppRoute } from '../types';

class ModuleService {
  private loadedModules = new Map<string, AppModule>();
  private routes = new Map<string, AppRoute>();

  async loadModule(moduleId: string): Promise<AppModule | null> {
    try {
      const config = getModuleById(moduleId);
      if (!config || !config.enabled) {
        throw new Error(`Module ${moduleId} not found or disabled`);
      }

      if (this.loadedModules.has(moduleId)) {
        return this.loadedModules.get(moduleId)!;
      }

      const component = await this.importModuleComponent(moduleId);

      const module: AppModule = {
        id: moduleId,
        name: config.name,
        component,
        config,
        isLoaded: true,
      };

      this.loadedModules.set(moduleId, module);
      this.registerModuleRoute(module);

      return module;
    } catch (error) {
      console.error(`Failed to load module ${moduleId}:`, error);
      return {
        id: moduleId,
        name: moduleId,
        component: () => null,
        config: {} as ModuleConfig,
        isLoaded: false,
        loadError: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async importModuleComponent(moduleId: string): Promise<React.ComponentType> {
    switch (moduleId) {
      case 'dashboard':
        const { Dashboard } = await import('../../pages/Dashboard');
        return Dashboard;
      case 'flow-editor':
        const { FlowPage } = await import('../../pages/FlowPage');
        return FlowPage;
      case 'data-management':
        const { DataPage } = await import('../../pages/DataPage');
        return DataPage;
      case 'ui-components':
        const { ComponentShowcase } = await import('../../pages/ComponentShowcase');
        return ComponentShowcase;
      case 'settings':
        const { Settings } = await import('../../pages/Settings');
        return Settings;
      case 'story-game':
        const { StoryGamePage } = await import('../../modules/story-game');
        return StoryGamePage;
      default:
        return () =>
          React.createElement(
            "div",
            { className: "flex items-center justify-center h-full" },
            React.createElement(
              "div",
              { className: "text-center" },
              React.createElement(
                "h2",
                { className: "text-2xl font-bold text-gray-900 dark:text-white mb-2" },
                `Module: ${moduleId}`
              ),
              React.createElement(
                "p",
                { className: "text-gray-600 dark:text-gray-400" },
                "This module is not yet implemented."
              )
            )
          );
    }
  }

  private registerModuleRoute(module: AppModule): void {
    const route: AppRoute = {
      path: module.config.path,
      component: module.component,
      moduleId: module.id,
      requiresAuth: true,
      permissions: module.config.permissions,
    };

    this.routes.set(module.config.path, route);
  }

  getLoadedModule(moduleId: string): AppModule | undefined {
    return this.loadedModules.get(moduleId);
  }

  getAllLoadedModules(): AppModule[] {
    return Array.from(this.loadedModules.values());
  }

  getRoute(path: string): AppRoute | undefined {
    return this.routes.get(path);
  }

  getAllRoutes(): AppRoute[] {
    return Array.from(this.routes.values());
  }

  async preloadModules(): Promise<void> {
    const enabledModules = getEnabledModules();
    const loadPromises = enabledModules.map(module => this.loadModule(module.id));

    await Promise.allSettled(loadPromises);
  }

  unloadModule(moduleId: string): void {
    this.loadedModules.delete(moduleId);
    const config = getModuleById(moduleId);
    if (config) {
      this.routes.delete(config.path);
    }
  }

  isModuleLoaded(moduleId: string): boolean {
    return this.loadedModules.has(moduleId) && this.loadedModules.get(moduleId)!.isLoaded;
  }
}

export const moduleService = new ModuleService();
