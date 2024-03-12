import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './Router.jsx'
import "./index.css"
import { RecoilRoot } from 'recoil';
import { GetToken } from './components/Token/GetToken.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RecoilRoot>
        <GetToken/>
        <RouterProvider router={router}/>
      </RecoilRoot>
  </React.StrictMode>,
)
