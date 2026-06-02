# Production Deployment Guide

## Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] Linting rules passed
- [ ] Tests passing
- [ ] Code review completed
- [ ] Security vulnerabilities checked
- [ ] Dependencies updated to latest stable versions

### Configuration
- [ ] Production environment variables set
- [ ] API endpoints configured
- [ ] Third-party services configured
- [ ] Database connections tested
- [ ] Cache strategies configured

### Security
- [ ] HTTPS/SSL certificate configured
- [ ] CORS properly configured
- [ ] Authentication tested end-to-end
- [ ] Authorization rules verified
- [ ] Sensitive data not in version control
- [ ] API rate limiting configured

### Performance
- [ ] Production build tested locally
- [ ] Bundle size analyzed
- [ ] Lazy loading verified
- [ ] Images optimized
- [ ] Caching strategies implemented

## Build Process

### Create Production Build
```bash
npm run build
```

Output directory: `dist/user-management/`

### Build with Source Maps (for debugging)
```bash
ng build --configuration production --source-map
```

### Analyze Bundle Size
```bash
ng build --configuration production --stats-json
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/user-management/stats.json
```

## Environment Configuration

### Update Production Environment
File: `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api',
  tokenKey: 'accessToken',
  logLevel: 'warn'
};
```

### Environment Variables (if needed)
Create `.env.production`:
```
NG_APP_API_URL=https://api.yourdomain.com/api
NG_APP_VERSION=1.0.0
```

## Deployment Options

### 1. Firebase Hosting

**Setup**:
```bash
npm install -g firebase-tools
firebase login
firebase init
```

**Deploy**:
```bash
npm run build
firebase deploy
```

**firebase.json**:
```json
{
  "hosting": {
    "public": "dist/user-management",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 2. Vercel

**Install Vercel CLI**:
```bash
npm install -g vercel
```

**Deploy**:
```bash
vercel
```

**vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/user-management",
  "env": {
    "NG_APP_API_URL": "@api_url"
  }
}
```

### 3. Netlify

**Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

**Build and Deploy**:
```bash
netlify deploy --prod
```

**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = "dist/user-management"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4. AWS S3 + CloudFront

**Build**:
```bash
npm run build
```

**Upload to S3**:
```bash
aws s3 sync dist/user-management/ s3://your-bucket-name --delete
```

**CloudFront Configuration**:
- Set origin to S3 bucket
- Configure cache behavior
- Set default root object to `index.html`
- Create custom error response (404 → /index.html)

### 5. Docker Deployment

**Dockerfile**:
```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine
COPY --from=builder /app/dist/user-management /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and Push**:
```bash
docker build -t user-management:latest .
docker tag user-management:latest your-registry/user-management:latest
docker push your-registry/user-management:latest
```

### 6. Traditional Web Server (Apache/Nginx)

**Nginx Configuration**:
```nginx
server {
  listen 80;
  server_name yourdomain.com;

  # Redirect HTTP to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name yourdomain.com;

  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  root /var/www/user-management;
  index index.html;

  # SPA routing
  location / {
    try_files $uri $uri/ /index.html;
  }

  # API proxy
  location /api/ {
    proxy_pass https://api.yourdomain.com/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # Caching
  location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

## SSL/HTTPS Configuration

### Get SSL Certificate
```bash
# Using Let's Encrypt with Certbot
certbot certonly --standalone -d yourdomain.com
```

### Configure HTTPS
- Set certificate paths in web server config
- Enable HSTS header
- Redirect HTTP to HTTPS

## Performance Optimization for Production

### 1. Enable Gzip Compression
**Nginx**:
```nginx
gzip on;
gzip_types text/plain text/css text/javascript application/json;
gzip_min_length 1000;
```

### 2. Set Cache Headers
```nginx
# Cache JavaScript and CSS for 1 year
location ~* \.(js|css)$ {
  expires 1y;
}

# Cache images for 30 days
location ~* \.(png|jpg|jpeg|gif|ico)$ {
  expires 30d;
}

# Don't cache HTML
location ~* \.html$ {
  expires -1;
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### 3. Enable Service Worker
Update `main.ts` for production:
```typescript
if (environment.production) {
  enableProdMode();
}
```

## Monitoring & Logging

### Application Logging
```typescript
// In production environment
if (environment.production) {
  // Send errors to logging service
  new ErrorHandler().handleError(error);
}
```

### APM Solutions
- **New Relic**: Monitor performance
- **Datadog**: Log aggregation
- **Sentry**: Error tracking
- **Google Analytics**: User analytics

### Health Checks
```typescript
// API health endpoint
GET /api/health
Response: { status: 'ok', timestamp: '...' }
```

## Database Backup & Recovery

- Setup automated backups
- Test recovery procedures
- Document recovery time objective (RTO)
- Document recovery point objective (RPO)

## Rollback Strategy

### Blue-Green Deployment
1. Deploy to new server (green)
2. Test thoroughly
3. Switch traffic to green
4. Keep blue as rollback

### Canary Deployment
1. Deploy to small percentage (5%)
2. Monitor metrics
3. Gradually increase to 100%
4. Rollback if issues

## Monitoring Performance

### Metrics to Track
- Page load time
- Time to first paint (FP)
- Time to first contentful paint (FCP)
- Largest contentful paint (LCP)
- First input delay (FID)
- Cumulative layout shift (CLS)

### Tools
- Google Lighthouse
- WebPageTest
- Chrome DevTools
- Real User Monitoring (RUM)

## Database Considerations

### Migration Strategy
```bash
# Run migrations before deployment
npm run migrate
```

### Connection Pooling
- Configure pool size
- Set connection timeout
- Implement retry logic

## API Rate Limiting

```typescript
// In backend
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100                    // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Security Headers

```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'";
```

## Updating in Production

### Zero-Downtime Deployment
1. Start new instance
2. Wait for health checks to pass
3. Add to load balancer
4. Remove old instance

### Feature Flags
```typescript
// Enable/disable features
const features = {
  newUI: true,
  betaFeature: false
};

if (features.newUI) {
  // Show new UI
}
```

## Post-Deployment

### Verify Deployment
- [ ] Application loads
- [ ] Login works
- [ ] Core features work
- [ ] API connectivity verified
- [ ] Logs are clean
- [ ] Performance metrics normal

### Monitor
- [ ] Watch error rates
- [ ] Monitor performance metrics
- [ ] Check API response times
- [ ] Verify user sessions
- [ ] Monitor server resources

### Rollback Criteria
- Error rate > 5%
- Performance degradation > 20%
- Critical feature not working
- Security vulnerability discovered

---

## Deployment Checklist Template

```
Deployment: v1.0.0 to Production
Date: [DATE]
Deployed By: [NAME]

Pre-Deployment:
- [ ] Code review completed
- [ ] Tests passing
- [ ] Build successful
- [ ] Performance tested
- [ ] Security checked

Deployment:
- [ ] Backup created
- [ ] Database migrated
- [ ] Application deployed
- [ ] Health checks passing

Post-Deployment:
- [ ] Feature verification
- [ ] Performance check
- [ ] Error monitoring
- [ ] User communication

Sign-off:
- [ ] Team Lead: __________ Date: ________
- [ ] DevOps: __________ Date: ________
```
