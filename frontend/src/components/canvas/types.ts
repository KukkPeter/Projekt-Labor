// types.ts
export interface NodeDetails {
  birthDate: string;
  birthPlace: string;
  occupation: string;
  notes: string;
  [key: string]: string; // Allow for additional custom fields
}

export interface TreeNode {
  id: number;
  name: string;
  x: number;
  y: number;
  details: NodeDetails;
}

export interface TreeEdge {
  id: number;
  parentId: number;
  childId: number;
  type: RelationType;
}

export type RelationType = 'parent' | 'spouse' | 'sibling';

export interface Position {
  x: number;
  y: number;
}

export interface Theme {
  nodeColor: string;
  selectedColor: string;
  highlightColor: string;
  edgeColor: string;
  backgroundColor: string;
  textColor: string;
  gridColor: string;
}