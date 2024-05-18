import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from '../athentication/auth-data.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = '';
  private isAutheticated: boolean = false;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer!: any;

  constructor(private http: HttpClient, private router: Router) {}
  getAuthToken() {
    console.log('AuthTokenVal:=>', this.token);
    return this.token;
  }

  getIsAuth() {
    return this.isAutheticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  signUp(name: string, email: string, password: string, image: File) {
    const authData = new FormData();
    authData.append('name', name);
    authData.append('email', email);
    authData.append('password', password);
    authData.append('image', image);
    // const authData: AuthData = {
    //   name: name,
    //   email: email,
    //   password: password,
    //   image: image,
    // };
    return this.http
      .post('http://localhost:3000/api/users/signup', authData)
      .subscribe(
        (res: any) => {
          this.router.navigate(['/dashboard']);
        },
        (err: any) => {
          this.authStatusListener.next(false);
          alert('Something went wrong! 😒');
        }
      );
  }

  signIn(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    return this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/users/login',
        authData
      )
      .subscribe(
        (res) => {
          this.token = res.token;
          if (this.token) {
            const expiresInDuration = res.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAutheticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(this.token, expirationDate);
            this.router.navigate(['/dashboard']);
          }
          console.log(this.token);
          console.log(this.autoAuthData());
        },
        (err) => {
          console.log(err);
          alert('Invalid User! Please Sign up.');
        }
      );
  }

  autoAuthData() {
    const authInformation = this.getAuthData();
    console.log('authInformation', authInformation);
    if (authInformation) {
      const now = new Date();
      const expiresIn =
        authInformation.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = authInformation!.authToken;
        this.isAutheticated = true;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    }
  }

  logOut() {
    this.token = '';
    this.isAutheticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/signin']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting Timer:=>', +duration);
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', this.token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const authToken = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!authToken || !expirationDate) {
      return;
    } else {
      return {
        authToken: authToken,
        expirationDate: new Date(expirationDate),
      };
    }
  }
}
