import { AiOutlineLoading } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";



export function PopUp ({close}){

    const [status, setStatus] = useState(false)

    const Pop = useRef()

    function fecharPopUp(e){
        if(e.id){
            e.classList.remove('showPopUp')
            e.classList.add('closePopUp')
            setTimeout(()=>{
                e.style.display = 'none'
                close()
            }, 900)
        }
    }

    useEffect(()=>{
        setTimeout(()=>{
            setStatus(true)
        }, 2000)
    }, [])

    return (
        <div ref={Pop} className="w-screen h-screen showPopUp bg-black bg-opacity-30 absolute top-0 left-0 flex justify-center items-center" id="overlay" onClick={(e)=> fecharPopUp(e.target)}>
            <div className={`md:w-1/4 h-1/2 w-3/4 transition-colors rounded duration-700 ${status? 'bg-green-500' : 'bg-white'}  flex flex-col justify-center items-center gap-10`}>
                {
                    !status && (
                        <>
                            <AiOutlineLoading size={100}  className="animate-spin"/>
                            Loading your order...
                        </>
                    )
                }
                {
                    status && (
                        <>
                            <FaCheck size={100} color="white"/>
                            <p className="text-white text-center mx-5"> 
                                Alright! Your order has been concluded, you can see the details on the history page. 
                            </p>
                        </>
                    )
                }
            </div>
        </div>
    )
}