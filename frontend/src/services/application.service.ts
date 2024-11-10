import { singleton } from "tsyringe";
import {BehaviorSubject, Observable} from "rxjs";

import { Pages } from "../interfaces/pages.interface";
import { Tree } from "../interfaces/tree.interface";

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

    private BearerToken?: string;
    public setBearerToken(token?: string): void { this.BearerToken = token; }

    constructor() {
        /* Trees */
        // @ts-ignore
        window.trees.listen((data: any): void => {
            this.treesCallback(
                data.action,
                data.response
            );
        });
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
    public deleteTree(treeId: number): void {
        if(confirm('Are you sure you want to delete this tree?')) {
            // @ts-ignore
            window.trees.deleteTree(this.BearerToken, treeId);

            setTimeout((): void => {
                // @ts-ignore
                window.trees.getTrees(this.BearerToken);
            }, 100);
        }
    }

    public openEditor(treeIdentifier: number): void {
        const trees = this.trees.getValue();

        let tree = trees.find((tree: Tree): boolean => tree.id === treeIdentifier);
        if(tree) {
            this.currentTree.next(tree);
        } else {
            console.error(`Could not find tree with this ID: ${treeIdentifier}\nDebug data: ${trees}`);
        }

        // Redirect to 'Editor' page
        this.setCurrentPage(Pages.Editor);
    }
}