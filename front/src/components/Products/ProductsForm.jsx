import { useState, useEffect } from "react"
import { CategoriesService } from "../../requests/Categories"
import { Products as ProductsService } from "../../requests/Products"


export function ProductsForm({readProducts}){
    
    const [name, setName] = useState('')
    
    const [price, setPrice] = useState(0)
    
    const [selectedCategory, setSelectedCategory] = useState(0)

    const [amount, setAmount] = useState(0)

    const [categories, setCategories] = useState([])

    async function readCategoriesOnSelect(){
        const res = await CategoriesService.getCategories()
        setCategories(res)
    }

    async function postProduct(e){
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", name)
        formData.append("price", price)
        formData.append("category_id", selectedCategory)
        formData.append("amount", amount)
        const res = await ProductsService.createProduct(formData)
        readProducts()
        clearInputValues()
    }

    function clearInputValues(){
        const inputs = document.querySelectorAll('input')
        document.querySelector('select').value = ''
        for(let i = 0; i<inputs.length -1; i++){
            inputs[i].value = ''
        }
    }

    useEffect(()=>{
        readCategoriesOnSelect()
    }, [])
   
    return (
        <form className="flex gap-2 mt-10 flex-col items-center" onSubmit={(e)=>postProduct(e)}>
            <div className="flex gap-2 md:flex-row flex-col">
                <div>
                    <label className={`block 'text-gray-700' text-sm font-bold mb-2`} htmlFor="name"> Name </label>
                    <input required className="shadow appearance-none border rounded 2/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Name" onChange={(e)=>{setName(e.target.value)}}/>
                </div>
                <div>
                    <label className={`block 'text-gray-700' text-sm font-bold mb-2`} htmlFor="price"> Price </label>
                    <input required className="shadow appearance-none border rounded 2/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="price" type="number" step={0.01} min={0.01} placeholder="Price" onChange={(e)=>{setPrice(e.target.value)}}/>
                </div>
                <div>
                    <label className={`block 'text-gray-700' text-sm font-bold mb-2`} htmlFor="category"> Category </label>
                    <select name="category" defaultValue={""} required className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e)=> setSelectedCategory(e.target.value)}>
                        <option disabled value="">Category</option>
                        {
                            categories.map(category=>{
                                return <option key={category.id} value={category.id}>{category.name}</option>
                            })
                        }
                    </select>
                </div>
                <div>
                    <label className={`block 'text-gray-700' text-sm font-bold mb-2`} htmlFor="amount"> Amount </label>
                    <input required className="shadow appearance-none border rounded 2/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="amount" type="number" step={0.01} min={0.01} placeholder="Amount" onChange={(e)=>{setAmount(e.target.value)}}/>
                </div>
            </div>
            <input type="submit" value="Add Product" className="w-fit text-lg shadow-xl cursor-pointer p-2 rounded-lg transition-all duration-300 hover:bg-blue-800 hover:text-white"/>
        </form>
    )
}