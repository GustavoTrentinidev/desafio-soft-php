import axios from 'axios'
import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const tokenState = atom({
    key: 'tokenState',
    default: {},
    effects_UNSTABLE: [persistAtom]
})

export class Auth {

    static formatData(info){
        const {username, password} = info
        const formData = new FormData()
        formData.append('username',username)
        formData.append('password',password)
        return formData
    }

    static async postInfo(url,loginInfo){
        const reqBody = Auth.formatData(loginInfo)
        try {
            const {data} = await axios.post(url, reqBody) 
            return data
        } catch (error){
            throw new Error(error)
        }
    }
    
    static async logout(){
        const {data} = await axios.post('http://localhost/routes/auth/logout.php')
        return data
    }
}

