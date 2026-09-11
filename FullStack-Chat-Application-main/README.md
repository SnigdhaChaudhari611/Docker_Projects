# FullStack Chat Application -- Dockerized 3-Tier Deployment

A full-stack real-time chat application that was originally provided as
a non-Dockerized 3-tier application. As part of this practical, the
application was containerized, optimized, orchestrated with Docker
Compose, deployed on an AWS EC2 instance, and configured with persistent
MongoDB storage.

## Original Application

This project was forked from the following public repository:

**Original Repository:**
https://github.com/ArpanSurin/FullStack-Chat-Application

**Dockerized Fork:**
https://github.com/CrystallyRains/FullStack-Chat-Application

The original application was not Dockerized. Dockerfiles and Docker
Compose configuration were added as part of this practical.

## Project Overview

The application provides a real-time chat experience where users can:

-   Create an account
-   Log in and log out
-   Update their profile
-   View available users
-   Start conversations
-   Send and receive messages
-   Continue previous conversations after logging back in

The application uses React/Vite for the frontend, Node.js and Express.js
for the backend, MongoDB for persistent application data, and Socket.IO
for real-time communication.

## Technology Stack

  Layer                     Technology
  ------------------------- ---------------------
  Frontend                  React, Vite
  Backend                   Node.js, Express.js
  Real-time communication   Socket.IO
  Database                  MongoDB
  Authentication            JWT
  HTTP client               Axios
  Containerization          Docker
  Orchestration             Docker Compose
  Cloud deployment          AWS EC2

------------------------------------------------------------------------

# 3-Tier Architecture

The application follows a 3-tier architecture:

``` text
                         Internet
                            |
                            v
                     AWS EC2 Instance
                            |
                +-----------+-----------+
                |                       |
           Port 5173                Port 8080
                |                       |
                v                       v
        +---------------+       +---------------+
        |   Frontend    |       |    Backend    |
        | React / Vite  |       | Node / Express|
        +---------------+       +---------------+
                                        |
                                        |
                                  chatapp-net
                                        |
                                        v
                                +---------------+
                                |    MongoDB    |
                                |    Database   |
                                +---------------+
                                        |
                                        v
                                Named Docker Volume
                                /data/db
```

The final system design diagram is provided separately as part of the
practical submission.

## Public vs Internal Access

  Component      Port Access
  ----------- ------- ---------------
  Frontend       5173 Public
  Backend        8080 Public
  MongoDB       27017 Internal only

MongoDB is not exposed to the public EC2 interface. The backend
communicates with MongoDB through the Docker network using the Compose
service name:

``` text
database:27017
```

This avoids hardcoded container IP addresses.

------------------------------------------------------------------------

# Dockerization

The application was divided into three Docker services:

``` text
frontend
backend
database
```

Separate Dockerfiles were created for the frontend and backend.

## Project Docker Files

