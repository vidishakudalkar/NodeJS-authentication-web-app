<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="/css/style.css">
  </head>
    <body style="background-color:#7FFFD4;">
      <center>
      <p class="error">{{msg}}</p>
      <form action="register.html" method="post" style="margin-top:200px">
        <h1>Registration</h1>
     
        
          <label for="firstname">First Name</label>
          <input type="text" required="" name="fname" placeholder="First Name" value="{{inputdata.fname}}"><br>
          <label for="lastname">Last Name</label>
          <input type="text" required="" name="lname" placeholder="Last Name" value="{{inputdata.lname}}"><br>
          <label for="email">Email</label>
          <input type="text" required="" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" name="email" placeholder="Email" value="{{inputdata.email}}"><br>
          <label for="password">Password</label>
          <input type="password" pattern="(?=.*\d)(?=.*[a-z]).{8,}" required="" name="password" placeholder="Password"><br>
          <label for="passwordconfirmation">Confirm Password</label>
          <input type="password" required="" name="passwordconfirmation" pattern="(?=.*\d)(?=.*[a-z]).{8,}"  placeholder="Confirm Password"><br>
          {{#errors}}<span class="error">{{errors.qError}}<br></span>{{/errors}}
          <div class="form__submit-button">
              <input name="submit" type="submit" value="Register" class="control">
              </br><p><a href="/login.html">Login</a></p>
              
          </div> </fieldset>
      </form></center>
    </body>
</html>