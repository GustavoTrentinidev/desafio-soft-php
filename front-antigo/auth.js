const login = document.getElementById('form-login-side')
const register = document.getElementById('form-register-side')
const ball = document.getElementById('bola')

addEventListener("mouseover", (event) => {
    if(event.srcElement == login){
        toggleclassesBetweenSides(login,register)
    }else if(event.srcElement == register){
        toggleclassesBetweenSides(register,login)
    }
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
    ball.classList.toggle("azul")
    ball.classList.toggle("branco")
}