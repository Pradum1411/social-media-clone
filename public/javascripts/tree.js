
onload = () => {
    const c = setTimeout(() => {
      document.body.classList.remove("not-loaded");
      clearTimeout(c);
    }, 100);
  };
  

  document.querySelector(".link").addEventListener('click', () => {
    // document.getElementsByClassName("otp")[0].style.display="block"
    document.querySelector('.heading1').innerHTML = 'RESET PASSWORD';
    document.querySelectorAll(".form-style")[0].setAttribute("placeholder","Enter Email")
    document.querySelectorAll(".form-style")[1].setAttribute("placeholder","Enter New Password")
    document.getElementsByTagName("form")[0].setAttribute("action","/resetpassword")
    console.log("reset password")
})
// let inputdata=document.getElementsByTagName("input")
let inputdata=document.querySelectorAll(".btn1")
console.log("login-",inputdata)
    inputdata[0].addEventListener("click",()=>{
        let d1=document.getElementsByTagName("form")[0].getAttribute("action")
        console.log(d1)
        if('/resetpassword'!=d1){
            document.getElementsByTagName("form")[0].setAttribute("action","/login")
        }
     
        console.log("login",d1=='#',d1)
    })
    
    inputdata[1].addEventListener("click",()=>{
        document.getElementsByTagName("form")[0].setAttribute("action","/register")


        console.log("register")
    })

    document.querySelector("#reg-log").addEventListener('click', () => { 
    // document.getElementsByClassName("otp")[0].style.display="none"
        document.querySelector('.heading1').innerHTML = 'LOGIN';
        document.querySelectorAll(".form-style")[0].setAttribute("placeholder","Email or Password")
        document.querySelectorAll(".form-style")[1].setAttribute("placeholder","Enter Password")
        let check=document.getElementById("form10").getAttribute("action")
        console.log("---",check)
        if(check=="#" || check=="/login"){
            document.getElementById("form10").setAttribute("action","/register")
        }else{
            document.getElementById("form10").setAttribute("action","/login")
        }
    })

    //-- show password
let password=document.querySelectorAll(".fa-eye-slash")
    password[0].addEventListener("click",()=>{
    let password1=document.getElementsByClassName("password")
    let p1=password1[0].getAttribute("type")
    if(p1=="text"){
        password1[0].setAttribute("type","password")
        document.getElementsByClassName("fa-regular")[0].setAttribute("class","fa-regular fa-eye-slash")
    }else{
        password1[0].setAttribute("type","text")
        document.getElementsByClassName("fa-regular")[0].setAttribute("class","fa-regular fa-eye")
    }
    console.log("dfgdhd",password1)
})
password[1].addEventListener("click",()=>{
    let password1=document.getElementsByClassName("password")
    let p1=password1[1].getAttribute("type")
    if(p1=="text"){
        password1[1].setAttribute("type","password")
        document.getElementsByClassName("fa-regular")[1].setAttribute("class","fa-regular fa-eye-slash")
    }else{
        password1[1].setAttribute("type","text")
        document.getElementsByClassName("fa-regular")[1].setAttribute("class","fa-regular fa-eye")
    }
})

console.log("djfgdj")
