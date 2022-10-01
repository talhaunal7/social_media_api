# social-media-api

## Tech stack & Open-source libraries

### Server - Backend

* 	[Node.js](https://nodejs.org/en/) - Development platform for executing JavaScript code server-side
* 	[Express.js](https://expressjs.com/) - Node.js web application framework

### Data

* 	[mongoDB](https://github.com/talhaunal7/social_media_api/tree/main/src/Models) - open source NoSQL database management program

###  Libraries and Plugins

* 	[JWT Security with Bearer Token](https://jwt.io/) - Provide secure endpoints.
* 	[Swagger](https://swagger.io/) - Open-Source software framework backed by a large ecosystem of tools that helps developers design, build, document, and consume RESTful Web services.
* 	[Postman](https://www.postman.com/) - Postman is a collaboration platform for API development. Postman's features simplify each step of building an API and streamline collaboration so you can create better APIs—faster
* 	[Helmet](https://www.npmjs.com/package/helmet) -  secure your Express apps by setting various HTTP headers.
* 	[Morgan](https://www.npmjs.com/package/morgan) -  HTTP request logger middleware for node.js

### Others 

* 	[Git](https://git-scm.com/) - Free and Open-Source distributed version control system.
* 	[Mongoose](https://mongoosejs.com/) - mongoDB object modeling tool designed to work in an asynchronous environment.

## Documentation

* 	[Swagger](http://localhost:8800/api-docs) - `http://localhost:8800/api-docs`- Documentation & Testing

## Running the application
### 1) Clone the repository, install node packages  and verify routes locally

``` 
//on local
git clone https://github.com/talhaunal7/social_media_api
cd social_media_api
npm install
npm start
```
### 2) Create a .env file, set your token secrets and mongoDB connection link

```
cd social_media_api
touch .env
MONGODB_URL=mongodburlexample
PASSWORD_SECRET=secretexample
ACCESS_TOKEN_SECRET=secretexample
```
<br>
<img src="https://i.imgur.com/49AAr59.png"/>

