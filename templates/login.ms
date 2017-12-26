<!DOCTYPE html>
<html>
  <head>
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body style="background-color:#7FFFD4;">
   
    <center> <p class="error">{{msg}}</p>
    <form method="GET" action="/login.html" style="margin-top:200px">
    <h1>Login</h1>
      <label for="email">Email</label>
      <input type="text" name="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" value="{{inputdata.email}}" placeholder="Email" required=""><br>
      <label for="password">Password</label>
      <input type="password" name="password" placeholder="Password" required=""><br>
      <input name="submit" type="submit" value="Login" class="control">
      {{#errors}}<span class="error">{{errors.qError}}<br></span>{{/errors}}
      </br><p><a href="/register.html">Register</a></p>
    </form> </center>
    
  </body>
</html>