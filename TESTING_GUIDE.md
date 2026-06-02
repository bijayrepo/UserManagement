# Test Scenarios & Quick Start

## Quick Testing Guide

### Test Credentials

Use any of these test accounts to login. In mock mode, any email/password combination works:

| Email | Password | Role | Organization | Purpose |
|-------|----------|------|--------------|---------|
| john.doe@acme.com | password123 | Admin | Acme Corp | Test admin features |
| jane.smith@acme.com | password123 | Manager | Acme Corp | Test manager features |
| mike.johnson@acme.com | password123 | User | Acme Corp | Test user features |
| sarah.williams@acme.com | password123 | Manager | Tech Inn | Test multi-org |
| david.brown@acme.com | password123 | User | Tech Inn | Test multi-org |

**Or use ANY email/password combination - they all work!**

---

## Test Scenario 1: Basic Login & Navigation

**Time**: ~2 minutes

### Steps

1. ✅ Open `http://localhost:4200`
2. ✅ Login with: `john.doe@acme.com` / `password123`
3. ✅ Verify dashboard loads with "Welcome, John!"
4. ✅ Click "Profile" - should navigate to profile page
5. ✅ Click "Dashboard" link to go back
6. ✅ Click "Organization" - should show org details
7. ✅ Click "Logout" - should redirect to login

### Expected Results

- ✅ Login form validates email and password
- ✅ Dashboard shows correct user info
- ✅ Navigation between modules works smoothly
- ✅ Logout clears session and redirects

---

## Test Scenario 2: Profile Management

**Time**: ~3 minutes

### Steps

1. ✅ Login as any user
2. ✅ Click "Profile"
3. ✅ **Test Profile Update**:
   - Change first/last name
   - Update phone number
   - Update city/country
   - Change bio
   - Click "Save Changes"
   - Verify success message appears
4. ✅ **Test Photo Upload**:
   - Click "Change Photo"
   - Select any image file
   - Verify preview updates
   - Verify success message appears

### Expected Results

- ✅ Form validation works (required fields)
- ✅ Email field is disabled
- ✅ Photo preview updates immediately
- ✅ Success messages auto-clear after 3 seconds
- ✅ All fields are populated correctly on load

---

## Test Scenario 3: Organization Management

**Time**: ~3 minutes

### Steps

1. ✅ Login as any user
2. ✅ Click "Organization"
3. ✅ **Test Organization Info Tab**:
   - Update organization name
   - Update email
   - Update phone
   - Update address/city/country
   - Click "Save Changes"
   - Verify success message
4. ✅ **Test Members Tab**:
   - Verify members list displays
   - Verify role badges show correctly
   - Verify joined date displays
   - Check "Remove" button appears

### Expected Results

- ✅ Organization details load and display
- ✅ Tab switching works smoothly
- ✅ Members list shows all team members
- ✅ Role badges color-coded (admin=red, manager=blue, user=green)
- ✅ Update functionality works

---

## Test Scenario 4: Multi-Organization Testing

**Time**: ~3 minutes

### Steps

1. ✅ Login as `john.doe@acme.com` (Acme Corp - 3 members)
   - Navigate to Organization
   - Verify org is "Acme Corporation"
   - Verify 3 members shown
2. ✅ Logout
3. ✅ Login as `sarah.williams@acme.com` (Tech Innovations - 2 members)
   - Navigate to Organization
   - Verify org is "Tech Innovations Inc"
   - Verify 2 members shown
4. ✅ Logout
5. ✅ Verify users are organization-specific

### Expected Results

- ✅ Different users see their own organization
- ✅ Member counts differ correctly
- ✅ Organization names are correct
- ✅ No data mixing between organizations

---

## Test Scenario 5: Role-Based Features

**Time**: ~2 minutes

### Steps

1. ✅ **Admin Test** (john.doe@acme.com):
   - Login and verify role shows "ADMIN"
   - Check dashboard for admin features
2. ✅ **Manager Test** (jane.smith@acme.com):
   - Login and verify role shows "MANAGER"
   - Compare features to admin
3. ✅ **User Test** (mike.johnson@acme.com):
   - Login and verify role shows "USER"
   - Compare features to manager

