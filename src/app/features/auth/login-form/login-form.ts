import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.html'
})
export class LoginForm {
  @Input() loginForm!: FormGroup;
  @Input() errorMensaje: string = '';
  @Output() enviarLogin = new EventEmitter<void>();
}