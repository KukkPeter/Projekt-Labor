export interface CreateNewPerson {
    firstName: string;
    lastName: string;
    nickName: string;
    title: string;
    gender: 'male' | 'female' | null;
    birthDate: Date;
    deathDate: Date| null;
    description: string;
    treeId: number;
}