### Expected Results

- ✅ Correct role displayed on dashboard
- ✅ Profile shows correct department
- ✅ Organization shows correct member role

---

## Test Scenario 6: Form Validation

**Time**: ~2 minutes

### Profile Form Tests

1. ✅ **Required Fields**:
   - Clear first name, try to submit → shows error
   - Clear last name, try to submit → shows error
2. ✅ **Optional Fields**:
   - Leave phone/city/address blank → should allow save
3. ✅ **Field Interactions**:
   - Type in fields
   - Verify character limits work
   - Verify placeholders display

### Expected Results

- ✅ Required field validation shows
- ✅ Submit button disabled with invalid form
- ✅ Optional fields can be left blank
- ✅ Error messages clear/appear correctly

---

## Test Scenario 7: Photo Upload

**Time**: ~2 minutes

### Steps

1. ✅ Go to Profile
2. ✅ Click "Change Photo"
3. ✅ Upload an image
4. ✅ Verify:
   - Preview updates immediately
   - Success message shows
   - Message auto-clears
5. ✅ Try uploading different images
6. ✅ Verify photo updates each time

### Expected Results

- ✅ File picker opens
- ✅ Preview shows selected image
- ✅ Upload completes successfully
- ✅ Success notification appears and disappears
- ✅ Multiple uploads work

---

## Test Scenario 8: Navigation & Routing

**Time**: ~2 minutes

### Steps

1. ✅ Login to dashboard
2. ✅ Click each navigation link:
   - "Profile" → goes to `/profile`
   - "Organization" → goes to `/organization`
   - "Dashboard" → goes to `/dashboard`
3. ✅ Use browser back button → navigation works
4. ✅ Type URL manually → routes work (if authenticated)
5. ✅ Try to access `/profile` without login → redirects to login

### Expected Results

- ✅ All routes work correctly
- ✅ Navigation bar updates active link
- ✅ Protected routes require authentication
- ✅ Browser back/forward works

---

## Test Scenario 9: Session Management

**Time**: ~2 minutes

### Steps

1. ✅ Login successfully
2. ✅ Verify token stored in localStorage:
   - Open DevTools → Application → Local Storage
   - Look for `accessToken` and `user` keys
3. ✅ Refresh page → session persists
4. ✅ Click logout → keys removed from localStorage
5. ✅ Navigate to protected route without login → redirects to login

### Expected Results

- ✅ Token saved to localStorage on login
- ✅ User data saved to localStorage
- ✅ Session persists on page refresh
- ✅ Logout clears all session data
- ✅ Protected routes require authentication

---

## Test Scenario 10: UI Responsiveness

**Time**: ~3 minutes

### Steps

1. ✅ Open DevTools (F12)
2. ✅ Toggle device toolbar (Ctrl+Shift+M)
3. ✅ Test on different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px+)
4. ✅ Verify layout adjusts:
   - Navbar responsive
   - Forms stack properly
   - Tables readable
   - Buttons clickable

### Expected Results

- ✅ Responsive design works on all sizes
- ✅ No horizontal scrolling
- ✅ Text readable at all sizes
- ✅ Touch targets large enough for mobile
- ✅ Grid layouts adjust properly

---

## Test Scenario 11: Error Handling

**Time**: ~2 minutes

### Steps

1. ✅ **Invalid Credentials**:
   - Actually any email/password works in mock mode
   - This would fail in real API
2. ✅ **Form Errors**:
   - Try to submit with empty required fields
   - Verify error messages show
3. ✅ **Network Errors** (advanced):
   - Can simulate with DevTools Network tab
   - Set to "Offline" mode
   - Try API calls

### Expected Results

- ✅ Error messages display clearly
- ✅ Form doesn't submit with errors
- ✅ Error messages auto-clear after 3 seconds
- ✅ User can retry after error

---

## Test Scenario 12: Performance

**Time**: ~3 minutes

### Steps

1. ✅ Open DevTools → Performance tab
2. ✅ **Initial Load**:
   - Navigate to `/` while not logged in
   - Record performance
   - Load time should be under 2 seconds
