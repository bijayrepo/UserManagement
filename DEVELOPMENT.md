# Development Guide

## Local Development Setup

### Prerequisites
- Node.js v18+
- npm v9+
- Angular CLI 18+

### Initial Setup

1. **Install Angular CLI globally** (if not already installed)
   ```bash
   npm install -g @angular/cli@18
   ```

2. **Install project dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`

### Development Server

- Auto-reload enabled: Changes to files will automatically refresh the browser
- TypeScript compilation enabled: Code is compiled in real-time
- Source maps available for debugging

### Project Configuration

#### TypeScript Paths
Configured in `tsconfig.json` for easier imports:
```typescript
// Instead of
import { AuthService } from '../../../core/services/auth.service';

// Use
import { AuthService } from '@core/services/auth.service';
```

Available path aliases:
- `@app/*` - App directory
- `@core/*` - Core module
- `@modules/*` - Feature modules
- `@shared/*` - Shared module
- `@assets/*` - Assets

### Development Workflow

#### Creating a New Component

1. Create component directory in appropriate location
2. Create component file with `.component.ts` extension
3. Mark as standalone or add to module
4. Add to routing

Example:
```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  template: `<div>My Component</div>`,
  styles: [`...`]
})
export class MyComponent implements OnInit {
  ngOnInit(): void {
    // Initialization logic
  }
}
```

#### Creating a New Service

1. Create service file in `services/` directory
2. Add `@Injectable({ providedIn: 'root' })` decorator
3. Implement required methods

Example:
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get('/api/data');
  }
}
```

### Testing

Run unit tests:
```bash
npm test
```

### Building

#### Development Build
```bash
npm run watch
```

#### Production Build
```bash
npm run build
```

Output goes to `dist/user-management/`

### Debugging

#### Browser DevTools
1. Open Chrome DevTools (F12)
2. Go to Sources tab
3. Navigate to files under `webpack://`
4. Set breakpoints and debug

#### VS Code Debugging
Configure `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome",
      "type": "chrome",
      "request": "attach",
      "port": 9333,
      "pathMapping": {
        "/": "${workspaceRoot}/",
        "/app/": "${workspaceRoot}/src/app/"
      }
    }
  ]
}
```

### Common Tasks

#### Update Dependencies
```bash
npm update
npm outdated  # Check for outdated packages
```

#### Clear Cache
```bash
npm cache clean --force
rm -rf node_modules dist
npm install
```

#### Linting
```bash
npm run lint
```

### Environment Configuration

Update API endpoints in service files:

**For Development** - `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

**For Production** - `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api'
};
```

### Module Organization

The project follows Angular's module structure:

```
src/app/
├── core/              # Singleton services, guards, interceptors
├── modules/           # Feature modules (lazily loaded)
├── shared/            # Reusable components, pipes, directives
└── assets/            # Static files
```

### Best Practices

1. **Always unsubscribe from observables**
   ```typescript
   private destroy$ = new Subject<void>();

   ngOnInit() {
     this.service.data$
       .pipe(takeUntil(this.destroy$))
       .subscribe(...);
   }

   ngOnDestroy() {
     this.destroy$.next();
     this.destroy$.complete();
   }
   ```

2. **Use async pipe in templates**
   ```html
   <div>{{ data$ | async }}</div>
   ```

3. **Implement OnDestroy interface**
   ```typescript
   export class MyComponent implements OnDestroy {
     ngOnDestroy(): void {
       // Cleanup logic
     }
   }
   ```

4. **Use strict TypeScript**
   - Enabled in tsconfig.json
   - Always provide types for variables and function returns

5. **Lazy load feature modules**
   ```typescript
   {
     path: 'feature',
     loadChildren: () => import('./modules/feature/feature.module')
       .then(m => m.FeatureModule)
   }
   ```

### Performance Optimization

1. **Enable Production Mode**
   - Builds automatically enable production optimizations
   - Change Detection strategy changed to OnPush

2. **Code Splitting**
   - Lazy loading for feature modules automatically creates chunks

3. **Tree Shaking**
   - Unused code is automatically removed in production builds

### Troubleshooting

#### Port Already in Use
```bash
# Use different port
ng serve --port 4201
```

#### Node Module Issues
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Clear TypeScript cache
ng build --configuration development --stats-json
```

### Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular CLI Commands](https://angular.io/cli)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)
