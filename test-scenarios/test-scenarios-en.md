# Test Scenarios for User Authentication and Profile Management

## 1. Login Functionality

### Test Case 1.1: Successful Login
**Description:** Verify that a user can successfully log in with valid credentials.  
**Preconditions:** User with username "bar1234" and password "12345678" exists in the system.  
**Test Steps:**
1. Navigate to login page
2. Enter username "bar1234"
3. Enter password "12345678"
4. Click "Log In" button

**Expected Result:** 
- Success message "Authentication successful, Logging in" is displayed
- User is redirected to the Map page after 1.5 seconds
- Navigation sidebar shows user is logged in

### Test Case 1.2: Invalid Username
**Description:** Verify system response when a non-existent username is provided.  
**Test Steps:**
1. Navigate to login page
2. Enter username "nonexistent_user"
3. Enter password "anypassword"
4. Click "Log In" button

**Expected Result:**
- Error message "Incorrect credentials or unregistered" is displayed
- User remains on login page
- No redirection occurs

### Test Case 1.3: Invalid Password
**Description:** Verify system response when an incorrect password is provided for a valid username.  
**Preconditions:** User with username "bar1234" exists in the system.  
**Test Steps:**
1. Navigate to login page
2. Enter username "bar1234"
3. Enter password "wrongpassword"
4. Click "Log In" button

**Expected Result:**
- Error message "Incorrect credentials or unregistered" is displayed
- User remains on login page
- No redirection occurs

### Test Case 1.4: Empty Fields Validation
**Description:** Verify that the login form validates empty fields.  
**Test Steps:**
1. Navigate to login page
2. Leave username field empty
3. Leave password field empty
4. Click "Log In" button

**Expected Result:**
- Form validation prevents submission
- Visual indicators show that both fields are required
- No server request is made

### Test Case 1.5: Login with Enter Key
**Description:** Verify login functionality when using the Enter key.  
**Preconditions:** User with username "bar1234" and password "12345678" exists in the system.  
**Test Steps:**
1. Navigate to login page
2. Enter username "bar1234"
3. Enter password "12345678"
4. Press the Enter key

**Expected Result:**
- Success message "Authentication successful, Logging in" is displayed
- User is redirected to the Map page after 1.5 seconds
- Navigation sidebar shows user is logged in

### Test Case 1.6: Persistent Login State
**Description:** Verify that login state persists after page refresh.  
**Preconditions:** User is logged in.  
**Test Steps:**
1. Refresh the browser

**Expected Result:**
- User remains logged in
- User is not redirected to login page
- All authenticated features remain accessible

## 2. Registration Functionality

### Test Case 2.1: Successful Registration
**Description:** Verify that a new user can register successfully.  
**Test Steps:**
1. Navigate to registration page
2. Enter first name "Test"
3. Enter last name "User"
4. Enter email "testuser@example.com"
5. Enter username "testuser123"
6. Enter password "password123"
7. Click "Register" button

**Expected Result:**
- Success message "User created successfully" is displayed
- User is redirected to the login page after 1.5 seconds

### Test Case 2.2: Registration with Existing Username
**Description:** Verify system response when attempting to register with an existing username.  
**Preconditions:** User with username "bar1234" exists in the system.  
**Test Steps:**
1. Navigate to registration page
2. Enter first name "Another"
3. Enter last name "User"
4. Enter email "another@example.com"
5. Enter username "bar1234" (existing username)
6. Enter password "newpassword123"
7. Click "Register" button

**Expected Result:**
- Error message "User already exists" is displayed
- User remains on registration page
- No redirection occurs

### Test Case 2.3: Registration with Existing Email
**Description:** Verify system response when attempting to register with an existing email.  
**Preconditions:** User with email "bar@gmail.com" exists in the system.  
**Test Steps:**
1. Navigate to registration page
2. Enter first name "Another"
3. Enter last name "User"
4. Enter email "bar@gmail.com" (existing email)
5. Enter username "unique_username"
6. Enter password "newpassword123"
7. Click "Register" button

**Expected Result:**
- Error message "User already exists" is displayed
- User remains on registration page
- No redirection occurs

### Test Case 2.4: Registration with Invalid Email Format
**Description:** Verify that the form validates email format during registration.  
**Test Steps:**
1. Navigate to registration page
2. Enter first name "Test"
3. Enter last name "User"
4. Enter email "invalid-email" (invalid format)
5. Enter username "testuser456"
6. Enter password "password123"
7. Click "Register" button

