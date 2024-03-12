import { useState, useEffect, useRef, useContext } from "react"
import { Products as ProductsMethods } from "../../requests/Products"
import { CartContext } from "../../providers/CartContext"


export function CartForm(){
    const [ products, setProducts ] = useState([])    
    const [ selectedProduct, setSelectedProduct ] = useState({amount: 0, price: '0.00', tax: '0.00'})    
    const [ amount, setAmount ] = useState(0)
    const amountInput = useRef()
    const selectRef = useRef()
    const [ error, setError] = useState(false)
    const {cart, setCart} = useContext(CartContext)

    async function getProducts() {
        let response = await ProductsMethods.getProducts() 
        setProducts(response)
    }

    async function changeSelectProduct(e){
        setAmount(0)
        amountInput.current.value = ''
        const product = await ProductsMethods.getProductById(e.target.value)   
        setSelectedProduct(product)
    }

    function addProductToCart(e){
        e.preventDefault()
        setError(false)
        let productIndex = findProductInCart(selectedProduct.id)
        if(productIndex != -1){
            updateCart(productIndex)
            return
        }
        insertProductToCart(selectedProduct)
        amountInput.current.value = ''
        setAmount(0)
        selectRef.current.value = 0
        setSelectedProduct({amount: 0, price: '0.00', tax: '0.00'})
        return
    }

    function updateCart(index){
        let newAmount = parseInt(cart[index].amount) + parseInt(amount)
        if(newAmount > selectedProduct.amount){
            setError(true)
            return
        }
        let productOnCart = cart[index]
        let restOfCart = cart.filter(item=>item.id!=selectedProduct.id)
        productOnCart.amount = newAmount
        let newCart = [...restOfCart, productOnCart]
        setCart(newCart)
    }

    function insertProductToCart(product){
        setCart(previousProducts=>{
            return [...previousProducts, {...product, amount}]
        })
    } 

    function findProductInCart(id){
        if(cart){
            let produto = cart.findIndex(item=>item.id==id)
            return produto
        }
    }

    useEffect(()=>{
        getProducts()
    }, [])

    return (
        <form onSubmit={(e)=>{addProductToCart(e)}} className="bg-white shadow-md rounded font-nunito mt-10 px-8 pt-6 pb-8 h-fit">
            <div className="grid grid-cols-3 gap-x-2">
                <div>
                    <label htmlFor="product" className="block text-gray-700 text-sm font-bold mb-2">Product:</label>
                    <select name="product" ref={selectRef} defaultValue={0} onChange={(e)=>{changeSelectProduct(e)}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option disabled value="0">Product</option>
                        {
                            products?.map(product=>{
                                if(product.amount > 0){
                                    return <option key={product.id} value={product.id}>{product.name}</option>
                                }
                            })
                        }
                    </select>
                    <span className="text-sm text-gray-400">Amount available: {selectedProduct.amount}</span>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
                    <input type="number" ref={amountInput} disabled={selectedProduct.price != 0 ? false : true} required min={1} max={selectedProduct.amount} onChangeCapture={(e)=>{setAmount(e.target.value)}} className="shadow border bg-gray-50 border-gray-300  rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>
                </div>
                <div className="flex justify-end relative">
                    <ul className="text-end">
                        <li className="block text-gray-700 text-sm font-bold mb-2">Price: {"R$" + selectedProduct.price}</li>
                        <li className="block text-gray-700 text-sm font-bold mb-2">Tax: {selectedProduct.tax + "%"}</li>
                    </ul>
                    <div className="absolute -bottom-16 -right-2 text-3xl">{amount? 'x' + amount : '' }</div>
                </div>
            </div>
            <div className="text-xs text-red-500 h-3">
                {
                    error ? "The wanted amount plus the cart amount exceeds the available amount." : ""
                }
            </div>
            <input type="submit" disabled={amount? false : true} value={'Add to cart'} className="mt-2 cursor-pointer text-lg border-2 border-blue-900  rounded-lg p-2 transition-colors duration-200 text-blue-900 hover:bg-blue-900 hover:text-white disabled:border-gray-500 disabled:text-white disabled:bg-gray-500 disabled:hover:border-gray-500 disabled:cursor-not-allowed" />
        </form>
    )
}