import { useRef } from "react"

export function OrderModal({order, setOrder}){
    
    const overlay = useRef()
    const modal = useRef()

    function checkClick(e){
        if(e.target.id == 'overlay'){
            closeModal()
        }
    }

    function closeModal(){
        overlay.current.classList.remove('showPopUp')
        overlay.current.classList.add('closePopUp')
        modal.current.classList.remove('showPopUp')
        modal.current.classList.add('closePopUp')
        setTimeout(()=>{
            setOrder({})
        },900)
    }
    
    return (
        <div className="w-screen z-10 h-screen showPopUp bg-black bg-opacity-30 absolute top-0 left-0 flex justify-center items-center" id="overlay" ref={overlay} onClick={(e)=>{checkClick(e)}}>
            <div className="bg-white relative p-2 showPopUp h-4/5 2xl:w-1/5 md:w-3/12 w-3/4 flex flex-col items-center z-10 rounded" ref={modal}>
                <h1 className="text-3xl">Order {order.order_info.order_id}</h1>
                <h1 className="text-xl">Products:</h1>
                <div className="flex flex-col items-center gap-2 w-11/12 h-3/4 overflow-y-auto">
                    {
                        order.products.map(product=>{
                            return (
                                <div className="shadow-md w-full h-20 min-h-20 relative ">
                                    <div className="absolute text-2xl font-bold top-1 left-1">{product.name}</div>
                                    <div className="absolute top-8 left-1 flex gap-2 items-end">
                                        <div className=" text-lg">R${product.price}</div>
                                        <div className="text-lg">x{product.amount}</div>
                                    </div>
                                    <div className="absolute right-0 bottom-0">Total: R${product.total}</div>
                                </div>
                            )
                        })
                    }
                    <div className="absolute bottom-2 right-2 text-2xl">
                        <div>Tax: R${order.order_info.order_tax}</div>
                        <div>Total: R${order.order_info.order_total}</div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}