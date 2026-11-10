import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-form.html'
})
export class RegisterForm {
  @Input() registerForm!: FormGroup;
  @Input() loading: boolean = false;
  @Output() enviarRegistro = new EventEmitter<void>();
  @Output() archivoSeleccionado = new EventEmitter<any>();
}