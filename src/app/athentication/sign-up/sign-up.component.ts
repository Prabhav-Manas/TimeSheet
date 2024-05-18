import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/appServies/auth.service';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  authForm: any = FormGroup;
  loginMode: boolean = true;
  hide = 'password';
  imagePreview: string = '';
  imageURL: string = '';

  private authStatusSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _authService: AuthService
  ) {
    this.authForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      image: new FormControl('', {
        //For this image validation do not include formControlName in HTML, just go with mime-type.validator.ts
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
  }

  ngOnInit(): void {
    this.authStatusSub = this._authService.getAuthStatusListener().subscribe();
  }

  onModeSwitch() {
    this.router.navigate(['signin']);
  }

  onImagePicked(event: Event) {
    // Here "Event" is a default type provided by Typescript
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.authForm.patchValue({ image: file });
      this.authForm.get('image').updateValueAndValidity();
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.imagePreview = reader.result;
      }
    };
    // reader.readAsDataURL(file)
    if (file instanceof Blob) {
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.authForm.valid) {
      const name = this.authForm.value.name;
      const email = this.authForm.value.email;
      const password = this.authForm.value.password;
      const image = this.authForm.value.image;

      this._authService.signUp(name, email, password, image);
      this.authForm.reset();
    }
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
