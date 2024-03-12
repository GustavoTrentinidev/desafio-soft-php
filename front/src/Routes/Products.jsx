import { useEffect, useState } from "react"
import { Header } from "../components/Header/Header"
import { Products as ProductsService } from "../requests/Products"
import { ProductsForm } from "../components/Products/ProductsForm"
import { RenderProducts } from "../components/Products/RenderProducts"


export function Products(){
    
    const [products, setProducts] = useState([])

    async function readProducts(){
        const res = await ProductsService.getProducts()
        setProducts(res)
    }

    useEffect(()=>{
        readProducts()
    }, [])
    
    return (
        <>
            <Header/>
            <main className="flex items-center flex-col md:h-[calc(100vh-12rem)]">
                <ProductsForm readProducts={readProducts}/>
                <RenderProducts products={products} readProducts={readProducts}/>
            </main>
        </>
    )
}