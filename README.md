# SpendWise Backend

A simple Node.js + Express + TypeScript backend with a health-check endpoint, built as part of the Thaariva Technologies internship program.

## Setup

1. Clone the repo
2. Run `npm install`
3. Run `npm run dev` to start the server locally
4. Visit `http://localhost:3000/health` — should return `{"status":"ok"}`

## Run with Docker

1. Build the image: `docker build -t spendwise-backend .`
2. Run the container: `docker run -p 3000:3000 spendwise-backend`
3. Visit `http://localhost:3000/health`

## Run tests