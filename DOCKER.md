# Docker Integration Guide for Job Bridge Nexus

This guide explains how to use Docker with this project for development, testing, and deployment.

## 1. Docker Setup

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 2. Local Development

### Starting the Development Environment
```bash
docker-compose up dev
```
This runs the application in development mode with hot reloading at http://localhost:5173.

### Building and Running the Production Container
```bash
docker-compose up app
```
This builds and serves the production version at http://localhost:8080.

### Running Linting and Tests in Docker
```bash
docker-compose run --rm dev npm run lint
docker-compose run --rm dev npm test
```
This runs linting and tests inside the development container.

## 3. Docker Commands

### Build the Docker Image
```bash
docker build -t job-bridge-nexus:latest .
```

### Run the Docker Container
```bash
docker run -p 8080:80 job-bridge-nexus:latest
```

### Stop and Remove Containers
```bash
docker-compose down
```

## 4. CI/CD Pipeline

This project includes a GitHub Actions workflow that:
1. Runs linting and tests on every pull request and push to main
2. Builds and pushes the Docker image to Docker Hub when merged to main

### Setting up Docker Hub Integration

1. Create a Docker Hub account at https://hub.docker.com/
2. Create a repository named `job-bridge-nexus`
3. Generate an access token at https://hub.docker.com/settings/security
4. Add these secrets to your GitHub repository:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Your Docker Hub access token

## 5. Benefits of Docker Integration

- **Consistent Environment**: Ensures the app runs the same in all environments
- **Easier Deployment**: Simplifies deployment to any platform supporting Docker
- **Isolated Dependencies**: Keeps project dependencies isolated from the host system
- **Scalability**: Facilitates horizontal scaling in production
- **CI/CD Integration**: Streamlines testing and deployment pipelines
- **Quality Assurance**: Lint and test in the same environment as production

## 6. Project Structure

- `Dockerfile`: Multi-stage build for optimal production images
- `.dockerignore`: Excludes unnecessary files from the Docker build
- `docker-compose.yml`: Defines services for development and production
- `nginx.conf`: Configuration for serving the React SPA
- `.github/workflows/docker-ci-cd.yml`: CI/CD pipeline definition
- `eslint.config.js`: Linting configuration 