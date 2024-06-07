
# Weather App

This project consists of two services:
1. A Vue.js application built with Vite.
2. A NestJS application.

Both services are dockerized, and the root project is set up with Docker Compose to run both services simultaneously.

## Video Evidence
https://drive.google.com/file/d/15rw9UxIO-9790C-1PDrS1_p3d9y7qxKE/view?usp=sharing

## Prerequisites

- Docker installed on your machine. You can download it from [here](https://www.docker.com/get-started).
- Docker Compose installed. Instructions for installation can be found [here](https://docs.docker.com/compose/install/).

## Project Structure

```
/weather-app
  /weather-ui
    Dockerfile
    docker-compose.yml
    nginx.conf
    ... (other Vue+Vite project files)
  /weather-service
    Dockerfile
    docker-compose.yml
    ... (other NestJS project files)
  docker-compose.yml  (combined)
```

## Steps to Run the Project

### 1. Clone the Repository

Clone this repository to your local machine:

```sh
git clone https://github.com/salil2008/weather-app.git
cd weather-app
```

### 2. Build and Run the Docker Containers

Ensure you are in the `weather-app` directory and run the following command to build and start both services:

```sh
docker-compose up --build
```

This command will:

1. Build the Docker images for both the Vue+Vite and NestJS applications.
2. Start the containers for both applications.

### 3. Access the Applications

Once the containers are up and running, you can access the applications at the following URLs:

- **Vue+Vite Application**: [http://localhost](http://localhost)
- **NestJS Application**: [http://localhost:3000](http://localhost:3000)

## Individual Service Details

### Vue+Vite Application

The Vue.js application is set up with Vite for fast builds and hot module replacement. It is served using an Nginx server within the Docker container.

- **Dockerfile**: Contains the instructions to build the Vue.js application and serve it using Nginx.
- **nginx.conf**: Configuration file for Nginx to serve the Vue.js application.

### NestJS Application

The NestJS application is a backend service that runs on Node.js. It is built and served from the `dist` directory within the Docker container.

- **Dockerfile**: Contains the instructions to build and serve the NestJS application.

## Stopping the Services

To stop the running containers, use the following command:

```sh
docker-compose down
```

This will stop and remove the containers, but the images will remain cached.

## Troubleshooting

If you encounter any issues, ensure that Docker and Docker Compose are installed correctly and running. Check for any errors in the console output for more details.

For further assistance, refer to the official documentation for [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).

## Contributing

Feel free to contribute to this project by submitting issues or pull requests. Contributions are always welcome!

## License

This project is licensed under the MIT License.
