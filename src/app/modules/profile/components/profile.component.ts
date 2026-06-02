import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="profile-container">
      <nav class="navbar">
        <div class="navbar-brand">
          <a routerLink="/dashboard" class="back-link">← Back to Dashboard</a>
        </div>
      </nav>

      <div class="profile-content">
        <div class="profile-header">
          <h1>My Profile</h1>
        </div>

        <div class="profile-grid">
          <!-- Photo Upload Section -->
          <div class="photo-section">
            <div class="photo-container">
              <img
                [src]="profilePhotoPreview || 'https://via.placeholder.com/150'"
                alt="Profile Photo"
                class="profile-photo"
              />
            </div>
            <div class="photo-actions">
              <input
                type="file"
                #photoInput
                (change)="onPhotoSelected($event)"
                accept="image/*"
                class="hidden-input"
              />
              <button (click)="photoInput.click()" class="btn btn-secondary">
                Change Photo
              </button>
              <p class="photo-info">JPG, PNG up to 5MB</p>
            </div>
          </div>

          <!-- Profile Form Section -->
          <div class="form-section">
            <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    formControlName="firstName"
                    class="form-control"
                  />
                  <small class="error" *ngIf="isFieldInvalid('firstName')">
                    First name is required
                  </small>
                </div>

                <div class="form-group">
                  <label for="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    formControlName="lastName"
                    class="form-control"
                  />
                  <small class="error" *ngIf="isFieldInvalid('lastName')">
                    Last name is required
                  </small>
                </div>
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  formControlName="email"
                  class="form-control"
                  disabled
                />
              </div>

              <div class="form-group">
                <label for="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  formControlName="phoneNumber"
                  placeholder="+1 (555) 123-4567"
                  class="form-control"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="city">City</label>
                  <input
                    type="text"
                    id="city"
                    formControlName="city"
                    class="form-control"
                  />
                </div>

                <div class="form-group">
                  <label for="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    formControlName="country"
                    class="form-control"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="address">Address</label>
                <input
                  type="text"
                  id="address"
                  formControlName="address"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="zipCode">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  formControlName="zipCode"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="bio">Bio</label>
                <textarea
                  id="bio"
                  formControlName="bio"
                  rows="4"
                  placeholder="Tell us about yourself..."
                  class="form-control"
                ></textarea>
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="profileForm.invalid || isSaving"
                >
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  (click)="onCancel()"
                >
                  Cancel
                </button>
              </div>

              <div *ngIf="successMessage" class="success-message">
                {{ successMessage }}
              </div>

              <div *ngIf="errorMessage" class="error-message">
                {{ errorMessage }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .navbar {
      background-color: #667eea;
      color: white;
      padding: 20px 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .back-link {
      color: white;
      text-decoration: none;
      transition: opacity 0.3s;
    }

    .back-link:hover {
      opacity: 0.8;
    }

    .profile-content {
      padding: 30px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .profile-header {
      margin-bottom: 30px;
    }

    .profile-header h1 {
      margin: 0;
      color: #333;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 30px;
      background-color: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .photo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .photo-container {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid #667eea;
    }

    .profile-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-actions {
      text-align: center;
    }

    .hidden-input {
      display: none;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #5568d3;
    }

    .btn-secondary {
      background-color: #ecf0f1;
      color: #333;
    }

    .btn-secondary:hover {
      background-color: #bdc3c7;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .photo-info {
      margin: 10px 0 0 0;
      font-size: 12px;
      color: #999;
    }

    .form-section {
      display: flex;
      flex-direction: column;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 5px rgba(102, 126, 234, 0.1);
    }

    textarea.form-control {
      resize: vertical;
    }

    .error {
      display: block;
      color: #e74c3c;
      font-size: 12px;
      margin-top: 5px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 30px;
    }

    .success-message {
      margin-top: 15px;
      padding: 12px;
      background-color: #d5f4e6;
      color: #27ae60;
      border-radius: 5px;
      text-align: center;
    }

    .error-message {
      margin-top: 15px;
      padding: 12px;
      background-color: #fadbd8;
      color: #c0392b;
      border-radius: 5px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  isSaving = false;
  successMessage = '';
  errorMessage = '';
  profilePhotoPreview: string | null = null;
  private destroy$ = new Subject<void>();
  private currentUserId?: string;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state.user) {
          this.currentUserId = state.user.id;
          this.loadUserProfile();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', { value: '', disabled: true }],
      phoneNumber: [''],
      city: [''],
      country: [''],
      address: [''],
      zipCode: [''],
      bio: ['']
    });
  }

  private loadUserProfile(): void {
    if (!this.currentUserId) return;

    this.profileService.getUserProfile(this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.profileForm.patchValue(profile);
          if (profile.profilePhoto) {
            this.profilePhotoPreview = profile.profilePhoto;
          }
        },
        error: (error) => {
          console.error('Failed to load profile:', error);
        }
      });
  }

  onPhotoSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file && this.currentUserId) {
      // Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePhotoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Upload
      this.isSaving = true;
      this.profileService.uploadProfilePhoto(this.currentUserId, file)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isSaving = false;
            this.successMessage = 'Photo uploaded successfully!';
            this.clearMessage();
          },
          error: (error) => {
            this.isSaving = false;
            this.errorMessage = 'Failed to upload photo';
            console.error('Upload failed:', error);
            this.clearMessage();
          }
        });
    }
  }

  onUpdateProfile(): void {
    if (this.profileForm.valid && this.currentUserId) {
      this.isSaving = true;
      this.profileService.updateUserProfile(this.currentUserId, this.profileForm.getRawValue())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isSaving = false;
            this.successMessage = 'Profile updated successfully!';
            this.clearMessage();
          },
          error: (error) => {
            this.isSaving = false;
            this.errorMessage = 'Failed to update profile';
            console.error('Update failed:', error);
            this.clearMessage();
          }
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private clearMessage(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }
}
