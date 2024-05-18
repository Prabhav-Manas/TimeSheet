import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../appServies/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  profileImageURL: any = '';
  userIsAuthenticated: boolean = false;
  private authListenerSub!: Subscription;

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this.authListenerSub = this._authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy(): void {}

  onLogout() {
    this._authService.logOut();
  }
}
