import {singleton} from "tsyringe";
import {BehaviorSubject, Observable} from "rxjs";

import {Pages} from "../interfaces/pages.interface";
import {Tree} from "../interfaces/tree.interface";
import {Person} from "../components/canvas/types";

@singleton()
export class ApplicationService {
    private currentPage: BehaviorSubject<Pages> = new BehaviorSubject<Pages>(Pages.Authentication);
    public currentPage$: Observable<Pages> = this.currentPage.asObservable();
    get CurrentPage(): Pages { return this.currentPage.getValue(); }
    public setCurrentPage(page: Pages): void { this.currentPage.next(page); }

    private trees: BehaviorSubject<Tree[]> = new BehaviorSubject<Tree[]>([] as Tree[]);
    public trees$: Observable<Tree[]> = this.trees.asObservable();

    private currentTree: BehaviorSubject<Tree> = new BehaviorSubject<Tree>({} as Tree);
    public currentTree$: Observable<Tree> = this.currentTree.asObservable();

    private originalPeople: BehaviorSubject<Person[]> = new BehaviorSubject<Person[]>([] as Person[]);
    public originalPeople$: Observable<Person[]> = this.originalPeople.asObservable();

    private BearerToken?: string;
    public setBearerToken(token?: string): void { this.BearerToken = token; }

    constructor() {
        /* People */
        // @ts-ignore
        window.people.listen((data: any): void => {
            this.peopleCallback(
                data.action,
                data.response
            );
        });

        /* Trees */
        // @ts-ignore
        window.trees.listen((data: any): void => {
            this.treesCallback(
                data.action,
                data.response
            );
        });
    }

    /* People */
    private peopleCallback = (action: string, response: any): void => {
        switch (action) {
            case 'getPeopleForTree':
                this.originalPeople.next(response.data as Person[]);
                break;
            case 'addPeople':
                this.getTrees();
                break;
            case 'addressAdded':
                this.getTrees();
                break;
            case 'deletePeople':
                this.getTrees();
                break;
            case 'addressDeleted':
                this.getTrees();
                break;

            default:
                break;
        }
    }
    private getPeopleForTree = (treeId: number): void => {
        // @ts-ignore
        window.people.getPeopleForTree(this.BearerToken, treeId);
        console.log(this.BearerToken);
    }

    /* Trees */
    private treesCallback = (action: string, response: any): void => {
        switch (action) {
            case 'getTrees':
                this.trees.next(response.data as Tree[]);
                break;
            default:
                break;
        }
    }
    public getTrees(): void {
        // @ts-ignore
        window.trees.getTrees(this.BearerToken);
    }
    public createTree(title: string): void {
        // @ts-ignore
        window.trees.createTree(this.BearerToken, title);

        setTimeout((): void => {
            this.getTrees();
        }, 100);
    }
    public deleteTree(treeId?: number): void {
        let treeIdentifier: number = treeId ?? this.currentTree.getValue().id;

        if(confirm('Are you sure you want to delete this tree?')) {
            // @ts-ignore
            window.trees.deleteTree(this.BearerToken, treeIdentifier);

            setTimeout((): void => {
                // @ts-ignore
                window.trees.getTrees(this.BearerToken);
            }, 100);
        }
    }
    public saveTree(data: string, deletePeople: Person[], addPeople: Person[]): void {
        // @ts-ignore
        window.trees.updateTree(this.BearerToken, this.currentTree.getValue().id, data);

        if(addPeople.length !== 0) {
            // @ts-ignore
            window.people.addPeople(this.BearerToken, addPeople); // Add people to database
        }

        if(deletePeople.length !== 0) {
            // @ts-ignore
            window.people.deletePeople(this.BearerToken, deletePeople); // Remove people from database
        }

        this.getPeopleForTree(this.currentTree.getValue().id);
    }

    public openEditor(treeIdentifier: number): void {
        const trees: Tree[] = this.trees.getValue();

        let tree: Tree | undefined = trees.find((tree: Tree): boolean => tree.id === treeIdentifier);
        if(tree) {
            this.currentTree.next(tree);

            this.getPeopleForTree(treeIdentifier);

            this.setCurrentPage(Pages.Editor);
        } else {
            console.error(`Could not find tree with this ID: ${treeIdentifier}\nDebug data: ${trees}`);
        }
    }
}