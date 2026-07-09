import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RegistrationRequest } from '@app/core/models';
import { RegistrationService } from '@app/core/services/registration.service';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, 
    private http: HttpClient,
    private registrationService: RegistrationService,
     private router: Router
  ) {

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
      console.log(isValid);

      if (isValid) {
              console.log("here");
        this.step = 2;
      } else {
        step1Controls.forEach(c => this.registrationForm.get(c)?.markAsTouched());
      }
    }
  }

  prevStep() {
    this.step = 1;
  }

  submit(): void {

  if (this.registrationForm.invalid) {
    this.registrationForm.markAllAsTouched();
    return;
  }

  const payload: RegistrationRequest = this.registrationForm.value;

  this.registrationService.addUser(payload).subscribe({
    next: (response: any) => {
      console.log('Registration successful', response);

      alert('Registration successful');

      //this.registrationForm.reset();
      //this.step = 1;
      this.router.navigate(['/auth/login']);
    },
    error: (error: any) => {
      console.error('Registration failed', error);

      alert('Registration failed');
    }
  });
}
}