# Secure Chat Application

![MERN](https://img.shields.io/badge/MERN-stack-0f172a)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Node](https://img.shields.io/badge/Node.js-22-339933)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)
![License](https://img.shields.io/badge/License-MIT-green)

Secure Chat Application is a push-ready full stack portfolio repository with authentication, protected APIs, dashboard UI, Docker support, CI workflow, and professional documentation.

## Features

- End-to-end encryption
- Real-time messaging
- File sharing
- Authentication
- JWT authentication and role-aware middleware
- React dashboard with analytics
- REST API for messages
- Docker Compose for local full stack execution
- GitHub Actions, issue templates, PR template, and security policy

## Architecture

~~~mermaid
flowchart LR
    Browser[React Client] --> API[Express API]
    API --> Auth[JWT Auth]
    API --> Store[Domain Store]
    API --> Analytics[Analytics Endpoint]
    CI[GitHub Actions] --> API
    CI --> Browser
~~~

## Installation

~~~bash
cd server
npm install
npm run dev
~~~

In another terminal:

~~~bash
cd client
npm install
npm run dev
~~~

## Docker Deployment

~~~bash
docker compose up --build
~~~

## API Documentation

- POST /api/auth/register
- POST /api/auth/login
- GET /api/messages
- POST /api/messages
- PATCH /api/messages/:id
- GET /api/analytics
- GET /api/admin/audit

## Testing Guide

~~~bash
cd server
npm install
npm test

cd ../client
npm install
npm run build
~~~

## Screenshots

Add screenshots after running the local app:

- Authentication panel
- Analytics dashboard
- messages list
- CI pipeline

## Security Considerations

- Replace JWT_SECRET before deployment.
- Use persistent storage for production.
- Add request rate limiting and centralized audit logs.
- Keep API keys and payment credentials in managed secrets.
