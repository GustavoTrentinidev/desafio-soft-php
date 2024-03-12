import axios from 'axios'

class Products {
    static baseUrl = 'http://localhost/routes/products.php'
    static async getProducts(){
        const { data } = await axios.get(this.baseUrl)
        return data
    } 
    static async getProductById(id){
        const { data } = await axios.get(`http://localhost/routes/products.php?id=${id}`)
        return data
    }
    static async createProduct(info){
        const { data } = await axios.post(this.baseUrl, info)
        return data
    }
    static async delete(id){
        const {data} = await axios.delete(`${this.baseUrl}?id=${id}`)
        return data
    }
}

export { Products }