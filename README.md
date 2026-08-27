# 🚍 E-Bus Management System (Frontend)

A modern React-based web application with Firebase authentication that allows users to register, log in, and access a protected dashboard.

---

## 🔹 Features

-## Features

- User authentication using Firebase
- Register and login system
- Protected dashboard
- Logout functionality
- Bus Management
  - Add buses
  - Edit buses
  - Delete buses
  - Prevent duplicate bus numbers
- Route Management
  - Add routes
  - Edit routes
  - Delete routes
  - Prevent duplicate Route IDs

- Driver Management
 - Add new drivers
 - Edit driver information
 - Delete drivers
 - Prevent duplicate Driver IDs
 - Manage license number, assigned bus, experience, bus type, capacity, and status



---

## 🔹 Tech Stack

- React (Vite)
- Firebase Authentication
- React Router DOM
- CSS (Custom Styling)

---

## 🔹 Project Structure
src/
 ├── components/
 ├── pages/
 │    ├── Login.jsx
 │    ├── Register.jsx
 │    ├── Dashboard.jsx
 ├── firebase.js
 ├── App.jsx
 ├── main.jsx
 └── styles.css

 
---

## 🔹 Debugging & Challenges Faced

### 1. React Router not working
- **Problem:** App failed to import `react-router-dom`
- **Cause:** Package was not installed
- **Fix:** Installed using `npm install react-router-dom` and restarted the server

---

### 2. Blank page on /login
- **Problem:** Navigating to `/login` showed a blank page
- **Cause:** Route for `/login` was not defined
- **Fix:** Added `<Route path="/login" element={<Login />} />`

---

### 3. Missing component errors
- **Problem:** Import errors for `Login` and `Dashboard`
- **Cause:** Files were not created
- **Fix:** Created required components inside `pages/`

---

### 4. CSS import error
- **Problem:** `index.css` not found
- **Cause:** File was deleted but still imported
- **Fix:** Removed import from `main.jsx`

---

### 5. Firebase setup confusion
- **Problem:** Uncertainty about which Firebase code to use
- **Cause:** Firebase provides multiple setup options
- **Fix:** Used only `firebaseConfig` and ignored analytics setup

---

### 6. Authentication testing confusion
- **Problem:** Could not confirm Firebase connection
- **Cause:** Firebase does not show direct success messages
- **Fix:** Verified by creating a user and checking Firebase Console

---

### 7. Protected route testing
- **Problem:** Dashboard always accessible
- **Cause:** User session already active
- **Fix:** Tested using incognito mode to verify redirect behavior

---

### 8. Logout redirect issue
- **Problem:** Blank screen after logout
- **Cause:** `/login` route missing
- **Fix:** Added proper route handling

### 9.Browser Extension Interference

**Issue**
Firebase Authentication suddenly started throwing `auth/network-request-failed` errors, even though the authentication code and Firebase configuration were correct.

**Root Cause**
A browser extension injected a `content.js` script that interfered with Firebase network requests.

**Diagnosis**
- Verified Login.jsx and firebase.js.
- Tested in Google Chrome.
- Opened the application in Incognito Mode.
- Authentication worked correctly in Incognito Mode.
- Confirmed the issue was caused by a browser extension rather than the application.

**Solution**
Disable the problematic browser extension or use a clean browser profile for development.

---

## 🔹 Future Improvements

- Add real-time bus tracking system
- Integrate database (MongoDB / Firestore)
- Improve UI/UX (dashboard design)
- Add user profile management
- Role-based access (Admin/User)

---

## 🔹 What I Learned

- Implementing authentication using Firebase
- Handling routing using React Router
- Managing protected routes
- Debugging real-world issues
- Structuring a scalable React project

---

## 🔹 Author

**Aniketh Roy Chowdhury**

---

## 🔹 How to Run Locally

```bash
npm install
npm run dev