# Scuffed UNO

A real-time multiplayer UNO-style card game built with React, Tailwind CSS, Socket.IO, and Express.

## Features
- Multiplayer gameplay with real-time syncing via Socket.IO
- Stacking rules (+2 on +2, +4 on +4)
- Jump-in rules (play out of turn if you have an exact matching card)
- "No Mercy" mode and "Rule 7-0" support
- Dynamic card animations and layout transitions
- In-game chat system

## Running with Docker

You can easily run this application in an isolated container using Docker.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed on your machine.

### 1. Build the Docker image
Open your terminal in the root directory of the project (where the `Dockerfile` is located) and run:

```bash
docker build -t scuffed-uno .
```

### 2. Run the Docker container
Once the build is complete, you can start the container. The application runs on port `3000` by default.

```bash
docker run -p 3000:3000 -d --name scuffed-uno-app scuffed-uno
```

### 3. Access the application
Open your web browser and navigate to:
[http://localhost:3000](http://localhost:3000)

### Stopping the container
To stop the running game server:
```bash
docker stop scuffed-uno-app
```

To remove the container completely:
```bash
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