``` text
FullStack-Chat-Application/
│
├── backend/
│   ├── Dockerfile
│   └── .dockerignore
│
├── frontend/
│   ├── Dockerfile
│   └── .dockerignore
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

------------------------------------------------------------------------

# Frontend Dockerfile

The frontend uses a multi-stage Docker build.

### Build stage

The build stage:

1.  Uses a Node.js Alpine development image.
2.  Sets `/app` as the working directory.
3.  Copies the package files.
4.  Installs dependencies using `npm ci`.
5.  Copies the frontend source code.
6.  Receives `VITE_API_URL` as a build argument.
7.  Builds the Vite application using `npm run build`.

### Runtime stage

The runtime stage:

1.  Uses the Node.js Alpine runtime image.
2.  Copies only the generated `dist` directory from the builder stage.
3.  Copies `server.js`.
4.  Exposes port `5173`.
5.  Starts the application using Node.js.

This keeps the final runtime image separate from the build environment.

------------------------------------------------------------------------

# Backend Dockerfile

The backend also uses a multi-stage build.

### Build stage

The builder stage:

1.  Uses a Node.js Alpine development image.
2.  Sets `/app` as the working directory.
3.  Copies the package files.
4.  Installs only production dependencies using:

``` bash
npm ci --omit=dev
```

5.  Copies the backend source code.

### Runtime stage

The runtime stage:

1.  Uses the Node.js Alpine runtime image.
2.  Copies the production `node_modules`.
3.  Copies the required package files and source code.
4.  Sets `NODE_ENV=production`.
5.  Runs as the non-root `node` user.
6.  Exposes port `8080`.
7.  Starts the backend using:

``` bash
node src/index.js
```

Running the application as a non-root user provides an additional
container security improvement.

------------------------------------------------------------------------

# Docker Image Optimization

Image optimization was an important part of the practical.

The following techniques were used:

## 1. Multi-stage builds

Separate builder and runtime stages prevent unnecessary build-time files
and dependencies from being included in the final runtime images.

## 2. Alpine-based Node.js images

The Dockerfiles use:

``` text
dhi.io/node:24-alpine3.23-dev
```

for the build stage and:

``` text
dhi.io/node:24-alpine3.23
```

for the runtime stage.

This provides a smaller runtime base than the development image.

## 3. Production dependencies

The backend uses:

``` bash
npm ci --omit=dev
```

so development dependencies are excluded from the backend image.

## 4. .dockerignore

Separate `.dockerignore` files were created for the frontend and backend
to prevent unnecessary files from being sent to the Docker build
context.

Examples include:

``` text
node_modules
.git
.env
*.md
```

## 5. Non-root runtime

The backend runtime container uses the `node` user rather than running
the application as root.

------------------------------------------------------------------------

# Final Docker Image Sizes

The final application image sizes were verified using:

``` bash
docker images
```

  -----------------------------------------------------------------------
  Application    Earlier Image Size   Final Image Size  Approx. Reduction
  -------------- ------------------ ------------------ ------------------
  Backend                    293 MB             192 MB              34.5%

  Frontend                   734 MB             364 MB              50.4%
  -----------------------------------------------------------------------

The optimized application images were:

``` text
backend-dhi:latest
frontend-dhi:latest
```

The final runtime base image used by the application is:

``` text
dhi.io/node:24-alpine3.23
```

MongoDB is a separate database service and its image size is not
included in the application image optimization comparison.

------------------------------------------------------------------------

# Docker Compose

Docker Compose is used to orchestrate the complete application.

The Compose configuration defines:

-   Frontend service
-   Backend service
-   MongoDB database service
-   Custom Docker network
-   MongoDB named volume
-   Environment variables
-   Required port mappings

The application can be started with:

``` bash
docker compose up -d --build
```

Running containers can be checked with:

``` bash
docker ps
```

------------------------------------------------------------------------

# Networking

A custom Docker network is used so that the application services can
communicate by service name.

``` text
Frontend
   |
   | HTTP/API requests
   v
Backend
   |
   | MongoDB connection
   v
Database
```

The backend connects to MongoDB using:

``` text
database:27017
```

instead of using a hardcoded IP address.

## Port Exposure

Only the ports required to access the application are mapped to the EC2
host:

``` yaml
ports:
  - "5173:5173"
```

and:

``` yaml
ports:
  - "8080:8080"
