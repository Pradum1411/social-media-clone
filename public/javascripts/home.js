
let da=document.querySelector("#createpost")
if(da){

    da.addEventListener("click",()=>{
    document.querySelector("#createpost1").style.display="block"
})
}
    
const message = document.querySelectorAll('.feed');
const messageSearch = document.querySelector('.search-bar');

const searchMessage = () => {
    const val = document.getElementById("123").value;
    document.querySelectorAll(".searchusername").forEach((data,i)=>{
        let td=data.innerText
        console.log("fi",td,val,val.indexOf(td),td.indexOf(val))
        if(val){
            if(td.indexOf(val)>-1){
                message[i].style.display=""
                console.log("fi",td,val,message[i],td.indexOf(val))
            }else{
                message[i].style.display="none"
                console.log("fi1",td,val,message[i],td.indexOf(val)) 

            }
        }
    })
}

messageSearch.addEventListener('keyup', searchMessage);


// success or failed message
function pop_message1() {

    let pop_message = document.querySelector(".pop_messsage")
    if (pop_message.innerHTML) {
        setTimeout(() => {
            pop_message.innerHTML = ""
        }, 2000)
    }
    console.log("pop--", pop_message.innerHTML)
}

let inputdata = document.querySelectorAll(".btn1")

if(inputdata[1]){
    inputdata[1].addEventListener("click", () => {
        document.getElementsByTagName("form")[0].setAttribute("action", "/register")

        console.log("register")
    })
}

if(document.querySelector("#reg-log")){
    document.querySelector("#reg-log").addEventListener('click', () => {
    // document.getElementsByClassName("otp")[0].style.display="none"
    document.querySelector('.heading1').innerHTML = 'LOGIN';
    document.querySelectorAll(".form-style")[0].setAttribute("placeholder", "Email or Password")
    document.querySelectorAll(".form-style")[1].setAttribute("placeholder", "Enter Password")
    let check = document.getElementsByTagName("form")[0].getAttribute("action")
    console.log(check)
    if (check == "#" || check == "/login") {
        document.getElementsByTagName("form")[0].setAttribute("action", "/regster")
    } else {
        document.getElementsByTagName("form")[0].setAttribute("action", "/login")
    }
})
}
//-- show password
let password = document.querySelectorAll(".fa-eye-slash")
if(password[0]){
password[0].addEventListener("click", () => {
    let password1 = document.getElementsByClassName("password")
    let p1 = password1[0].getAttribute("type")
    if (p1 == "text") {
        password1[0].setAttribute("type", "password")
        document.getElementsByClassName("fa-regular")[0].setAttribute("class", "fa-regular fa-eye-slash")
    } else {
        password1[0].setAttribute("type", "text")
        document.getElementsByClassName("fa-regular")[0].setAttribute("class", "fa-regular fa-eye")
    }
    console.log("dfgdhd", password1)
})}
if(password[1]){
password[1].addEventListener("click", () => {
    let password1 = document.getElementsByClassName("password")
    let p1 = password1[1].getAttribute("type")
    if (p1 == "text") {
        password1[1].setAttribute("type", "password")
        document.getElementsByClassName("fa-regular")[1].setAttribute("class", "fa-regular fa-eye-slash")
    } else {
        password1[1].setAttribute("type", "text")
        document.getElementsByClassName("fa-regular")[1].setAttribute("class", "fa-regular fa-eye")
    }
})
}
