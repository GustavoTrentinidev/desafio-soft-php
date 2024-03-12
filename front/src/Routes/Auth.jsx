import { useEffect, useState, useRef } from "react"
import { Auth, tokenState } from "../store/auth"
import { useRecoilState } from "recoil"
import { setAuthHeaderToken, clearAuthHeaderToken } from "../plugins/axios"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { redirect, useNavigate } from 'react-router-dom'


export function AuthRoute(){
    const [token, setToken] = useRecoilState(tokenState)
    const [loginError, setLoginError] = useState('')
    const [userHasAccount, setUserHasAccount] = useState(true) 
    const [showPassowrd, setShowPassowrd] = useState(false) 
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [userLoged, setUserLoged] = useState(false)

    const errorHolder = useRef()
    const container = useRef()
    const contentContainer = useRef()
    const usernameInput = useRef()
    const passwordInput = useRef()
    
    const navigate = useNavigate()

    async function login(e){
        e.preventDefault()
        setLoginError(false)
        const response = await Auth.postInfo('http://localhost/routes/auth/login.php',{username, password})
        if(response.error){
            setLoginError(true)
            errorHolder.current.innerText = response.error
            return
        }
        setToken(response)
        setAuthHeaderToken(response.accessToken.token)
        setUserLoged(true)
    }

    async function register(e){
        e.preventDefault()
        const response = await Auth.postInfo('http://localhost/routes/auth/register.php',{username, password})
        if(response.error){
            setLoginError(true)
            errorHolder.current.innerText = response.error
            return
        }
        login(e)
    }

    async function disconnect(){
        const response = await Auth.logout()
        setToken({})
        clearAuthHeaderToken()
        console.log(response)
    }


    function switchContainer(){
        usernameInput.current.value = ''
        passwordInput.current.value = ''
        errorHolder.current.innerText = ''
        container.current.classList.remove('open')
        container.current.classList.add('close')
        contentContainer.current.classList.remove('show')
        contentContainer.current.classList.add('showoff')
        setTimeout(()=>{
            container.current.classList.remove('close')
            container.current.classList.add('open')
            contentContainer.current.classList.add('show')
            contentContainer.current.classList.remove('showoff')
            setUserHasAccount(!userHasAccount)
        },990)
    }


    useEffect(()=>{
        disconnect()
        setUserLoged(false)
    }, [])


    return (
        <div className={`flex justify-center items-center w-full h-screen transition-colors duration-1000 ${userHasAccount? 'bg-blue-900' : 'bg-gray-100'} `}>
            <div ref={container} className={`h-2/3 rounded-lg shadow-2xl md:w-1/4 w-3/4 flex flex-col justify-center open ${userHasAccount? 'bg-white' : 'bg-blue-900' }`}>
                <div className="show" ref={contentContainer}>
                    <h1 className={`text-3xl font-nunito font-extrabold my-3 ${userHasAccount ? 'text-blue-900' : 'text-white'} text-center`}>{userHasAccount ? 'Welcome Back!' : 'Be Welcome!'}</h1>
                    <form onSubmit={(e)=> {userHasAccount ? login(e) : register(e)}} className="flex flex-col justify-center items-center ">
                        <div className="w-3/4">
                            <label className={`block ${userHasAccount ? 'text-gray-700' : 'text-white'} text-sm font-bold mb-2`} htmlFor="username"> Username </label>
                            <input required ref={usernameInput} onChange={(e)=>{setUsername(e.target.value)}} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"/>
                        </div>
                        <div className="w-3/4 relative">
                            <label className={`block ${userHasAccount ? 'text-gray-700' :'text-white'} text-sm font-bold mb-2`} htmlFor="password"> Password </label>
                            <input required ref={passwordInput} onChange={(e)=>{setPassword(e.target.value)}} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type={showPassowrd ? 'text' : 'password'} placeholder="Password"/>
                            {
                                showPassowrd ? <FaEye className="absolute top-10 right-3 cursor-pointer" onClick={()=>setShowPassowrd(false)}/> : <FaEyeSlash onClick={()=>setShowPassowrd(true)} className="absolute top-10 right-3 cursor-pointer"/>   
                            }
                            
                        </div>
                        <div className={`text-xs ml-10 h-2 lg:mt-2 lg:h-2  mt-5 self-start ${userHasAccount? 'text-red-500' : 'text-red-300'}`} ref={errorHolder}></div>
                        {
                            userHasAccount &&
                            <input type="submit" value='Log In' className="bg-blue-900 text-white text-xl px-5 py-1 rounded cursor-pointer mt-5" />
                        }
                        {
                            !userHasAccount &&
                            <input type="submit" value='Sign In' className="bg-white text-blue-900 shadow-xl text-xl px-5 py-1 rounded cursor-pointer mt-5" />
                        }
                    </form>
                    <div className={`w-full flex flex-col ${userHasAccount? 'text-black' : 'text-white'}`}>
                        <div className="text-xs mt-5 self-center">Or</div>
                        <div className="text-xs ml-10 mt-5">{userHasAccount? "Don't" : 'Already'} have an account?</div>
                        {
                            userHasAccount &&
                            <button className="bg-white shadow-xl self-center w-32 text-blue-900 text-xl px-5 py-1 rounded cursor-pointer mt-5" onClick={switchContainer}> Sign In</button>
                        }
                        {
                            !userHasAccount &&
                            <button className="bg-blue-300 shadow-xl self-center w-32 text-blue-900 text-xl px-5 py-1 rounded cursor-pointer mt-5" onClick={switchContainer}> Log In</button>
                        }

                        {
                            userLoged &&
                        navigate("/")}
                    </div>
                </div>
            </div>
        </div>
    )
}