```

MongoDB uses port `27017` internally and is not mapped to the EC2 host.

This keeps the database service internal to the Docker network.

------------------------------------------------------------------------

# Persistent MongoDB Data

MongoDB data is stored using a named Docker volume instead of relying
only on the writable layer of the database container.

The MongoDB container mounts persistent storage at:

``` text
/data/db
```

The Compose project creates the named volume:

``` text
fullstack-chat-application_mongodb
```

## Persistence Verification

Persistence was tested by:

1.  Starting the application with Docker Compose.
2.  Creating two user accounts.
3.  Logging in from separate browser sessions.
4.  Creating a conversation and sending messages.
5.  Stopping/recreating the database container.
6.  Starting the application again.
7.  Logging back in and verifying that the previously created users and
    conversation data were still available.

This demonstrates that the application data is stored in the Docker
volume rather than existing only inside the MongoDB container.

------------------------------------------------------------------------

# Environment Configuration

Environment-specific values are kept outside the application source
code.

The application uses environment variables including:

``` text
JWT_SECRET
MONGODB_URI
VITE_API_URL
```

The actual `.env` file is excluded from Git using `.gitignore` so that
secrets are not committed to the repository.

A `.env.example` file is included to document the required configuration
variables without exposing actual secret values.

------------------------------------------------------------------------

# Running the Application

## Prerequisites

-   Docker
-   Docker Compose
-   Git
-   An AWS EC2 instance for cloud deployment

## Clone the repository

``` bash
git clone https://github.com/CrystallyRains/FullStack-Chat-Application.git
cd FullStack-Chat-Application
```

## Configure environment variables

Create the required `.env` configuration based on `.env.example`.

Do not commit the actual `.env` file.

## Build and start

``` bash
docker compose up -d --build
```

## Check running containers

``` bash
docker ps
```

The expected services are:

``` text
frontend
backend
database
```

## Access the application

When deployed on EC2:

``` text
http://<EC2-PUBLIC-IP>:5173
```

------------------------------------------------------------------------

# AWS EC2 Deployment

The Dockerized application was deployed on an Ubuntu AWS EC2 instance.

The deployment flow was:

``` text
AWS EC2
   |
   v
Clone GitHub repository
   |
   v
Configure environment variables
   |
   v
Build Docker images
   |
   v
docker compose up -d
   |
   v
Verify containers
   |
   v
Access application through EC2 public IP
```

The EC2 Security Group was configured to allow the application ports
required for external access.

MongoDB port `27017` was not exposed publicly.

------------------------------------------------------------------------

# Deployment Verification

The deployment was verified through the following checks:

-   Frontend container running successfully.
-   Backend container running successfully.
-   MongoDB container running successfully.
-   Backend successfully connecting to MongoDB.
-   Frontend accessible through the EC2 public IP.
-   User registration working.
-   User login/logout working.
-   Multiple users able to access the application.
-   Real-time chat functionality working.
-   Previous messages remaining available after logging back in.
-   MongoDB data surviving database container recreation.

------------------------------------------------------------------------

# Git Practices

The project was developed using Git with multiple meaningful commits
rather than one large final commit.

The commit history records the progression of the Dockerization work,
including changes such as:

-   Adding Dockerfiles
-   Adding `.dockerignore` files
-   Adding Docker Compose
-   Configuring environment variables
-   Updating frontend/backend configuration
-   Adding persistence and networking configuration
-   Updating project documentation

A `.gitignore` file is used to prevent files such as `.env`,
`node_modules`, build output, logs, and local configuration files from
being committed.

------------------------------------------------------------------------

# Key Learnings

This practical provided hands-on experience with:

-   Dockerizing an existing 3-tier application.
-   Writing separate Dockerfiles for frontend and backend applications.
-   Multi-stage Docker builds.
-   Docker image size optimization.
-   Alpine-based runtime images.
-   `.dockerignore` and Docker build context.
-   Docker Compose.
-   Custom Docker networking.
-   Service-name based container communication.
-   Docker volumes and database persistence.
-   Running containers as a non-root user.
-   Environment-based configuration.
-   Deploying a containerized application on AWS EC2.
-   Configuring EC2 Security Groups.
-   Troubleshooting real deployment issues involving ports, environment
    variables, API configuration, authentication, and container
    communication.
-   Using Git to maintain meaningful development history.

------------------------------------------------------------------------

# Project Structure

``` text
FullStack-Chat-Application/
│
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── src/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

------------------------------------------------------------------------

# Practical Outcome

The original non-Dockerized 3-tier chat application was successfully
transformed into a containerized application consisting of separate
frontend, backend, and database services.

The final setup provides:

-   Separate application containers
-   Optimized multi-stage Docker images
-   Custom Docker networking
-   Internal MongoDB communication
-   Persistent MongoDB storage
-   Environment-based configuration
-   AWS EC2 deployment
-   Git-based version history

The application was tested end-to-end, including user authentication,
real-time chat, and database persistence.
