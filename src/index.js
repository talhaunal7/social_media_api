const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./Routes/users");
const authenticateRoute = require("./Routes/authenticate");
const postRoute = require("./Routes/posts");
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require("swagger-jsdoc");

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true }, (err) => {
    if (err) console.log(err)
    else console.log("mongdb is connected");
});

const options = {
    definition: { 
        openapi: "3.0.0",
        info: {
            title: "Social Media API",
            version: "1.0.0",
            description: "A Simple Social Media API"
        },
        servers: [
            {
                url: "http://localhost:8800"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ["./src/Routes/*.js"]
};

const specs = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))


app.use(express.json());
app.use(morgan("common"));
app.use(helmet());

app.use("/users", userRoute);
app.use("/auth", authenticateRoute);
app.use("/posts", postRoute);




app.listen(8800, () => {
    console.log("server started on port 8800");
})