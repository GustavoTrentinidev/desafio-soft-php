import { tokenState } from "../../store/auth"
import { useRecoilState } from "recoil"
import { setAuthHeaderToken }  from '../../plugins/axios'

export function GetToken(){
    const [token] = useRecoilState(tokenState)
    if(token.accessToken){
        setAuthHeaderToken(token.accessToken.token)
    }
  }