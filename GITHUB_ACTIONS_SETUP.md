# GitHub Actions - Azure App Service Deployment

This guide explains how to set up and use the GitHub Actions CI/CD pipeline to deploy your Angular User Management application to Azure App Service.

## Overview

The workflow (`deploy-azure.yml`) automates:
- **Build**: Linting, testing, and building Angular production bundle
- **Deploy**: Pushing built app to Azure App Service
- **Validate**: Health checks on the deployed application

## Prerequisites

Before setting up, ensure you have:

1. ✅ **GitHub Repository** - Your code must be on GitHub
2. ✅ **Azure Account** - Active Azure subscription
3. ✅ **Azure App Service** - Web app already created (`user-management`)
4. ✅ **Azure CLI** - Installed locally for credential generation
5. ✅ **Permissions** - Owner/Admin access to both GitHub repo and Azure resources

## Setup Instructions

### Step 1: Generate Azure Credentials

Run this command in Azure CLI to generate credentials:

```bash
az ad sp create-for-rbac --name "github-actions-user-management" --role contributor --scopes /subscriptions/{SUBSCRIPTION_ID}/resourceGroups/WebApp --json-auth
```

**Replace `{SUBSCRIPTION_ID}` with your Azure subscription ID.**

You can get your subscription ID:
```bash
az account show --query id --output tsv
```

This command outputs JSON credentials that look like:
```json
{
  "clientId": "xxxxx",
  "clientSecret": "xxxxx",
  "subscriptionId": "xxxxx",
  "tenantId": "xxxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

### Step 2: Add Azure Credentials to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AZURE_CREDENTIALS`
5. Value: Paste the entire JSON output from Step 1
6. Click **Add secret**

### Step 3: Configure Workflow Variables (if needed)

Edit `.github/workflows/deploy-azure.yml` if you need to customize:

```yaml
env:
  AZURE_WEBAPP_NAME: user-management          # Your App Service name
  AZURE_RESOURCE_GROUP: WebApp                # Your resource group
  NODE_VERSION: 18.x                          # Node.js version
```

### Step 4: Update Branch Configuration

The workflow is configured to trigger on the `dev` branch. To change this, edit the trigger:

```yaml
on:
  push:
    branches:
      - dev                    # Change this to your preferred branch
  pull_request:
    branches:
      - dev                    # Change this to match
```

## Workflow Jobs

### 1. **Build Job**
- Checks out code
- Installs dependencies using npm ci
- Runs linting (continues on error)
- Runs tests (continues on error)
- Builds production bundle
- Uploads artifact for deployment

**Runs on:** Every push and pull request to `dev` branch

### 2. **Deploy Job**
- Downloads build artifact
- Logs into Azure
- Deploys to Azure App Service using `webapps-deploy@v2`
- Logs out from Azure

**Runs on:** Only on successful push to `dev` branch (not on PRs)

### 3. **Validate Job**
- Performs health checks on deployed app
- Retries 5 times with 10-second intervals
- Confirms app is responding correctly

**Runs on:** Only after successful deployment

## Deployment Flow

```
Code Push to 'dev' branch
        ↓
    BUILD JOB
   ├─ Lint & Test
   ├─ Build Angular app
   └─ Upload artifact
        ↓
    DEPLOY JOB
   ├─ Download artifact
   ├─ Login to Azure
   └─ Deploy to App Service
        ↓
   VALIDATE JOB
   └─ Health check
        ↓
    ✅ Deployment Complete
```

## Monitoring Deployments

### View Workflow Runs

1. Go to your GitHub repository
2. Click **Actions** tab
3. Click on the workflow run to see details

### Real-time Logs

- Click on a workflow run
- Select the job (Build, Deploy, or Validate)
- View detailed step-by-step logs

### Understanding Status

- 🟢 **Success** - All jobs completed successfully
- 🟡 **In Progress** - Workflow is running
- 🔴 **Failed** - One or more jobs failed

### Common Issues

#### Build Fails
- Check npm dependencies: `npm ci` locally
- Review linting errors
- Check test failures

**View logs:** Click on "Build and Test" job → see detailed output

#### Deploy Fails
- Verify `AZURE_CREDENTIALS` secret is set correctly
- Check Azure app name is correct
- Ensure resource group exists
- Verify credentials have necessary permissions

**View logs:** Click on "Deploy to Azure" job → see detailed output

#### Health Check Fails
- Ensure app is running in Azure
- Check Azure portal for errors
- Verify app's start script in package.json

## Manual Deployment Without Workflow

If you need to deploy manually:

```bash
# Build the app
npm run build

# Install Azure CLI (if not already installed)
az login
az account set --subscription {SUBSCRIPTION_ID}

# Deploy using Azure CLI
az webapp deployment source config-zip --resource-group WebApp --name user-management --src dist/user-management/
```

## Customizing the Workflow

### Add Additional Tests

Edit the Build job to add more test commands:

```yaml
- name: Run integration tests
  run: npm run test:integration
```

### Add Slack Notifications

Add this step to Deploy job to notify Slack:

```yaml
- name: Notify Slack
  if: always()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Deployment to Azure: ${{ job.status }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Azure Deployment: *${{ job.status }}*\n*Repo:* ${{ github.repository }}\n*Branch:* ${{ github.ref }}"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
    SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
```

### Add Environment-Specific Deployments

Create separate workflows for staging and production:

```yaml
# deploy-staging.yml
on:
  push:
    branches: [dev]

# deploy-production.yml
on:
  push:
    branches: [main]
  workflow_dispatch:    # Allow manual trigger
```

## Troubleshooting

### Issue: "Login failed" error

**Solution:** Verify your `AZURE_CREDENTIALS` secret:
1. Re-generate credentials using Step 1 above
2. Update the secret in GitHub with the new JSON
3. Test credentials locally: `az login --service-principal -u <clientId> -p <clientSecret> --tenant <tenantId>`

### Issue: Deployment timeout

**Solution:** Check your app service size and region
- Larger builds may need more time
- Add timeout to workflow: `timeout-minutes: 30`

### Issue: App not running after deployment

**Solution:** 
1. Check Azure portal for startup errors
2. Verify `npm start` is correctly configured
3. Check environment variables in App Service settings
4. Review app logs in Azure portal

### Issue: Tests timeout

**Solution:** 
- Add timeout to test step:
```yaml
- name: Run tests
  timeout-minutes: 15
  run: npm run test -- --watch=false --browsers=ChromeHeadless
```

## Next Steps

1. ✅ Commit the workflow file to your repository
2. ✅ Add AZURE_CREDENTIALS secret to GitHub
3. ✅ Push a change to the `dev` branch to test
4. ✅ Monitor the workflow run in GitHub Actions
5. ✅ Verify deployment in Azure App Service

## Useful Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure Web Apps Deploy Action](https://github.com/Azure/webapps-deploy)
- [Azure CLI Reference](https://learn.microsoft.com/en-us/cli/azure/)
- [Azure App Service Documentation](https://learn.microsoft.com/en-us/azure/app-service/)

---

**Questions?** Check the workflow logs in GitHub Actions or Azure portal for detailed error messages.
