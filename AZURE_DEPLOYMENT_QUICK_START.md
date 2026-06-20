# Azure Deployment Quick Start Guide

## Files Created

Your GitHub Actions pipeline includes:

| File | Purpose |
|------|---------|
| `.github/workflows/deploy-azure.yml` | Main CI/CD workflow |
| `GITHUB_ACTIONS_SETUP.md` | Complete setup instructions |
| `web.config` | IIS configuration for Azure App Service |
| `.deployment` | Build command for Azure |

## Quick Setup (5 Minutes)

### 1️⃣ Generate Azure Credentials (Run Once)

```bash
# Login to Azure
az login

# Get subscription ID
az account show --query id --output tsv

# Generate credentials (replace {SUBSCRIPTION_ID})
az ad sp create-for-rbac --name "github-actions-user-management" \
  --role contributor \
  --scopes /subscriptions/{SUBSCRIPTION_ID}/resourceGroups/WebApp \
  --json-auth
```

Copy the JSON output.

### 2️⃣ Add Secret to GitHub

1. Go to **GitHub Repo** → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. **Name:** `AZURE_CREDENTIALS`
4. **Value:** Paste the JSON from Step 1
5. Click **Add secret**

### 3️⃣ Test the Pipeline

Push a change to the `dev` branch:

```bash
git add .
git commit -m "chore: setup azure deployment pipeline"
git push origin dev
```

Watch the deployment in **GitHub Repo** → **Actions**

## Pipeline Overview

```
┌─────────────────────────────────────────────────────────┐
│  PUSH to 'dev' branch                                   │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────▼─────────────┐
        │   BUILD JOB (runs always)│
        │ - npm ci                 │
        │ - npm run lint           │
        │ - npm run test           │
        │ - npm run build          │
        └────────────┬─────────────┘
                     │
        ┌────────────▼──────────────────────┐
        │ DEPLOY JOB (only on main push)    │
        │ - Download artifact               │
        │ - Login to Azure                  │
        │ - Deploy to App Service           │
        └────────────┬──────────────────────┘
                     │
        ┌────────────▼──────────────────────┐
        │ VALIDATE JOB (after deploy)       │
        │ - Health check                    │
        │ - Verify app responding           │
        └────────────┬──────────────────────┘
                     │
                 ✅ DONE
```

## Workflow Variables

These are configured in `.github/workflows/deploy-azure.yml`:

```yaml
env:
  AZURE_WEBAPP_NAME: user-management          # App Service name
  AZURE_RESOURCE_GROUP: WebApp                # Resource group
  NODE_VERSION: 18.x                          # Node.js version
```

**Change any of these only if your Azure setup differs.**

## Monitoring Deployments

### View Workflow Status
- **GitHub:** Repo → Actions → See latest run
- **Real-time logs:** Click on any job step
- **Build artifacts:** Available for 5 days

### Common Status

| Status | Meaning |
|--------|---------|
| 🟢 Completed | Deployed successfully |
| 🟡 Running | Currently deploying |
| 🔴 Failed | Check logs for error |
| ⚪ Skipped | Build passed but not deployed (likely a PR) |

### View Azure Deployment

1. Go to **Azure Portal**
2. Navigate to **App Service** → **user-management**
3. Click **Deployment slots** → **Production**
4. View deployment history and logs

## Understanding the Build Output

### Build Phase
```
√ npm ci           → Install dependencies
√ npm run lint     → Check code style (warnings OK)
√ npm run test     → Run tests (can be skipped)
√ npm run build    → Create production bundle
```

**Typical output:**
```
Angular CLI: X.X.X
Bundles
    dist/user-management/browser.js  XXXXXXX bytes
    dist/user-management/styles.css  XXXXXX bytes
✔ Build complete.
```

### Deploy Phase
```
✔ Logging in to Azure
✔ Deploying to user-management
✔ Deployment complete
```

## Troubleshooting

### ❌ Build Failed
- **Check:** `npm` scripts work locally?
- **Fix:** Run `npm ci && npm run build` locally
- **View:** Logs in GitHub Actions build step

### ❌ Deploy Failed  
- **Check:** `AZURE_CREDENTIALS` secret set correctly?
- **Fix:** Re-run credential generation and update secret
- **View:** Logs in GitHub Actions deploy step

### ❌ Health Check Failed
- **Check:** App running in Azure portal?
- **Fix:** Check App Service logs in Azure portal
- **View:** Logs in GitHub Actions validate step

### ⚠️ Build Passes but Doesn't Deploy
- This is normal for **Pull Requests**
- Deploy only happens on push to `dev` branch

## Customization Examples

### Change Deployment Branch

Edit `.github/workflows/deploy-azure.yml`:

```yaml
on:
  push:
    branches:
      - main              # Changed from dev
```

### Add Email Notifications

Add this to `.github/workflows/deploy-azure.yml`:

```yaml
- name: Notify on failure
  if: failure()
  uses: davisnathaniel/github-actions-sendgrid-mail@v2
  with:
    serverApiKey: ${{ secrets.SENDGRID_API_KEY }}
    fromEmail: ${{ secrets.FROM_EMAIL }}
    toEmail: ${{ secrets.TO_EMAIL }}
    subject: "Deployment Failed: ${{ github.repository }}"
    htmlContent: "Deployment failed for ${{ github.ref }}"
```

### Skip Tests on Deployment

Edit `deploy-azure.yml` build job:

```yaml
- name: Run tests
  run: npm run test -- --watch=false --browsers=ChromeHeadless
  if: false              # Set to false to skip tests
```

## Production Checklist

Before your first production deployment:

- [ ] Tested locally: `npm run build`
- [ ] All tests pass: `npm run test`
- [ ] Code lints: `npm run lint`
- [ ] Azure credentials correct in GitHub secrets
- [ ] App Service configuration matches `user-management`
- [ ] Resource group matches `WebApp`
- [ ] Reviewed `web.config` for your needs
- [ ] Test deployment to staging first (if available)

## Next Steps

1. **Complete Setup:** Follow [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md)
2. **Test Pipeline:** Push to `dev` and monitor GitHub Actions
3. **Monitor Deployment:** Check Azure portal for running app
4. **Optimize:** Review logs and adjust as needed

## Useful Commands

```bash
# View local build output
npm run build

# Test Angular build
npm run build -- --watch

# Check linting
npm run lint

# Run tests
npm run test -- --watch=false

# Deploy manually (if needed)
az webapp deployment source config-zip \
  --resource-group WebApp \
  --name user-management \
  --src dist/user-management/
```

## Support

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Azure App Service:** https://portal.azure.com
- **Angular Build Guide:** https://angular.io/guide/build
- **Troubleshooting:** Check logs in GitHub Actions or Azure Portal

---

**First deployment?** Start with GITHUB_ACTIONS_SETUP.md for detailed instructions.
