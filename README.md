# TaskFlow – Full Stack Assignment

## Tech Stack
- React + Vite + TailwindCSS
- Django REST Framework
- JWT Authentication (SimpleJWT)
- MySQL
- Axios

## Features
- User authentication (JWT)
- Protected APIs
- Task CRUD
- Token refresh logic
- Responsive dashboard
- Theme/ Wallpaper Switcher
- Star/ Important Tasks

## Run Locally

### Backend
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

**## Security**
- Password hashing (Django default)
- JWT authentication middleware
- Protected API routes

**## Scalability Plan (Production)**
- Separate frontend & backend deployment
- Use environment variables for secrets
- Add refresh-token rotation
- Switch DB to PostgreSQL
- Add caching (Redis)
- Enable HTTPS + CORS whitelist
- Modular service-based backend
- Password hashing (Django default)
- JWT authentication middleware
- Protected API routes

##  Scalability Plan (Production)
- Separate frontend & backend deployment
- Use environment variables for secrets
- Add refresh-token rotation
- Switch DB to PostgreSQL
- Add caching (Redis)
- Enable HTTPS + CORS whitelist
- Modular service-based backend

**Frontend runs on**: http://localhost:5173

**Backend runs on**: http://127.0.0.1:8000




