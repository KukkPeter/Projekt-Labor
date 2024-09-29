import { BehaviorSubject, Observable } from "rxjs";
import { singleton } from "tsyringe";

@singleton()
export class AuthService {
    private authenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public authenticated$: Observable<boolean> = this.authenticated.asObservable();

    public login(username: string, password: string): void {
        // Ha sikeres a bejelentkezés       ->      this.authenticated.next(true);
        // Ha sikertelen a bejelentkezés    ->      this.authenticated.next(false);
        this.authenticated.next(true);
    }

    public register(username: string, email: string, password: string): void {

    }

    public logout(): void {
        this.authenticated.next(false);
    }
}