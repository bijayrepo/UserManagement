import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <nav class="navbar">
        <div class="navbar-brand">
          <h2>Dashboard</h2>
        </div>
        <div class="navbar-menu">
          <a routerLink="/profile" class="nav-link">Profile</a>
          <a routerLink="/organization" class="nav-link">Organization</a>
          <button (click)="onLogout()" class="btn btn-logout">Logout</button>
        </div>
      </nav>

      <div class="dashboard-content">
        <div class="welcome-section">
          <h1>Welcome, {{ currentUser?.firstName }}!</h1>
          <p>Organization: {{ currentUser?.organizationId }}</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <h3>Profile Status</h3>
            <p class="stat-value">Active</p>
            <a routerLink="/profile" class="stat-link">Edit Profile →</a>
          </div>

          <div class="stat-card">
            <h3>Organization</h3>
            <p class="stat-value">{{ currentUser?.organizationId }}</p>
            <a routerLink="/organization" class="stat-link">View Organization →</a>
          </div>

          <div class="stat-card">
            <h3>Role</h3>
            <p class="stat-value">{{ currentUser?.role | uppercase }}</p>
            <a href="#" class="stat-link">View Permissions →</a>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-grid">
            <button (click)="navigateTo('/profile')" class="action-btn">
              <span class="icon">👤</span>
              <span>Update Profile</span>
            </button>
            <button (click)="navigateTo('/profile')" class="action-btn">
              <span class="icon">📸</span>
              <span>Change Photo</span>
            </button>
            <button (click)="navigateTo('/organization')" class="action-btn">
              <span class="icon">🏢</span>
              <span>Organization</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #667eea;
      color: white;
      padding: 20px 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .navbar-brand h2 {
      margin: 0;
    }

    .navbar-menu {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      transition: opacity 0.3s;
    }

    .nav-link:hover {
      opacity: 0.8;
    }

    .btn-logout {
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-logout:hover {
      background-color: #c0392b;
    }

    .dashboard-content {
      padding: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      background-color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .welcome-section h1 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .welcome-section p {
      margin: 0;
      color: #666;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .stat-card h3 {
      margin: 0 0 10px 0;
      color: #667eea;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .stat-value {
      margin: 0 0 15px 0;
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    .stat-link {
      color: #667eea;
      text-decoration: none;
      font-size: 14px;
      transition: color 0.3s;
    }

    .stat-link:hover {
      color: #5568d3;
    }

    .quick-actions {
      background-color: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .quick-actions h2 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px;
      background-color: #f9f9f9;
      border: 2px solid #eee;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .action-btn:hover {
      background-color: #667eea;
      color: white;
      border-color: #667eea;
    }

    .action-btn .icon {
      font-size: 24px;
    }

    .action-btn span {
      font-size: 14px;
      font-weight: 500;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser?: User;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: any) => {
        this.currentUser = state.user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
