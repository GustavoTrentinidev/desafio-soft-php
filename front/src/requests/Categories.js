import axios from "axios"


class CategoriesService {
    static baseUrl = 'http://localhost/routes/categories.php'
    static async getCategories(){
        const { data } = await axios.get(this.baseUrl)
        return data
    }
    static async deleteCategory(id){
        const { data } = await axios.delete(`${this.baseUrl}?id=${id}`)
        return data
    }
    static async createCategory(info){
        const { data } = await axios.post(this.baseUrl, info)
        return data
    }
}

export {CategoriesService}