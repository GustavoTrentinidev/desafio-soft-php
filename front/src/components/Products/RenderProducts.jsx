import { FaTrashAlt } from "react-icons/fa";
import { Products as ProductsService } from "../../requests/Products"; 


export function RenderProducts({products, readProducts}){

    async function deleteProduct(id){
        let res = ProductsService.delete(id)
        readProducts()
    }

    return (
        <div className="flex flex-wrap w-2/3 gap-5 mt-10 overflow-y-auto">
            {
                products.map(product=>{
                    return (
                        <div key={product.id} className="w-64 shadow-xl h-44 relative bg-blue-950 rounded-md text-gray-300 ">
                            <div className="absolute top-2 text-lg font-bold left-2">
                                {'#' + product.id}
                            </div>
                            <div className="absolute top-1/3 left-2 text-2xl font-bold text-wrap">
                                {product.name}
                            </div>
                            <div className="absolute bottom-5 left-2">
                                {'x' + product.amount}
                            </div>
                            <div className="absolute top-2 right-2 text-blue-500 font-bold">
                                {product.category_name}
                            </div>
                            <div className="absolute bottom-0 left-2">
                                {'R$' + product.price}
                            </div>
                            <FaTrashAlt onClick={()=>deleteProduct(product.id)} className="absolute bottom-2 right-2 cursor-pointer transition-colors duration-200 hover:text-red-700"/>
                        </div>
                    )
                })
            }
        </div>
    )
}