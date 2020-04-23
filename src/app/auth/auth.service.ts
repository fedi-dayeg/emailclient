import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {tap} from 'rxjs/operators';

interface UsernameAvailableResponse {
  available: boolean;
}

interface SignupCresentials {
  username: string;
  password: string;
  passwordConfirmation: string;
}

interface SignupResponce {
  username: string;
}

interface SignedinResponse {
  authenticated: boolean;
  username: string;
}

interface SinginCredential {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  rooturl = 'https://api.angular-email.com';
  signedin$ = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
  }

  usernameAvailable(username: string) {
    return this.http.post<UsernameAvailableResponse>(this.rooturl + '/auth/username', {
      username
    });
  }

  signup(credentials: SignupCresentials) {
    return this.http.post<SignupResponce>(this.rooturl + '/auth/signup', credentials)
      .pipe(tap(() => {
          this.signedin$.next(true);
        })
      );
  }

  checkAuth() {
    return this.http.get<SignedinResponse>(this.rooturl + '/auth/signedin')
      .pipe(tap(({authenticated}) => {
        this.signedin$.next(authenticated);
      }));
  }

  signout() {
    return this.http.post(this.rooturl + '/auth/signout', {}).pipe(tap(() => {
      this.signedin$.next(false);
    }));
  }

  signin(creadentials: SinginCredential) {
    return this.http.post(this.rooturl + '/auth/signin', creadentials)
      .pipe(tap(() => {
        this.signedin$.next(true);
      }));
  }
}
