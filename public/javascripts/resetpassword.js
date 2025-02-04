let password = document.querySelectorAll(".fa-eye-slash")
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
})


document.getElementById("get_otp").addEventListener("click", () => {
    console.log("ppp",document.getElementById("resetpass12"))
    document.getElementById("resetpass12").setAttribute("action", "/getotp")

})
document.querySelector(".btn1").addEventListener("click", () => {
    console.log("ppp3", document.getElementById("resetpass12"))
    document.getElementById("resetpass12").setAttribute("action", "/resetpassword")

})

setTimeout(() => {
    document.getElementsByClassName("popup-message")[0].innerHTML = ""
}, 5000)