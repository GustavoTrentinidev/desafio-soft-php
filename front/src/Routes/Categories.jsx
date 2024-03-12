import { useEffect, useState, Fragment } from "react"
import { Header } from "../components/Header/Header"
import { CategoriesService } from "../requests/Categories"
import { IoIosPaper } from "react-icons/io";
import { CategoriesForm } from "../components/Categories/CategoriesForm";
import { RenderCategories } from "../components/Categories/RenderCategories";

export function Categories(){
    
    const [categories, setCategories] = useState([])

    async function readCategories(){
        const res = await CategoriesService.getCategories()
        setCategories(res)
    }

    useEffect(()=>{
        readCategories()
    }, [])
    
    return (
        <>
            <Header/>
            <main className="flex justify-center">
                <div className="w-4/5 flex flex-col items-center mt-6">
                    <h1 className="text-3xl  mb-2 uppercase flex gap-2 items-center">Categories<IoIosPaper/></h1>
                    <CategoriesForm readCategories={readCategories}/>
                    <RenderCategories categories={categories} readCategories={readCategories}/>
                </div>
            </main>
        </>
    )
}