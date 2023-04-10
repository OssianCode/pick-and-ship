console.log("js Pick and Ship");


// GLOBAL
let users = [];
let user = [];

function logIn() {
    //Log in
    console.log("login");

    document.getElementById('messageBox').innerHTML = "";

    const username = document.getElementById('username').value;
    const pwd = document.getElementById('pwd').value;

    //console.log(username + " " + pwd);

    //Check username and password from dummyjson
    fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          
          username: username,
          password: pwd,
          expiresInMins: 60, // optional
        })
      })
      .then(res => res.json())
      .then(user => letmein(user));
      /*.then(window.location.assign(`orders.html`)) */;
}

function letmein(user) { 

    //console.log("LETMEIN");
    // If not valid user - got an error message - show message
    if (user.message == "Invalid credentials") {

        document.getElementById('messageBox').innerHTML = user.message;

        //Session storage handle
        if (window.sessionStorage != "undefined"){
            sessionStorage.setItem("token", "");
            sessionStorage.setItem("userid", "");
        } 
        else {
            document.getElementById('messageBox').innerHTML = "Sorry no session storage!";

        }

    }
    // Else got a valid useride
    else if (user.id != "undefined"){

        //console.log("User id: ");
        //console.log(user.id);

        //Session storage handle
        //Set valid token and id to session storage and direct to orderpage
        if (window.sessionStorage != "undefined"){
            sessionStorage.setItem("token", user.token);
            sessionStorage.setItem("userid", user.id);
            window.location.assign("orders.html");
        } 
        else {
            document.getElementById('messageBox').innerHTML = "Sorry no session storage!";
        }

    } 
    //Else unknown error
    else {

        document.getElementById('messageBox').innerHTML = "Unknown error";
    }
}



const myLoginButton = document.getElementById('login');
myLoginButton.addEventListener('click', logIn);