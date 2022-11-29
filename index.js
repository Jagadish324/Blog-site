const express = require("express");
const fs = require('fs');
const admin_route = require("./Router/admin_route");
const path  = require('path');
const dotenv = require('dotenv');
const session = require('express-session')
const bodyParser = require('body-parser')
const flash = require('connect-flash');



dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
// console.log(__dirname);

app.use(express.urlencoded({extended:true}))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(flash());

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true
    // cookie: { secure: true }
  }));

app.use((req, res, next) => {
    res.locals.token = req.session.token;
    res.locals.user_info = req.session.user_info;
    res.locals.messages = req.flash();
    next();
})


app.use(admin_route.routers)

require('./config/database')();

app.listen(PORT, () => {
    console.log(`App runningon port: ${PORT}`);
})