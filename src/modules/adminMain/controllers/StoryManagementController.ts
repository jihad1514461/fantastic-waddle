import { apiService } from '../../../services/apiService';
import { Story, StoryNode, StoryChoice } from '../types/story.types';

const LOCAL_STORAGE_KEY = 'stories_local';

const saveToLocal = (stories: Story[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stories));
};

const loadFromLocal = (): Story[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const storyApi = {
  async list(): Promise<Story[]> {
    try {
      const res = await apiService.get<Story[]>('/stories');
      if (res.status === 200 && Array.isArray(res.data)) {
        saveToLocal(res.data);
        return res.data;
      }
      throw new Error(res.error || 'Failed to load stories');
    } catch (err) {
      // fallback to local storage
      console.warn('API failed, loading stories from localStorage', err);
      return loadFromLocal();
    }
  },

  async create(payload: { name: string; description?: string }): Promise<Story> {
    try {
      const res = await apiService.post<Story>('/stories', payload);
      if (res.status === 201 && res.data) {
        const stories = loadFromLocal();
        saveToLocal([...stories, res.data]);
        return res.data;
      }
      throw new Error(res.error || 'Failed to create story');
    } catch (err) {
      console.warn('API create failed, storing story locally', err);
      const stories = loadFromLocal();
      const localStory: Story = {
        id: `local-${Date.now()}`,
        name: payload.name,
        description: payload.description || '',
        nodes: [],
      };
      saveToLocal([...stories, localStory]);
      return localStory;
    }
  },

  async addNode(storyId: string, node: Partial<StoryNode>): Promise<StoryNode> {
    try {
      const res = await apiService.post<StoryNode>(`/stories/${storyId}/nodes`, node);
      if (res.status === 201 && res.data) {
        // update local storage
        const stories = loadFromLocal().map(s =>
          s.id === storyId ? { ...s, nodes: [...(s.nodes || []), res.data!] } : s
        );
        saveToLocal(stories);
        return res.data;
      }
      throw new Error(res.error || 'Failed to add node');
    } catch (err) {
      console.warn('API addNode failed, storing node locally', err);
      const stories = loadFromLocal();
      const story = stories.find(s => s.id === storyId);
      if (!story) throw err;
      const localNode: StoryNode = {
        id: `local-${Date.now()}`,
        type: node.type || 'script',
        data: { title: node.data?.title || 'Untitled', description: node.data?.description },
        choices: [],
        position: node.position || { x: 0, y: 0 },
      };
      story.nodes = [...(story.nodes || []), localNode];
      saveToLocal(stories);
      return localNode;
    }
  },

  async updateNode(storyId: string, nodeId: string, updates: Partial<StoryNode>): Promise<StoryNode> {
    try {
      const res = await apiService.put<StoryNode>(`/stories/${storyId}/nodes/${nodeId}`, updates);
      if (res.status === 200 && res.data) {
        const stories = loadFromLocal().map(s =>
          s.id === storyId
            ? { ...s, nodes: s.nodes.map(n => (n.id === nodeId ? res.data! : n)) }
            : s
        );
        saveToLocal(stories);
        return res.data;
      }
      throw new Error(res.error || 'Failed to update node');
    } catch (err) {
      console.warn('API updateNode failed, updating node locally', err);
      const stories = loadFromLocal();
      const story = stories.find(s => s.id === storyId);
      if (!story) throw err;
      story.nodes = story.nodes.map(n =>
        n.id === nodeId ? { ...n, ...updates, data: { ...n.data, ...updates.data } } : n
      );
      saveToLocal(stories);
      return story.nodes.find(n => n.id === nodeId)!;
    }
  },

  async deleteNode(storyId: string, nodeId: string): Promise<void> {
    try {
      const res = await apiService.delete<void>(`/stories/${storyId}/nodes/${nodeId}`);
      if (res.status === 200 || res.status === 204) {
        const stories = loadFromLocal().map(s =>
          s.id === storyId ? { ...s, nodes: s.nodes.filter(n => n.id !== nodeId) } : s
        );
        saveToLocal(stories);
        return;
      }
      throw new Error(res.error || 'Failed to delete node');
    } catch (err) {
      console.warn('API deleteNode failed, deleting node locally', err);
      const stories = loadFromLocal();
      const story = stories.find(s => s.id === storyId);
      if (!story) throw err;
      story.nodes = story.nodes.filter(n => n.id !== nodeId);
      saveToLocal(stories);
    }
  },

  async updateChoices(storyId: string, nodeId: string, choices: StoryChoice[]): Promise<StoryNode> {
    try {
      const res = await apiService.put<StoryNode>(`/stories/${storyId}/nodes/${nodeId}/choices`, { choices });
      if (res.status === 200 && res.data) {
        const stories = loadFromLocal().map(s =>
          s.id === storyId
            ? { ...s, nodes: s.nodes.map(n => (n.id === nodeId ? res.data! : n)) }
            : s
        );
        saveToLocal(stories);
        return res.data;
      }
      throw new Error(res.error || 'Failed to update choices');
    } catch (err) {
      console.warn('API updateChoices failed, updating locally', err);
      const stories = loadFromLocal();
      const story = stories.find(s => s.id === storyId);
      if (!story) throw err;
      story.nodes = story.nodes.map(n =>
        n.id === nodeId ? { ...n, choices } : n
      );
      saveToLocal(stories);
      return story.nodes.find(n => n.id === nodeId)!;
    }
  },
};
