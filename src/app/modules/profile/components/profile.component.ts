import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import { ProfileService } from "../services/profile.service";
import { AuthService } from "../../../core/services/auth.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { User, UserProfile } from "../../../core/models";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  isSaving = false;
  successMessage = "";
  errorMessage = "";
  profilePhotoPreview: string | null = null;
  private destroy$ = new Subject<void>();
  private currentUserId?: string;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.authService.authState$.pipe(takeUntil(this.destroy$)).subscribe((state: any) => {
      if (state) {
        this.currentUserId = state.user.user_id;
        console.log(state.user.user_id);
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
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      email: [{ value: "", disabled: true }],
      phone_number: [""],
      city: [""],
      state: [""],
      country: [""],
      address: [""],
      postal_code: [""],
      Bio: [""],
      date_of_birth: [""],
      gender: [""],
    });
  }

  private loadUserProfile(): void {
    if (!this.currentUserId) return;

    this.profileService
      .getUserProfile(this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.profileForm.patchValue(profile);
          if (profile.profilePhoto) {
            this.profilePhotoPreview = profile.profilePhoto;
          }
        },
        error: (error) => {
          console.error("Failed to load profile:", error);
        },
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
      this.profileService
        .uploadProfilePhoto(this.currentUserId, file)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isSaving = false;
            this.successMessage = "Photo uploaded successfully!";
            this.clearMessage();
          },
          error: (error) => {
            this.isSaving = false;
            this.errorMessage = "Failed to upload photo";
            console.error("Upload failed:", error);
            this.clearMessage();
          },
        });
    }
  }

  onUpdateProfile(): void {
    if (this.profileForm.valid && this.currentUserId) {
      this.isSaving = true;
      this.profileService
        .updateUserProfile(this.currentUserId, this.profileForm.getRawValue())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isSaving = false;
            this.successMessage = "Profile updated successfully!";
            this.clearMessage();
          },
          error: (error) => {
            this.isSaving = false;
            this.errorMessage = "Failed to update profile";
            console.error("Update failed:", error);
            this.clearMessage();
          },
        });
    }
  }

  onCancel(): void {
    this.router.navigate(["/dashboard"]);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private clearMessage(): void {
    setTimeout(() => {
      this.successMessage = "";
      this.errorMessage = "";
    }, 3000);
  }
}
