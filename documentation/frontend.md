# Frontend documentation

### Technologies

* Typescript

* React

* Monaco editor

* Docker

* ESLint

### Starting frontend without backend

##### Without docker
1. Go to `frontend` folder
2. Run `yarn` to install depencies
3. Run `yarn start` and the application should launch to `localhost:3000`

##### With docker
1. Go to `frontend` folder
2. Run `docker build --tag frontend .` to build the frontend image
3. Start the image with `docker run -p 3000:3000 frontend` and the application should launch to `localhost:3000`
