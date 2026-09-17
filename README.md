# Docker Projects

Hands-on Docker projects focused on **containerization, Docker Compose, multi-stage builds, networking, volumes, image optimization, and container security**.

This repository contains practical Docker work built while developing my DevOps skills through real application stacks.

## Projects

### 🐳 Full Stack Chat Application

A containerized full-stack chat application using separate frontend, backend, and database services.

**Practiced:**

* Dockerizing frontend and backend applications
* Multi-container application architecture
* Container networking
* Database containers
* Docker image builds
* Service communication

### 🐳 SocialPulse

A containerized social networking application using a multi-service architecture.

**Practiced:**

* Docker Compose
* Frontend and backend containers
* MySQL database
* Redis caching
* Healthchecks
* Restart policies
* Named volumes
* Custom Docker networks
* Multi-stage Docker builds

## Docker Concepts Practiced

### Containerization

* Writing Dockerfiles
* Building custom images
* Running applications in containers
* Container lifecycle management
* Port mapping
* Environment variables

### Docker Compose

* Multi-container applications
* Services
* Networks
* Volumes
* Healthchecks
* Service dependencies
* Restart policies

Example architecture:

```text
Frontend
   |
   v
Backend API
   |
   +--------> MySQL
   |
   +--------> Redis
```

### Multi-Stage Builds

Used multi-stage Dockerfiles to separate the **build environment from the runtime environment**.

```text
Builder Stage
     ↓
Install dependencies
     ↓
Build application
     ↓
Runtime Stage
     ↓
Run application
```

This helps reduce unnecessary dependencies and keeps the final runtime image focused on what the application actually needs.

### Image Optimization

Practiced techniques including:

* Multi-stage builds
* `.dockerignore`
* Smaller base images
* Removing unnecessary dependencies
* Docker Hardened Images
* Non-root containers

### Container Security

Hands-on practice with:

* Running containers as non-root users
* Docker Hardened Images
* Minimizing runtime dependencies
* Reducing unnecessary packages and attack surface

## Technologies

**Containers:** Docker
**Orchestration:** Docker Compose
**Applications:** React, Node.js
**Databases:** MySQL, MongoDB
**Caching:** Redis
**Build:** Multi-stage Dockerfiles
**Security:** Non-root containers, Docker Hardened Images

## What I'm Learning

The focus of these projects is not just learning Docker commands, but understanding how Docker is used to package, connect, secure, and run real applications.

Current areas of focus:

```text
Docker
  ↓
Docker Compose
  ↓
Networking & Volumes
  ↓
Multi-Stage Builds
  ↓
Image Optimization
  ↓
Container Security
  ↓
CI/CD
```

These projects are part of my broader **DevOps learning journey**, alongside AWS, Terraform, Linux, and GitHub Actions.

## Related

**GitHub Actions Practice:**
https://github.com/SnigdhaChaudhari611/github-actions-practice

**90 Days of DevOps:**
https://github.com/SnigdhaChaudhari611/90DaysOfDevOps

---

**DevOps Engineer | AWS | Docker | Terraform | CI/CD**
