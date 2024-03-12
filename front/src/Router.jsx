import { createBrowserRouter, redirect } from 'react-router-dom'
import { Home } from './Routes/Home'
import { AuthRoute } from './Routes/Auth'
import { Categories } from './Routes/Categories'
import { Products } from './Routes/Products'
// import { Header } from './components/Header/Header'
import { History } from './Routes/History'
import axios from 'axios'

const requireAuth = () => {
  if(axios.defaults.headers.common["Authorization"]){
    return null
  }
  return redirect('/login')
}

const router = createBrowserRouter([

    {
      path: '/',
      element: <Home/>,
      loader: requireAuth
    },
    {
      path: '/login',
      element: <AuthRoute/>,
    },
    {
      path: '/categories',
      element: <Categories/>,
      loader: requireAuth
    },
    {
      path: '/products',
      element: <Products/>,
      loader: requireAuth
    },
    {
      path: '/history',
      element: <History/>,
      loader: requireAuth
    }
])

export { router }