#!/usr/bin/env nodejs

'use strict';


const fs = require('fs');
const process = require('process');
const options = require('./options').options;
const users = require('./users/users');

const express = require('express');
const bodyParser = require('body-parser');

const mustache = require('mustache');
const cookieParser = require('cookie-parser');

const https = require('https');


const TEMPLATES_DIR = 'templates';

const COOKIE = 'cookie';


//Routes Setup for all urls
function setupRoutes(app) {
    app.use('/', bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    
    app.get('/', baseurlredirection(app)); //Base Url 
    //Registration Routes
    app.get('/register.html', register(app));
    app.post('/register.html', register(app));
    //Login Routes
    app.get('/login.html', login(app));
    app.post('/login.html', login(app));
 
    app.get('/account.html', account(app)); //My Account landing route
    
    app.get('/logout.html', logout(app)); // Logout Functionality routing
}


//Register  Functionality
function register(app){ 
    return function(req,res){
        const buttonclicked = (typeof req.body.submit ==='undefined')
        if(buttonclicked){
            res.send(doMustache(app,'register',{}));  // Simply rendering Register Page if submit button is not clicked
        }
        else {
            var fname = req.body.fname;
            var lname = req.body.lname;
            var email = req.body.email;
            var pw = req.body.password;
            var confirmpass = req.body.passwordconfirmation;
            var userdetails = req.body;
            if(pw!==confirmpass){
                const errors = { qError: 'The value for the password confirmation field must match the password field'};
                const inputdata = {fname:fname,lname:lname,email:email};
                const renderdata = {inputdata,errors};
                res.send(doMustache(app, 'register', renderdata));
            }
            else{
                console.log(userdetails);
                if(fname.trim().length!==0&&lname.trim().length!==0&&email.trim().length!==0&&pw.trim().length!==0&&confirmpass.trim().length!==0){
                    app.users.register(userdetails).then((result)=>{
                        if(result.status==='EXISTS'){
                                const errors = { qError: 'Kindly register with another Email id as this email already exists in database'};
                                const inputdata = {fname:fname,lname:lname,email:email};
                                const renderdata = {inputdata,errors};
                                res.send(doMustache(app, 'register', renderdata));
                        }
        
                        
                        else{
                            res.cookie(COOKIE,{token:result.data.authToken,id:email}, { maxAge: 600*1000 });
                            res.redirect('/account.html');
                        }

                        
                        });
                
                }
                else{
                        const errors = { qError: 'Kindly input only valid terms for input. Your input might contain only whitespaces'};
                        const inputdata = {fname:fname,lname:lname,email:email};
                        const renderdata = {inputdata,errors};
                        res.send(doMustache(app, 'register', renderdata)); 
                    }
                
            }
            
        }    
    }
}

//Login Functionality
function login(app){
    return function(req,res){
        var buttonclicked = (typeof req.query.submit ==='undefined')
        if(buttonclicked){
            res.send(doMustache(app,'login',{})); // Simply rendering login page if submit button is not clicked
        }
        else {
            var email = req.query.email;
            var pw = req.query.password;
            if(email.trim().length!==0&&pw.trim().length!==0){
                app.users.login(email,pw).then((result)=>{
                    
                    if(result.status==='ERROR_UNAUTHORIZED'){
                            const errors = { qError: 'Unauthorized User. Kindly make sure you insert the correct password'};
                            const inputdata = {email:email};
                            const renderdata = {inputdata,errors};
                            res.send(doMustache(app, 'login', renderdata));
                    }
                    else if(result.status==='ERROR_NOT_FOUND'){
                        const errors = { qError: 'No such User exists in database'};
                        const inputdata = {email:email};
                        const renderdata = {inputdata,errors};
                        res.send(doMustache(app, 'login', renderdata));
                    }
                    else{
                    res.cookie(COOKIE,{token:result.authToken,id:email}, { maxAge: 600*1000 });
                    res.redirect('/account.html');
                    }
                });
                    
            }
            else{
                   const errors = { qError: 'Kindly input only valid terms for input. Your input might contain only whitespaces'};
                   const inputdata = {email:email};
                   const renderdata = {inputdata,errors};
                   res.send(doMustache(app, 'login', renderdata)); 
            }
            
        }
    }        
}

//Base URL Functionality
function baseurlredirection(app){
    return function(req,res){
        const buttonclicked = (typeof req.query.submit ==='undefined')
        if(buttonclicked){
            const cookie = req.cookies[COOKIE];
            const validtoken = (typeof cookie !== 'undefined')
            if(validtoken){
                 res.redirect('/account.html');
            }
            else{
            res.redirect('/login.html');
            }
        }
        else {
                
        }
    }        
}

// My account Functionality
function account(app){
    return function(req,res){
        const buttonclicked = (typeof req.query.submit ==='undefined')
        if(buttonclicked){
            const cookie = req.cookies[COOKIE];
            const validtoken = (typeof cookie !== 'undefined')
            if(validtoken){
                app.users.fetchUser(cookie).then((result)=>{
                    const userdetails = result.data;
                    res.send(doMustache(app,'account',userdetails));
                    console.log(userdetails);
                    });
                
            }
            else{
                res.redirect('/login.html');
            }

        }
        
    }        
}



// Logout Functionality
function logout(app){
    return function(req,res){
        res.clearCookie(COOKIE);
        res.redirect('/login.html');
            
    }        
}


// Utility Functions from Professors Example
function doMustache(app, templateId, view) {
  const templates = {};
  return mustache.render(app.templates[templateId], view, templates);
}


function errorPage(app, errors, res) {
  if (!Array.isArray(errors)) errors = [ errors ];
  const html = doMustache(app, 'errors', { errors: errors });
  res.send(html);
}
  
// Templates Initialization from Professors Example

function setupTemplates(app) {
  app.templates = {};
  for (let fname of fs.readdirSync(TEMPLATES_DIR)) {
    const m = fname.match(/^([\w\-]+)\.ms$/);
    if (!m) continue;
    try {
      app.templates[m[1]] =
	String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
    }
    catch (e) {
      console.error(`cannot read ${fname}: ${e}`);
      process.exit(1);
    }
  }
}

function setup() {
  process.chdir(__dirname);
  const app = express();
  app.use(cookieParser());
  app.locals.ws_url = options.ws_url;
  setupTemplates(app);
  const port = options.port;
  app.users = users;
  app.use(bodyParser.urlencoded({extended: true}));
  setupRoutes(app);
  https.createServer({
    key: fs.readFileSync(`${options.sslDir}/key.pem`),
    cert: fs.readFileSync(`${options.sslDir}/cert.pem`),
  }, app).listen(port, function() {
    console.log(`listening on port ${port}`);
  });
}

setup();