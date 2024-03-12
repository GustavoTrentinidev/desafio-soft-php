import { useEffect, useState } from "react"
import { Orders as OrdersService } from "../../requests/Orders"

export function RenderOrders({setOrder}){

    const [orders, setOrders] = useState([])

    async function readOrders(){
        const res = await OrdersService.getOrders()
        setOrders(res)
    }

    async function getOrderById(id){
        const order = await OrdersService.getOrderById(id)
        console.log(order)
        setOrder(order)
    }

    useEffect(()=>{
        readOrders()
    }, [])

    return (
        <div className="flex items-center flex-col mt-10 gap-5 md:h-[calc(100vh-12rem)] md:flex-wrap">
            {
                orders.map(order=>{
                    return (
                        <div key={order.id} className="w-72 h-20 shadow-md relative rounded">
                            <div className="flex flex-col gap-0.5 absolute left-2">
                                <div className=" ">
                                    #{order.id}
                                </div>
                                <div className=" ">
                                R$<span className="font-bold">{order.tax}</span>
                                </div>
                                <div className="">
                                    R$<span className="font-bold">{order.total}</span> 
                                </div>
                            </div>
                            <button className="absolute top-1/3 right-1/4 text-white bg-blue-700 shadow-md p-1 rounded hover:bg-white transition-all duration-150 hover:text-blue-600 border-2 border-blue-600" onClick={()=>{getOrderById(order.id)}} >View Details</button>
                        </div>
                    )
                })
            }
        </div>
    )
}