import { Header } from "../components/Header/Header"
import { CartForm } from "../components/Home/CartForm"
import { Cart } from "../components/Home/Cart"
import { CartProvider } from "../providers/CartContext"

export function Home(){
    return (
        <>
            <Header/>
            <main className="flex md:flex-row flex-col md:justify-center">
                <div className="md:w-4/5 md:grid md:grid-cols-2 gap-2 pt-5 flex flex-col">
                    <CartProvider>
                        <CartForm />
                        <Cart/>
                    </CartProvider>
                </div>
            </main>
        </>
    )
}