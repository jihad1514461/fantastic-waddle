export type StoryNodeType = 'intro' | 'script' | 'end';

export interface StoryChoice {
  id: string;
  name: string;          // the text shown for the choice
  nextTitle: string;     // the next node's title (can be free text)
  nextNodeId?: string;   // optional: resolved link to a node
}

export interface StoryNode {
  id: string;
  type: StoryNodeType;
  position: { x: number; y: number };
  data: {
    title: string;
    description?: string;
  };
  choices: StoryChoice[]; // 0..N
}

export interface Story {
  id: string;
  name: string;
  description?: string;
  nodes: StoryNode[];

}
