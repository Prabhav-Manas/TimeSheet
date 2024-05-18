import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validator,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/appServies/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit, OnDestroy {
  authForm: any = FormGroup;
  loginMode: boolean = true;
  hide = 'password';

  private authStatusSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _authService: AuthService
  ) {
    this.authForm = this.fb.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.authStatusSub = this._authService.getAuthStatusListener().subscribe();
  }

  onModeSwitch() {
    this.router.navigate(['signup']);
  }

  onSubmit() {
    if (this.authForm.valid) {
      // const authFormData = {
      const email = this.authForm.value.email;
      const password = this.authForm.value.password;
      // };
      // console.log(authFormData);
      this._authService.signIn(email, password);
    }
    this.authForm.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
