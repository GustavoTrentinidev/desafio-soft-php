import { Link } from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi";
import { useRef, useState } from 'react';



export function Header(){

    const [sideNav, setSideNav ] = useState(false)

    const overlay = useRef()

    function checkClick(e){
        if (e.target.id == 'headerOverlay'){
            setSideNav(false)
        }
    }

    const paths = [
        {pathname: 'Home', path: '/'},
        {pathname: 'Products', path: '/products'},
        {pathname: 'Categories', path: '/categories'},
        {pathname: 'History', path: '/history'},
        {pathname: 'Logout', path: '/login'}
    ]
    return (
        <div className="flex gap-12 items-center h-12 text-blue-900 border-b-2 border-b-blue-900 shadow-lg font-nunito select-none justify-between md:justify-start">
            <h1 className="text-2xl md:text-4xl text-center font-bolder ml-10 cursor-pointer">
                <Link to={'/'}>
                    Suite Store    
                </Link>
            </h1>
            <ul className="hidden gap-10 text-lg items-start w-2/3 md:flex">
                {
                    paths.map(item=>{
                        return (
                            <li key={item.pathname} className="cursor-pointer last:absolute right-10">
                                <Link to={item.path}>
                                    {item.pathname}
                                </Link>
                            </li>
                        ) 
                    })
                }
            </ul>
            <GiHamburgerMenu className='md:hidden mr-8' onClick={()=>{setSideNav(true)}}/>
            {
                sideNav &&
                <div className='absolute top-0 left-0 h-screen w-screen md:hidden bg-black z-10 bg-opacity-25' id="headerOverlay" ref={overlay}  onClick={(e)=>{checkClick(e)}}>
                    <nav className='absolute h-screen w-3/4 sideNavEnter bg-white'>
                    <h1 className="text-4xl text-center font-bolder cursor-pointer mb-5">Suite Store</h1>
                        <ul className="gap-10 text-lg flex flex-col w-full items-center">
                            {
                                paths.map(item=>{
                                    return (
                                        <li key={item.pathname} className="cursor-pointer text-3xl w-full text-center hover:bg-gray-200">
                                            <Link to={item.path}>
                                                {item.pathname}
                                            </Link>
                                        </li>
                                    ) 
                                })
                            }
                        </ul>
                    </nav>
                </div>
            }
        </div>
    )
}