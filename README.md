# Scuffed UNO

A real-time multiplayer UNO-style card game built with React, Tailwind CSS, Socket.IO, and Express.

## Features
- Multiplayer gameplay with real-time syncing via Socket.IO
- Stacking rules (+2 on +2, +4 on +4)
- Jump-in rules (play out of turn if you have an exact matching card)
- "No Mercy" mode and "Rule 7-0" support
- Dynamic card animations and layout transitions
- In-game chat system

## Running with Docker Compose (Recommended)

Using Docker Compose is the easiest way to run the application, as it handles building and port mapping automatically.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed on your machine (Docker Desktop includes Docker Compose).

### Start the application
Open your terminal in the root directory of the project and run:

```bash
docker compose up -d
```
*(If you have an older version of Docker, you might need to use `docker-compose up -d`)*

### Access the application
Open your web browser and navigate to:
[http://localhost:3000](http://localhost:3000)

### Stop the application
```bash
docker compose down
```

---

## Running with pure Docker (Alternative)

If you don't want to use Docker Compose, you can use the standard Docker commands:

1. **Build the Docker image**
   ```bash
   docker build -t scuffed-uno .
   ```

2. **Run the Docker container**
   ```bash
   docker run -p 3000:3000 -d --name scuffed-uno-app scuffed-uno
   ```

**Troubleshooting Port & Name Conflicts:**
- If you see `Bind for 0.0.0.0:3000 failed: port is already allocated`, another service on your machine is using port 3000. You can map it to a different host port (like 3010) while still targeting the container's 3000 port:
  ```bash
  docker run -p 3010:3000 -d --name scuffed-uno-app scuffed-uno
  ```
  *(Then access it at `http://localhost:3010`)*
- If you see `The container name "/scuffed-uno-app" is already in use`, you must remove the old container before running it again:
  ```bash
  docker rm scuffed-uno-app
  ```

3. **Stop and Remove the container**
   ```bash
   docker stop scuffed-uno-app
   docker rm scuffed-uno-app
   ```

## Local Development (Without Docker)

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Start the production build:
```bash
npm start
```
