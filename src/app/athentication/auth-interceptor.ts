import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../appServies/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this._authService.getAuthToken();
    console.log(authToken);
    if (authToken) {
      const authRequest = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authToken),
      });
      return next.handle(authRequest);
    } else {
      return next.handle(req);
    }
  }
}
