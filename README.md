# ProjectWatch Nepal 🇳🇵

ProjectWatch Nepal is a digital public-project monitoring platform designed to improve transparency, project tracking, field reporting, complaints, evidence management, alerts, and public access to project information.

---

## 🚀 Project Overview

ProjectWatch Nepal provides separate experiences for:

- 👥 Citizens / Public users
- 👨‍💼 Administrators
- 👷 Field officers

Citizens can explore public projects and submit reports or complaints without creating an account.

Administrators and authorized officers can manage projects, field reports, evidence, complaints, alerts, notifications, users, reports, and system settings.

---

## ✨ Main Features

### 🌐 Public Portal

- Public project listing
- Project search
- Project filtering
- Project details
- Project status
- Project progress
- Project risk information
- Public map
- Public complaint/report submission

### 🔐 Authentication

- Admin login
- Officer login
- JWT authentication
- Protected admin routes
- Role-based access control
- Session expiration handling

### 📊 Dashboard

- Project statistics
- Project status summary
- Province summary
- Progress information
- Risk information
- Dashboard charts
- Last updated information

### 📁 Project Management

- Create project
- Generate project code
- View project
- Edit project
- Delete project
- Search projects
- Filter projects
- Sort projects
- Project pagination
- Project timeline
- Project progress history

### 👷 Field Reports

- Create field reports
- View field reports
- Update field reports
- Project progress tracking
- Officer information
- Project timeline integration

### 📷 Evidence Management

- Evidence upload
- Evidence listing
- Project filtering
- Evidence review
- Approve evidence
- Reject evidence
- Delete evidence

### 📝 Complaints

- Admin complaint management
- Public complaint submission
- Complaint status
- Complaint priority
- Complaint category
- Complaint search and filtering

### 🚨 Alerts

- Project risk alerts
- Critical alerts
- Automatic alert generation
- Alert filtering
- Alert resolution

### 🔔 Notifications

- Notification bell
- Unread notification count
- Notification popup
- Mark notification as read
- Mark all notifications as read
- Full notification page

### 👥 User Management

- User listing
- Search users
- Role filtering
- Status filtering
- Activate/deactivate users
- Role management

### ⚙️ Settings

- Personal settings
- Notification preferences
- Critical alert preferences
- Field report preferences
- Complaint update preferences
- Completion alert preferences

### 📋 Audit Logs

- Administrative activity logs
- User information
- Action information
- Timestamp information

### 🖥️ System Management

- System health
- API health
- Database status
- Release status
- API testing page

---

# 🛠️ Technology Stack

## Frontend

- React
- React Router
- Vite
- JavaScript
- CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- CORS
- Helmet
- Express Rate Limit

---

# 📂 Project Structure

```text
projectwatch-nepal/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.js
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── README.md