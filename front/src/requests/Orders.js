import axios from 'axios'

class Orders {
    static baseUrl = 'http://localhost/routes/orders.php'
    static async postOrder(orderObject){
        const { data } = await axios.post(this.baseUrl, JSON.stringify(orderObject))
        return data
    }
    static async getOrders(){
        const { data } = await axios.get(this.baseUrl)
        return data
    }
    static async getOrderById(id){
        const { data } = await axios.get(`${this.baseUrl}?id=${id}`)
        return data
    }
}

export {Orders}