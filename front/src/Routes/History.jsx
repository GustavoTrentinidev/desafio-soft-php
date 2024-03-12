import { Header } from "../components/Header/Header"
import { RenderOrders } from "../components/History/RenderOrders"
import { OrderModal } from "../components/History/OrderModal"
import { useState } from "react"
import { VscHistory } from "react-icons/vsc";


export function History(){

    const [ order, setOrder ] = useState({})

    return (
        <>
            <Header/>
            <div className="flex flex-col items-center">
                <div className="text-4xl mt-10 flex items-center gap-2">
                    <h1>History</h1>
                    <VscHistory/>
                </div>
                {
                    order.order_info &&
                    <OrderModal order={order} setOrder={setOrder}/>
                }
                <RenderOrders setOrder={setOrder}/>
            </div>
        </>
    )
}