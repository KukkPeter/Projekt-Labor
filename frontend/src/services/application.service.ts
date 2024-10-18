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

    constructor() { }

    public async getTrees(): Promise<Tree[]> {
        // TODO: get trees from database
        return new Promise((resolve, reject): void => {
           resolve([
               {
                   id: "test_id_00",
                   name: "Test Family tree #00",
                   lastModified: "Yesterday"
               },
               {
                   id: "test_id_01",
                   name: "Test Family tree #01",
                   lastModified: "Yesterday"
               }
           ])
        });
    }

    public openEditor(treeIdentifier: string): void {
        // TODO: get tree details from database
        console.debug('###', treeIdentifier);

        // Redirect to 'Editor' page
        this.setCurrentPage(Pages.Editor);
    }
}