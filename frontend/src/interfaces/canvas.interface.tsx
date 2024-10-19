export interface Node {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface NodeWithPerson extends Node {
    person: Person;
}

export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    nickName: string;
    title: string;
    gender: 'male' | 'female' | null;
    birthDate: string;
    deathDate: string | null;
    description: string;
    treeId: number;
    createdAt: string;
    updatedAt: string;
    addresses: Address[] | null;
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

export interface Relationships {
    person1Id: number;
    person2Id: number;
    type: RelationTypes;
    createdAt: string;
    updatedAt: string;
}

export enum RelationTypes {
    parent = 'parent',
    sibling = 'sibling',
    child = 'child',
    spouse = 'spouse'
}