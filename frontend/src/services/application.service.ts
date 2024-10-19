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

    private BearerToken?: string;
    public setBearerToken(token?: string): void { this.BearerToken = token; }

    constructor() {
        // @ts-ignore
        window.trees.listen(data => {
            this.treesCallback(
                data.action,
                data.response
            );
        });
    }

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
    }
    public deleteTree(treeId: number): void {
        // @ts-ignore
        window.trees.deleteTree(this.BearerToken, treeId);

        setTimeout((): void => {
            // @ts-ignore
            window.trees.getTrees(this.BearerToken);
        }, 100);
    }

    public openEditor(treeIdentifier: number): void {
        // TODO: get tree details from database
        console.debug('###', treeIdentifier);

        // Redirect to 'Editor' page
        this.setCurrentPage(Pages.Editor);
    }
}