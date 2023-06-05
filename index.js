"use strict";


const name = 'Sindre';
const chalk = require("chalk");
  console.clear();
console.log(chalk.red("[") +  chalk.white("RiceDashboard") + chalk.red("]") + chalk.white(" Loading Packages... "));
const mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var app = express();

const url = require("url");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const Strategy = require("passport-discord").Strategy;
const MemoryStore = require("memorystore")(session);

const config = require("./config/config.json")

console.log(chalk.red("[") + chalk.white("RiceDashboard") + chalk.red("]") + chalk.white(" Packages Loaded ✔️ "));
console.log(chalk.red("[") + chalk.white("RiceDashboard") + chalk.red("]") + chalk.white(" Loading Database ... "));

mongoose.connect(config.url, {

  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("OK")
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set("trust proxy",true)

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new Strategy({
  clientID: config.id,
  clientSecret: config.secret,
  callbackURL: `${config.domain}/callback`,
  scope: ["identify"]
},
(accessToken, refreshToken, profile, done) => {
  process.nextTick(() => done(null, profile));
}));

app.use(session({
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.locals.domain = config.domain.split("//")[1];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
}

const renderTemplate = (req, res, template, data = {}) => {
      const baseData = {
        path: req.path,
        user: req.isAuthenticated() ? req.user : null
      };

      res.render(__dirname + `/views/pages/${template}`, (Object.assign(baseData, data)));
}

app.get("/login", (req, res, next) => {
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL;
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/";
    }
    next();
},
passport.authenticate("discord"));

app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), (req, res) => {
    if (req.session.backURL) {
      const url = req.session.backURL;
      req.session.backURL = null;
      res.redirect(url);
    } else {
      res.redirect("/");
    }
});

app.get("/logout", function (req, res) {
  req.session.destroy(() => {
    req.logout();
    res.redirect("/");
  });
});

app.get('/test', checkAuth, async(req, res) => {
  renderTemplate(req, res, "test.ejs");
})

app.listen(config.port, function () {
    console.log('Dashboard start on port ' + config.port);
});

app.get('/', function(req, res) {
  res.render('pages/login');
})

console.log(chalk.red("[") + chalk.white("RiceDashboard") + chalk.red("]") + chalk.white(" Loading Packages... "));