import { AppEvent, EventHandler } from '../types';

class EventService {
  private listeners = new Map<string, Set<EventHandler>>();

  on(eventType: string, handler: EventHandler): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    this.listeners.get(eventType)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(handler);
    };
  }

  emit(eventType: string, payload?: any, source = 'unknown'): void {
    const event: AppEvent = {
      type: eventType,
      payload,
      timestamp: Date.now(),
      source,
    };

    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      });
    }
  }

  off(eventType: string, handler?: EventHandler): void {
    if (!handler) {
      this.listeners.delete(eventType);
    } else {
      this.listeners.get(eventType)?.delete(handler);
    }
  }

  once(eventType: string, handler: EventHandler): void {
    const onceHandler: EventHandler = (event) => {
      handler(event);
      this.off(eventType, onceHandler);
    };

    this.on(eventType, onceHandler);
  }

  clear(): void {
    this.listeners.clear();
  }

  getListenerCount(eventType: string): number {
    return this.listeners.get(eventType)?.size || 0;
  }
}

export const eventService = new EventService();

// Common event types
export const APP_EVENTS = {
  MODULE_LOADED: 'module:loaded',
  MODULE_UNLOADED: 'module:unloaded',
  ROUTE_CHANGED: 'route:changed',
  THEME_CHANGED: 'theme:changed',
  USER_AUTHENTICATED: 'user:authenticated',
  USER_LOGGED_OUT: 'user:logged_out',
  ERROR_OCCURRED: 'error:occurred',
} as const;