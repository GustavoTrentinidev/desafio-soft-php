const login = document.getElementById('form-login-side')
const register = document.getElementById('form-register-side')
const ball = document.querySelectorAll('.bola')
console.log(ball)
addEventListener("mouseover", (event) => {
    setTimeout(()=>{
        if(event.srcElement == login){
            toggleclassesBetweenSides(login,register)
        }else if(event.srcElement == register){
            toggleclassesBetweenSides(register,login)
        }
    }, 200)
});


function toggleclassesBetweenSides(openSide, closeSide){
    if(openSide.classList.value.includes("opened")){
        return
    }
    openSide.classList.remove("closed")
    openSide.classList.add("opened")
    closeSide.classList.remove("opened")
    closeSide.classList.add("closed")
    toggleBall()
}

function toggleBall(){
    ball[1].classList.toggle("azul")
    ball[1].classList.toggle("branco")
    ball[0].classList.toggle("azul")
    ball[0].classList.toggle("branco")
}