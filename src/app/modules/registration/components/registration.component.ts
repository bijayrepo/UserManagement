import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone:true,
  selector: 'app-registration',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

  step = 1;

  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {

    this.registrationForm = this.fb.group({
      // Step 1
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postal_code: ['', Validators.required],

      // Step 2
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  nextStep() {
    if (this.step === 1) {
      const step1Controls = [
        'first_name', 'last_name', 'phone_number', 'date_of_birth',
        'gender', 'address', 'city', 'state', 'country', 'postal_code'
      ];

      const isValid = step1Controls.every(c => this.registrationForm.get(c)?.valid);

      if (isValid) {
        this.step = 2;
      } else {
        step1Controls.forEach(c => this.registrationForm.get(c)?.markAsTouched());
      }
    }
  }

  prevStep() {
    this.step = 1;
  }

  submit() {
    if (this.registrationForm.valid) {
      const payload = this.registrationForm.value;

      this.http.post('https://your-api-url.com/register', payload)
        .subscribe({
          next: res => {
            console.log('Success', res);
            alert('Registration successful');
          },
          error: err => {
            console.error(err);
            alert('Registration failed');
          }
        });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }
}