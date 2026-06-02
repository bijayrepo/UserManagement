import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { OrganizationService } from '../../../core/services/organization.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Organization, OrganizationMember } from '../../../core/models';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="org-container">
      <nav class="navbar">
        <div class="navbar-brand">
          <a routerLink="/dashboard" class="back-link">← Back to Dashboard</a>
        </div>
      </nav>

      <div class="org-content">
        <div class="page-header">
          <h1>Organization Management</h1>
        </div>

        <!-- Organization Info Tab -->
        <div class="tabs">
          <button
            class="tab-btn"
            [class.active]="activeTab === 'info'"
            (click)="activeTab = 'info'"
          >
            Organization Info
          </button>
          <button
            class="tab-btn"
            [class.active]="activeTab === 'members'"
            (click)="activeTab = 'members'"
          >
            Members
          </button>
        </div>

        <!-- Info Tab Content -->
        <div *ngIf="activeTab === 'info'" class="tab-content">
          <div class="card">
            <h2>Organization Details</h2>
            <form [formGroup]="orgForm" (ngSubmit)="onUpdateOrganization()">
              <div class="form-row">
                <div class="form-group">
                  <label for="orgName">Organization Name</label>
                  <input
                    type="text"
                    id="orgName"
                    formControlName="name"
                    class="form-control"
                  />
                </div>

                <div class="form-group">
                  <label for="orgEmail">Email</label>
                  <input
                    type="email"
                    id="orgEmail"
                    formControlName="email"
                    class="form-control"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    formControlName="phoneNumber"
                    class="form-control"
                  />
                </div>

                <div class="form-group">
                  <label for="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    formControlName="website"
                    class="form-control"
                  />
                </div>
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
                <label for="description">Description</label>
                <textarea
                  id="description"
                  formControlName="description"
                  rows="4"
                  class="form-control"
                ></textarea>
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="orgForm.invalid || isSaving"
                >
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
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

        <!-- Members Tab Content -->
        <div *ngIf="activeTab === 'members'" class="tab-content">
          <div class="card">
            <h2>Organization Members</h2>

            <div class="members-table">
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Role</th>
                    <th>Joined At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let member of members">
                    <td>{{ member.userId }}</td>
                    <td>
                      <span class="role-badge" [ngClass]="'role-' + member.role">
                        {{ member.role | uppercase }}
                      </span>
                    </td>
                    <td>{{ member.joinedAt | date: 'short' }}</td>
                    <td>
                      <button
                        class="btn btn-danger btn-sm"
                        (click)="onRemoveMember(member.id)"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p *ngIf="members.length === 0" class="no-data">
                No members found
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .org-container {
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

    .org-content {
      padding: 30px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 30px;
    }

    .page-header h1 {
      margin: 0;
      color: #333;
    }

    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid #eee;
    }

    .tab-btn {
      padding: 12px 24px;
      background: none;
      border: none;
      font-size: 16px;
      font-weight: 600;
      color: #999;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
    }

    .tab-btn.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .tab-btn:hover:not(.active) {
      color: #666;
    }

    .tab-content {
      animation: fadeIn 0.3s;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .card {
      background-color: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .card h2 {
      margin: 0 0 20px 0;
      color: #333;
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

    .form-actions {
      margin-top: 30px;
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

    .btn-danger {
      background-color: #e74c3c;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c0392b;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .members-table {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background-color: #f9f9f9;
    }

    th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #eee;
    }

    td {
      padding: 15px;
      border-bottom: 1px solid #eee;
    }

    .role-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .role-admin {
      background-color: #ffe5e5;
      color: #c0392b;
    }

    .role-manager {
      background-color: #e5f2ff;
      color: #2980b9;
    }

    .role-user {
      background-color: #e5ffe5;
      color: #27ae60;
    }

    .no-data {
      text-align: center;
      color: #999;
      padding: 30px;
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
      .form-row {
        grid-template-columns: 1fr;
      }

      .tabs {
        flex-direction: column;
      }
    }
  `]
})
export class OrganizationComponent implements OnInit, OnDestroy {
  orgForm!: FormGroup;
  isSaving = false;
  successMessage = '';
  errorMessage = '';
  activeTab: 'info' | 'members' = 'info';
  members: OrganizationMember[] = [];
  private destroy$ = new Subject<void>();
  private organizationId?: string;

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: any) => {
        if (state.user) {
          this.organizationId = state.user.organizationId;
          this.loadOrganization();
          this.loadMembers();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.orgForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      phoneNumber: [''],
      website: [''],
      address: [''],
      city: [''],
      country: [''],
      zipCode: [''],
      description: ['']
    });
  }

  private loadOrganization(): void {
    if (!this.organizationId) return;

    this.organizationService.getOrganization(this.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (org) => {
          this.orgForm.patchValue(org);
        },
        error: (error) => {
          console.error('Failed to load organization:', error);
        }
      });
  }

  private loadMembers(): void {
    if (!this.organizationId) return;

    this.organizationService.getOrganizationMembers(this.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (members) => {
          this.members = members;
        },
        error: (error) => {
          console.error('Failed to load members:', error);
        }
      });
  }

  onUpdateOrganization(): void {
    if (this.orgForm.valid && this.organizationId) {
      this.isSaving = true;
      this.organizationService.updateOrganization(this.organizationId, this.orgForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isSaving = false;
            this.successMessage = 'Organization updated successfully!';
            this.clearMessage();
          },
          error: (error) => {
            this.isSaving = false;
            this.errorMessage = 'Failed to update organization';
            console.error('Update failed:', error);
            this.clearMessage();
          }
        });
    }
  }

  onRemoveMember(memberId: string): void {
    if (this.organizationId && confirm('Are you sure you want to remove this member?')) {
      this.organizationService.removeMember(this.organizationId, memberId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.members = this.members.filter(m => m.id !== memberId);
            this.successMessage = 'Member removed successfully!';
            this.clearMessage();
          },
          error: (error) => {
            this.errorMessage = 'Failed to remove member';
            console.error('Remove failed:', error);
            this.clearMessage();
          }
        });
    }
  }

  private clearMessage(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }
}
