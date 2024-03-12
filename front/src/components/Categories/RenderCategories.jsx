import { useState } from "react"
import { CategoriesService } from "../../requests/Categories"
import { FaTrashAlt } from "react-icons/fa";


export function RenderCategories({categories, readCategories}){

    const [errorId, setErrorId] = useState(0)

    const [errorMessage, setErrorMessage] = useState('')

    async function deleteCategory(id){
        const res = await CategoriesService.deleteCategory(id)
        if (res.error){
            setErrorId(id)
            setErrorMessage(res.error)
        }
        readCategories()
    }

    return (
        <div className="xl:w-1/3 w-1/2 flex flex-col mt-2 overflow-y-auto items-center md:h-96 scroll-m-2 snap-start">
            {
                categories.map(category=>{
                    return (
                        <div className="w-full" key={category.id}>
                            <div className="w-full shadow-lg h-16 rounded relative ">
                                <div className="text-xl font-nunito font-light absolute left-3 top-2">{category.name}</div>
                                <div className="text-sm font-nunito font-light absolute left-3 top-8">{category.tax}%</div>
                                <FaTrashAlt className="absolute right-2 top-4 cursor-pointer transition-colors duration-200 hover:text-red-500" size={40} onClick={()=>{deleteCategory(category.id)}}/>
                            </div>
                            <div className="text-sm text-red-500 md:h-5">{errorId == category.id ? errorMessage : '' }  </div>
                        </div>
                    ) 
                })
            }
        </div>
    )
}