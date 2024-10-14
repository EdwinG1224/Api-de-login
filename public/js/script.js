const container = document.querySelector(".container");
const btnSignIn = document.getElementById("btn-sign-in");
const btnSignUp = document.getElementById("btn-sign-up");

btnSignIn.addEventListener("click", () => {
    console.log("Sign In button clicked"); 
    container.classList.remove("toggle");
    console.log("Class 'toggle' removed"); 
});

btnSignUp.addEventListener("click", () => {
    console.log("Sign Up button clicked"); 
    container.classList.add("toggle");
    console.log("Class 'toggle' added"); 
});
