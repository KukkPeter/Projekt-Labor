import { BehaviorSubject, Observable } from "rxjs";
import { singleton } from "tsyringe";

import { User } from "../interfaces/user.interface";
import {toast} from "solid-toast";

@singleton()
export class AuthService {
    private authenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public authenticated$: Observable<boolean> = this.authenticated.asObservable();

    private user: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);
    public user$: Observable<User> = this.user.asObservable();
    get User(): User { return this.user.getValue(); }

    private bearerToken?: string;

    private toastId?: string;

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

                    toast.success(response.message, {
                        id: this.toastId
                    });
                } else {
                    toast.error(response.data, {
                        id: this.toastId
                    });
                }
                break;
            case 'register':
                if(response.status === 200) {
                    toast.success(response.message, {
                        id: this.toastId
                    });
                } else {
                    toast.error(response.data, {
                        id: this.toastId
                    });
                }
                break;
            case 'logout':
                if(response.status === 200) {
                    this.authenticated.next(false);
                    this.bearerToken = undefined;
                    this.user.next({} as User);

                    toast.success(response.message, {
                        id: this.toastId
                    });
                } else {
                    toast.error(response.data, {
                        id: this.toastId
                    });
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
        this.toastId = toast.loading('Logging in...');

        setTimeout((): void => {
            // @ts-ignore
            window.authentication.login(username, password);
        }, 250);
    }

    public register(username: string, email: string, password: string, passwordAgain: string): void {
        this.toastId = toast.loading('Registering...');

        setTimeout((): void => {
            // @ts-ignore
            window.authentication.register(email, username, password, passwordAgain);
        }, 250);
    }

    public logout(): void {
        this.toastId = toast.loading('Logging out...');

        setTimeout((): void => {
            // @ts-ignore
            window.authentication.logout(this.bearerToken);
        }, 250);
    }
}