# Health-Information-System
Simple Health Information management System with DJango and React Vite Frontend for tracking clients, programs, and enrollments.

# Features

- Secure authentication with OTP verification
- Client management (CRUD operations)
- Health program management
- Program enrollment tracking
- Dashboard with real-time statistics
- Advanced search functionality
- Responsive design

# Tech Stack

## Frontend
- react 19.0.0
- react dom 19.0.0
- react router dom 7.5.1
- bootstrap 5
- chart.js 4.4.9
- axios 1.8.4
- @popperjs/core 2.11.8

## Backend
- django==5.2
- django-cors-headers==4.7.0
- django_celery_results==2.6.0
- djangorestframework==3.16.0
- mysqlclient==2.2.7
- pillow==11.2.1

# Prerequisites

- Python 3.11+
- Node.js 20.19.0
- MySql 
- Git 2.39.5

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/Wilco619/Health-Information-System.git
cd Health-Information-System
```

## 2. Backend Setup

Create and activate a virtual environment:

```bash
python -m venv env911
source env911/bin/activate  # On Windows use: env911\Scripts\activate
```

Install Python dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Configure the database:

```bash
# Create a .env file in the backend directory
echo "DB_ENGINE=django.db.backends.mysql
DB_NAME=health_system_db
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306" > .env
```

Run migrations:

```bash
python manage.py migrate
```

Create a superuser:

```bash
python manage.py createsuperuser
```

## 3. Frontend Setup

Install Node.js dependencies:

```bash
npm create vite@latest frontend .
- react
- javascript
cd ../frontend
npm install
```

## 4. Running the Application

Start the backend server:

```bash
# In the backend directory
python manage.py runserver
```

Start the frontend development server:

```bash
# In the frontend directory
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Admin Interface: http://localhost:8000/admin

# Project Structure

```
health_information_system/
├── health_system/           # Main 
│   ├── __init__.py
│   ├── asgi.py
│   ├── celery.py            # Celery 
│   ├── settings.py          # Project 
│   ├── urls.py              # Main URL 
│   └── wsgi.py
├── patients/                # Patients app
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py            
│   ├── permissions.py       # Custom 
│   ├── serializers.py       # DRF 
│   ├── signals.py           # Django 
│   ├── tasks.py             # Celery tasks
│   ├── templates/           # Email 
│   │   └── emails/
│   │       ├── program_enrollment.html
│   │       └── welcome_email.html
│   ├── tests.py
│   ├── urls.py              # App URL 
│   └── views.py             # ViewSets 
├── authentication/          
│   ├── __init__.py
    ├── templates/           # Email 
│   │   └── emails/
│   │       └── otp_email.html
│   ├── admin.py
│   ├── apps.py
│   ├── models.py            # OTP model
│   ├── serializers.py       
│   ├── tasks.py             # Email 
│   ├── tests.py
│   ├── urls.py
│   └── views.py             
├── manage.py
└── requirements.txt

frontend/
├── public/            # Staticfiles
│   └── vite.svg
├── src/                # Source code
│   ├── assets/         # Images and static assets
│   │   └── react.svg
│   ├── auth/           
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── OTPVerification.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.jsx
│   │   └── services/
│   │       └── api.jsx
│   ├── components/     # Main application components
│   │   ├── Dashboard.jsx
│   │   ├── Navbar.jsx
│   │   ├── clients/
│   │   │   ├── ClientList.jsx
│   │   │   ├── ClientProfile.jsx
│   │   │   ├── ClientRegistration.jsx
│   │   │   ├── ClientEdit.jsx
│   │   │   └── ClientEnrollment.jsx
│   │   └── programs/
│   │       └── ProgramList.jsx
│   ├── App.jsx        # Main application component
│   ├── App.css        # Main styles
│   ├── main.jsx       # Application entry point
│   └── index.css      # Global styles
├── index.html         # HTML template
├── package.json       # Dependencies and scripts
├── vite.config.js     # Vite configuration
├── eslint.config.js   # ESLint configuration
└── README.md         # Frontend documentation
```

## Key Directories and Files

### `/src/auth/`
- `components/` - Authentication-related components
  - `LoginForm.jsx` - User login interface
  - `OTPVerification.jsx` - OTP verification interface
  - `ProtectedRoute.jsx` - Route protection wrapper
- `contexts/` - React context providers
  - `AuthContext.jsx` - Authentication state management
- `hooks/` - Custom React hooks
  - `useAuth.jsx` - Authentication hook
- `services/` - API services
  - `api.jsx` - Axios configuration and API calls

### `/src/components/`
- `Dashboard.jsx` - Main dashboard with statistics
- `Navbar.jsx` - Navigation component
- `clients/` - Client management components
  - `ClientList.jsx` - List of all clients
  - `ClientProfile.jsx` - Individual client view
  - `ClientRegistration.jsx` - New client registration
  - `ClientEdit.jsx` - Edit client information
  - `ClientEnrollment.jsx` - Program enrollment
- `programs/` - Program management components
  - `ProgramList.jsx` - Program CRUD operations

### Root Files
- `App.jsx` - Main component with routing
- `main.jsx` - Application entry point
- `index.html` - HTML template
- `vite.config.js` - Vite bundler configuration

# API Endpoints

## Authentication
- POST `/api/auth/login/` - Login
- POST `/api/auth/verify-otp/` - OTP verification

## Clients
- GET/POST `/api/clients/` - List/Create clients
- GET/PUT/DELETE `/api/clients/{id}/` - Retrieve/Update/Delete client
- GET `/api/clients/{id}/profile/` - Client profile
- POST `/api/clients/search/` - Search clients

## Programs
- GET/POST `/api/programs/` - List/Create programs
- GET/PUT/DELETE `/api/programs/{id}/` - Retrieve/Update/Delete program

## Enrollments
- POST `/api/clients/{id}/enroll/` - Enroll client in program
- DELETE `/api/clients/{id}/enrollments/{enrollment_id}/` - Remove enrollment

## Dashboard
- GET `/api/dashboard/` - Dashboard statistics

# Security Features

- Rest_framework TokenAuthentication
- OTP verification for login
- CORS protection
- CSRF protection
- Password hashing


# Deployment

1. Set `DEBUG=False` in backend `settings.py`
2. Configure production database
3. Set up static files serving
4. Configure CORS settings
5. Set up proper SSL/TLS
6. Configure production web server (e.g., Nginx/Apache)
7. Build react file `npm run build`