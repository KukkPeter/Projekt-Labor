import { BehaviorSubject, Observable } from "rxjs";
import { singleton } from "tsyringe";

import { User } from "../interfaces/user.interface";

@singleton()
export class AuthService {
    private authenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public authenticated$: Observable<boolean> = this.authenticated.asObservable();

    private user: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);
    public user$: Observable<User> = this.user.asObservable();
    get User(): User { return this.user.getValue(); }

    private bearerToken?: string;

    constructor() {
        // @ts-ignore
        window.authentication.listen(data => {
            this.authenticationCallback(
                data.action,
                data.response
            );
        });
    }

    private authenticationCallback = (action: string, response: any): void => {
        switch(action) {
            case 'login':
                if(response.status === 200) {
                    this.authenticated.next(true);
                    this.bearerToken = response.data;

                    // @ts-ignore
                    window.authentication.getMyself(this.bearerToken);
                }
                break;
            case 'register':
                if(response.status === 200) {
                    // TODO: Redirect to login page
                }
                break;
            case 'logout':
                if(response.status === 200) {
                    this.authenticated.next(false);
                    this.bearerToken = undefined;
                    this.user.next({} as User);
                }
                break;
            case 'myself':
                if(response.status === 200) {
                    this.authenticated.next(true);
                    this.user.next(response.data as User);
                }
                break;
            default:
                break;
        }
    }

    public login(username: string, password: string): void {
        // @ts-ignore
        window.authentication.login(username, password);
    }

    public register(username: string, email: string, password: string, passwordAgain: string): void {
        // @ts-ignore
        window.authentication.register(email, username, password, passwordAgain);
    }

    public logout(): void {
        // @ts-ignore
        window.authentication.logout(this.bearerToken);
    }
}