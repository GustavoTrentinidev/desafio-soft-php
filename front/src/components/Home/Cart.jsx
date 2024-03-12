import { useContext, useEffect, useState } from "react"
import { CartContext } from "../../providers/CartContext"
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Orders } from "../../requests/Orders";
import { PopUp } from "./PopUp";


export function Cart(){
    const {cart, setCart} = useContext(CartContext)  
    const [total, setTotal] = useState(0)
    const [tax, setTax] = useState(0)
    const [showPop, setShowPop] = useState(false)

   function calculateTaxesAndTotal(){
        setTotal(0)
        setTax(0)
        cart.forEach(item=>{
            setTax(prevTax=>prevTax + parseFloat(item.price) * parseFloat(item.amount) * (parseFloat(item.tax) / 100))
            setTotal(prevTotal=>prevTotal + parseFloat(item.price) * parseFloat(item.amount) + (parseFloat(item.price) * parseFloat(item.amount) * (parseFloat(item.tax) / 100)) )
        })
   }

   async function finishCart(){
        let finishedCart = cart.map(item=>{return{id: item.id, amount: item.amount}})
        let response = await Orders.postOrder(finishedCart)
        if(response.message){
            console.log(response.message)
            setCart([])
        }
        setShowPop(true)
   }

   function closePopUp (){
        setShowPop(false)
   }

    function removeFromCart(id){
        let newCart = cart.filter(item=>item.id!=id)
        setCart(newCart)
    }
   
    function cancelCart(){
        setCart([])
    }


   useEffect(()=>{
    calculateTaxesAndTotal()
   }, [cart])

    return (
        <>
            <div className="relative">
                <div className="text-center text-3xl font-nunito flex justify-center items-center gap-3">Cart<MdOutlineShoppingCart/> </div>
                <div className="flex flex-col gap-4 overflow-y-auto h-96">
                    {
                        cart.map(product=>{
                            return (
                                <div className="bg-white shadow-md rounded font-nunito px-8 pt-6 pb-6 mx-16 relative "  key={product.id}>
                                    <div className="font-bold">{product.name}</div>
                                    <div className="text-xs">{"R$" + product.price}</div>
                                    <div className="text-xs">x{product.amount}</div>
                                    <FaTrashAlt className="absolute top-1 right-1 cursor-pointer transition-colors duration-200 hover:text-red-500" onClick={()=>removeFromCart(product.id)}/>
                                    <div className="absolute right-2 bottom-2 font-bold text-sm">
                                        <div>Total price: {"R$" + (parseFloat(product.tax) / 100 * product.amount * product.price + product.amount * product.price).toFixed(2)}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="absolute right-5 font-bold mt-2 font-nunito text-end">
                    <div>Tax: {"R$" + tax.toFixed(2)}</div>
                    <div>Total: {"R$" + total.toFixed(2)} </div>
                </div>
                <div className="flex gap-2 absolute -bottom-15 left-20">
                    <button onClick={cancelCart} className="border-2 rounded border-gray-500 py-2 px-4 text-gray-500 transition-colors duration-200 hover:text-red-500 hover:border-red-500">Cancel</button>
                    <button className="border-2 rounded border-blue-900 text-blue-900 py-2 px-5 transition-all duration-200 hover:bg-blue-900 hover:text-white disabled:border-gray-500 disabled:text-white disabled:bg-gray-500 disabled:hover:border-gray-500 disabled:cursor-not-allowed" disabled={cart.length? false:true} onClick={finishCart}>Finish</button>
                </div>
            </div>
            {
                showPop &&
                <PopUp close={closePopUp}/>       
            }
        </>
    )
}