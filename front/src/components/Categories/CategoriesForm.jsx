import { useState } from "react"
import { CategoriesService } from "../../requests/Categories"


export function CategoriesForm({readCategories}){
    const [name, setName] = useState('')

    const [tax, setTax] = useState(0)

    async function addCategory(e){
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", name)
        formData.append("tax", tax)
        const res = await CategoriesService.createCategory(formData) 
        readCategories()
        clearInputValues()
    }

    function clearInputValues(){
        const inputs = document.querySelectorAll('input')
        for(let i = 0; i<inputs.length -1; i++){
            inputs[i].value = ''
        }
    }

    return(
        <form className="flex gap-5 items-center md:flex-row flex-col" onSubmit={(e)=>{addCategory(e)}}>
            <div>
                <label className={`block 'text-gray-700' text-sm font-bold mb-2`} htmlFor="name"> Name </label>
                <input required className="shadow appearance-none border rounded 2/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Name" onChange={(e)=>{setName(e.target.value)}}/>
            </div>
            <div>
                <label className={`block 'text-gray-700' text-sm font-bold mb-2`} htmlFor="name"> Tax </label>
                <input required className="shadow appearance-none border rounded py-2 px-3 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="tax" type="number" min={0.1} step={0.1} placeholder="Tax (%)" onChange={(e)=>{setTax(e.target.value)}}/>
            </div>
            <input type="submit" value="Add Category" className="bg-white shadow-xl self-center w-32 text-blue-900 px-5 py-1 rounded cursor-pointer transition-all duration-300 hover:bg-blue-800 hover:text-white" />
        </form>
    )
}