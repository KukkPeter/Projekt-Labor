export interface TreeNode {
  id: any;
  name: string;
  x: number;
  y: number;
}

export interface TreeEdge {
  id: string;
  parentId: any;
  childId: any;
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

export interface Person {
  id: any;
  firstName: string;
  lastName: string;
  nickName?: string;
  title?: string;
  gender: 'male' | 'female' | null;
  birthDate: string;
  deathDate?: string | null;
  description?: string;
  treeId: number;
  createdAt: string;
  updatedAt: string;
  addresses?: Address[] | null;
}

export interface Address {
  id: number;
  personId: number;
  addressType: 'residence' | 'birth' | 'death';
  country: string;
  postalCode: string;
  city: string;
  street: string;
  door: string;
  createdAt: string;
  updatedAt: string;
}