3. ✅ **Page Navigation**:
   - Login and navigate between modules
   - Modules should load quickly (< 1 second)
4. ✅ **Form Submission**:
   - Update profile
   - Should complete in < 1 second (mock delay = 500ms)

### Expected Results

- ✅ Initial load < 2 seconds
- ✅ Navigation < 1 second
- ✅ API calls complete with simulated delays
- ✅ No console errors

---

## Test Scenario 13: Browser Compatibility

**Time**: ~5 minutes (per browser)

### Test Browsers

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Steps per Browser

1. ✅ Open application
2. ✅ Go through login/dashboard/profile/organization flows
3. ✅ Verify no console errors
4. ✅ Check UI renders correctly
5. ✅ Test form submissions

### Expected Results

- ✅ Works on all modern browsers
- ✅ No browser-specific errors
- ✅ UI consistent across browsers

---

## Test Scenario 14: Data Persistence

**Time**: ~3 minutes

### Steps

1. ✅ Login
2. ✅ Navigate to profile
3. ✅ Update profile with:
   - New phone number
   - New city
   - New bio
4. ✅ Click "Save Changes" → success message
5. ✅ **Refresh page** → profile data still shows? (No - mock data resets)
6. ✅ Go to dashboard, then back to profile → data resets (expected behavior)

### Expected Results

- ⚠️ Changes persist during session (expected)
- ⚠️ Changes reset on page refresh (expected for mock)
- ✅ Success messages show on update
- **Note**: With real API, data would persist

---

## Test Scenario 15: Complete User Journey

**Time**: ~5 minutes

### Complete User Story

```
As a user, I want to:
1. ✅ Login to the application
2. ✅ See my dashboard with welcome message
3. ✅ Update my profile information
4. ✅ Upload a profile photo
5. ✅ View my organization
6. ✅ See my organization members
7. ✅ Logout and return to login
```

### Steps

1. ✅ Open app
2. ✅ Login: `john.doe@acme.com` / `password123`
3. ✅ Verify dashboard shows "Welcome, John!"
4. ✅ Click "Profile"
5. ✅ Update phone number
6. ✅ Upload a photo
7. ✅ Click "Dashboard"
8. ✅ Click "Organization"
9. ✅ View members list
10. ✅ Click "Logout"
11. ✅ Verify redirected to login

### Expected Results

- ✅ Entire user journey completes successfully
- ✅ All features work as expected
- ✅ Navigation is smooth
- ✅ No errors in console
- ✅ Session properly managed

---

## Quick Testing Commands

```bash
# Start development server
npm start

# Open with DevTools
# Windows: F12
# Mac: Cmd+Option+I
# Linux: F12

# Test with different users
# Clear localStorage and try different credentials:
# 1. john.doe@acme.com (Admin)
# 2. jane.smith@acme.com (Manager)
# 3. mike.johnson@acme.com (User)
```

---

## Test Data Summary

**Total Users**: 5
- 1 Admin
- 2 Managers
- 2 Regular Users

**Total Organizations**: 3
- Org 1: 3 members
- Org 2: 2 members
- Org 3: 0 members

**Test Scenarios Available**: 5
- Basic Login
- Admin User
- Multiple Organizations
- Role Hierarchy
- Org + User Combinations

---

## Checklist for Full Test Coverage

- [ ] Login page renders correctly
- [ ] Form validation works
- [ ] Can login with test credentials
- [ ] Dashboard displays user info
- [ ] Profile page loads and displays data
- [ ] Can update profile fields
- [ ] Photo upload works
- [ ] Organization page displays details
- [ ] Members list shows correctly
- [ ] Can navigate between all modules
- [ ] Logout works
- [ ] Protected routes blocked without auth
- [ ] Responsive design works
- [ ] No console errors
- [ ] Success/error messages display
- [ ] Messages auto-clear

---

## Notes

- All test data is **in-memory only** (mock API)
- Changes don't persist on page refresh
- Perfect for UI/UX testing and development
- Switch to real API for data persistence
- See [TEST_DATA_GUIDE.md](TEST_DATA_GUIDE.md) for more details
