const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");

const {
  PORT,
  HTTP_STATUS_CODES,
  DATABASE_URL,
  TEST_DATABASE_URL
} = require("./config");

const { authRouter } = require("./auth/auth.router");
const { userRouter } = require("./user/user.router");

const { localStrategy, jwtStrategy } = require("./auth/auth.strategy");

let server;

const app = express();
passport.use(localStrategy);
passport.use(jwtStrategy);

//MIDDLEWARE
app.use(morgan("combined"));
app.use(express.json());
// app.use(express.static(./public)); Probably do not need this for React

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use("*", function(req, res) {
  res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
    error: "Not found."
  });
});

module.exports = { app, startServer, stopServer };

function startServer(testEnv){
    return new Promise((resolve, reject) = {
        let mongoUrl;

        if(testEnv) {
            mongoUrl = TEST_DATABASE_URL;
        } else {
            mongoUrl = DATABASE_URL;
        }

        mongoose.connect(mongoUrl, {
            useNewUrlParser: true
        }, err => {

            if (err) {
                console.error(err);
                return reject(err);
            } else {
                server = app.listen(PORT, () => {
                    console.log(`Express server listening on http://localhost:${PORT}`);
                    resolve();
                }).on('error', err => {
                    mongoose.disconnect();
                    console.error(err);
                    reject(err);
                });
            }
    }); 
  
    });
}


function stopServer(){
    return mongoose
        .disconnect()
        .then(() => new Promise((resolve,reject) => {
            server.close(err => {
                if(err) {
                    console.error(err);
                    return reject(err);
                } else {
                    console.log('Express server stopped');
                    resolve();
                }
            })
        }));
};