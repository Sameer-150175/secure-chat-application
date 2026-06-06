# Architecture

~~~mermaid
flowchart LR
    User[User] --> Client[React Client]
    Client --> API[Express API]
    API --> Auth[JWT Auth]
    API --> Domain[Domain Routes]
    Domain --> Store[In-Memory Store]
    API --> Analytics[Analytics]
    CI[GitHub Actions] --> Client
    CI --> API
~~~

## Components

- React client for dashboard workflows.
- Express API for authentication, domain records, RBAC checks, and analytics.
- JWT authentication with role-aware middleware.
- Docker Compose for local full stack execution.
- CI workflow for server tests, client build, and Docker build.
