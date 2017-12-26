const express = require('express');
const bodyParser = require('body-parser');

const options = require('.././options').options; // To get the WS_URL passed as command line arguments

// Importing https and axios for passing requests
const https = require('https');
const axios = require('axios');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // To fix the errors during axios requests between https requests


Users.prototype.register =function(userdetails){
        const userregistrationdetails = {fname:userdetails.fname,lname:userdetails.lname};
        return axios.put(`${this.baseUrl}/users/${userdetails.email}?pw=${userdetails.password}`,userregistrationdetails,{ maxRedirects: 0})
        .then((result) => {
            return result;
        }).catch((error)=>{
                    return error.response.data;
                    });
    
}


Users.prototype.fetchUser = function(cookie) {
    return axios.get(`${this.baseUrl}/users/${cookie.id}`,{ maxRedirects: 0,headers: {Authorization: `Bearer ${cookie.token}`}})
        .then((result) => {
          const statusofresponse = result.status;
            return result;
        });
  
}

Users.prototype.login =function(email,pass){
        const userlogindetails = {pw:pass};
        return axios.put(`${this.baseUrl}/users/${email}/auth`,userlogindetails,{ maxRedirects: 0})
        .then((result) => {
            return result.data;
        }).catch((error)=>{
                    return error.response.data;
        });

}

function Users() {
  this.baseUrl = options.project3url;
}

module.exports = new Users();