**Expected Result:**
- Error message "Invalid email format" is displayed
- Form is not submitted
- User remains on registration page

### Test Case 2.5: Registration with Short Password
**Description:** Verify that the form validates password length during registration.  
**Test Steps:**
1. Navigate to registration page
2. Enter first name "Test"
3. Enter last name "User"
4. Enter email "testuser@example.com"
5. Enter username "testuser789"
6. Enter password "123" (less than 8 characters)
7. Click "Register" button

**Expected Result:**
- Error message "Password must be at least 8 characters long" is displayed
- Form is not submitted
- User remains on registration page

### Test Case 2.6: Registration with Empty Fields
**Description:** Verify that the registration form validates empty fields.  
**Test Steps:**
1. Navigate to registration page
2. Leave all fields empty
3. Click "Register" button

**Expected Result:**
- Error message "All fields are required" is displayed
- Form is not submitted
- User remains on registration page

## 3. Profile Editing Functionality

### Test Case 3.1: Successful Profile Update
**Description:** Verify that a user can successfully update their profile information.  
**Preconditions:** User "bar1234" is logged in.  
**Test Steps:**
1. Navigate to Edit Profile page
2. Update First Name to "Updated"
3. Update Last Name to "User"
4. Update Email to "updated@example.com"
5. Click "Update Profile" button

**Expected Result:**
- Success message "User information updated successfully" is displayed
- Form fields show the updated information
- Data is persisted in the database

### Test Case 3.2: Profile Update with Invalid Email Format
**Description:** Verify that the form validates email format during profile update.  
**Preconditions:** User "bar1234" is logged in.  
**Test Steps:**
1. Navigate to Edit Profile page
2. Keep First Name and Last Name as is
3. Update Email to "invalid-email" (invalid format)
4. Click "Update Profile" button

**Expected Result:**
- Error message "Please enter a valid email address" is displayed
- Form is not submitted
- Profile data remains unchanged

### Test Case 3.3: Profile Update with Empty Fields
**Description:** Verify that the profile update form validates empty fields.  
**Preconditions:** User "bar1234" is logged in.  
**Test Steps:**
1. Navigate to Edit Profile page
2. Clear the First Name field
3. Click "Update Profile" button

**Expected Result:**
- Error message "All fields are required" is displayed
- Form is not submitted
- Profile data remains unchanged

### Test Case 3.4: Profile Data Loading
**Description:** Verify that the user's profile data is correctly loaded into the form.  
**Preconditions:** User "bar1234" is logged in with known profile data.  
**Test Steps:**
1. Navigate to Edit Profile page

**Expected Result:**
- Form fields are pre-populated with the user's current profile data
- Username field is displayed but disabled
- The form is in a ready-to-edit state

### Test Case 3.5: Profile Update Cancellation
**Description:** Verify that canceling a profile update works correctly.  
**Preconditions:** User "bar1234" is logged in.  
**Test Steps:**
1. Navigate to Edit Profile page
2. Make changes to profile fields
3. Click "Cancel" button

**Expected Result:**
- User is redirected to the Map page
- No changes are saved to the profile
- Original profile data remains intact

## 4. Navigation and Access Control

### Test Case 4.1: Access Protected Routes When Logged Out
**Description:** Verify that protected routes redirect to login when accessed by an unauthenticated user.  
**Preconditions:** User is not logged in.  
**Test Steps:**
1. Attempt to navigate directly to "/map" URL
2. Attempt to navigate directly to "/chat" URL
3. Attempt to navigate directly to "/profile/edit" URL

**Expected Result:**
- User is redirected to the login page for all attempts
- No protected content is visible until login

### Test Case 4.2: Sidebar Navigation When Logged In
**Description:** Verify that sidebar navigation links work correctly for authenticated users.  
**Preconditions:** User is logged in.  
**Test Steps:**
1. Click on "My CV" in the sidebar
2. Click on "Chat" in the sidebar
3. Click on "Edit Profile" in the sidebar

**Expected Result:**
- Clicking "My CV" navigates to the Map page
- Clicking "Chat" navigates to the Chat page
- Clicking "Edit Profile" navigates to the Edit Profile page
- All pages load correctly with expected content

### Test Case 4.3: Logout Functionality
**Description:** Verify that a user can successfully log out.  
**Preconditions:** User is logged in.  
**Test Steps:**
1. Click on "Logout" in the sidebar

**Expected Result:**
- User session is terminated
- User is redirected to the login page
- Protected routes are no longer accessible without login