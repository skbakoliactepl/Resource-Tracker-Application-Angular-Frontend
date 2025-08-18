import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputsModule, ButtonsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usernameOrEmail = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService
      .login({ usernameOrEmail: this.usernameOrEmail, password: this.password })
      .subscribe({
        next: () => {
          this.errorMessage = '';
          this.router.navigate(['/app']);
        },
        error: () => {
          this.errorMessage = 'Invalid username or password';
        },
      });
  }
}
