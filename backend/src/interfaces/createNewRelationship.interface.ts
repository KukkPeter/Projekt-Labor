export interface CreateNewRelationship {
    person1Id: number;
    person2Id: number;
    type: 'parent' | 'sibling' | 'child' | 'spouse';
}