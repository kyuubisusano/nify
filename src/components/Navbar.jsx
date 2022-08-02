import React, { useContext, useState } from 'react'
import nifyLogo from '../../images/nifyLogo.png'
import { HiMenuAlt4 } from "react-icons/hi";
import { AiFillPlayCircle, AiOutlineClose,AiFillHome } from "react-icons/ai";
import { MdOutlineExplore, MdKeyboardArrowUp  } from 'react-icons/md'
import { FaUserCircle } from 'react-icons/fa'
import { IoCreate } from 'react-icons/io5'
import { IoMdLogOut,IoMdLogIn } from 'react-icons/io'
import {  Link, NavLink } from "react-router-dom";
import { OnboardContext } from '../context/OnboardContext';
import UserDropdown from './UserDropdown';
import { Disclosure } from '@headlessui/react';
import { IconOne,IconTwo,IconThree,solutions } from './UserDropdown'

function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { connectWallet,disconnectWallet, connectedWallets,connecting,wallet,user } = useContext(OnboardContext);
  return (
    <nav className='w-full flex md:justify-center justify-between items-center p-4 gradient-bg-navbar'>
      <div className='md:flex-[0.6] flex-initial justify-center items-center' >
        <img src={nifyLogo} alt="logo"  className="w-32 cursor-pointer" />
      </div>
   
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
         <li className={` mx-4 cursor-pointer `}> <NavLink to="/" className={({isActive}) => "nav-link" + (!isActive ? " unselected text-white" : " font-bold text-[#a65151]")}>
          Home</NavLink></li>
         <li className={`text-white mx-4 cursor-pointer `}> <NavLink className={({isActive}) => "nav-link" + (!isActive ? " unselected text-white" : " font-bold text-[#a65151]")} to="/Explore">
          Explore</NavLink></li>
         <li className={`text-white mx-4 cursor-pointer `}> <NavLink className={({isActive}) => "nav-link" + (!isActive ? " unselected text-white" : " font-bold text-[#a65151]")} to="/Create">
          Create</NavLink></li>
         <div className=' ml-10 float-right flex'>  <UserDropdown /> </div>
      </ul>
    
       
      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
        )}
        {toggleMenu && (
          <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-5 px-10 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col rounded-md bg-[#151923]  text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2"><AiOutlineClose onClick={() => setToggleMenu(false)} /></li>

            <li onClick={() => setToggleMenu(false)}  > <Link to="/" 
            className='mt-5 flex items-center rounded-lg my-1 w-full px-2 transition duration-150 ease-in-out bg-gradient-to-r from-[#232128] to-[#251925] hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50'>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
            <AiFillHome size={30}/>
                        </div>
                        <div className="ml-4 ">
                          <p className="text-2xl font-medium text-white">
                            Home
                          </p>
                        </div></Link></li>
            <li onClick={() => setToggleMenu(false)}> <Link to="/Explore" 
            className=' mt-5 flex items-center rounded-lg my-1 w-full px-2 transition duration-150 ease-in-out bg-gradient-to-r from-[#232128] to-[#251925] hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50'>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
            <MdOutlineExplore size={30}/>
                        </div>
                        <div className="ml-4 ">
                          <p className="text-2xl font-medium text-white">
                           Explore
                          </p>
                        </div></Link></li>

            <li onClick={() => setToggleMenu(false)}> <Link to="/Create" 
            className='mt-5 flex items-center rounded-lg my-1 w-full px-2 transition duration-150 ease-in-out bg-gradient-to-r from-[#232128] to-[#251925] hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50'>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
            <IoCreate size={30}/>
                        </div>
                        <div className="ml-4 ">
                          <p className="text-2xl font-medium text-white">
                           Create
                          </p>
              </div></Link></li>   

          <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button 
              className='mt-5 flex items-center rounded-lg my-1 w-full px-2 transition duration-150 ease-in-out bg-gradient-to-r from-[#232128] to-[#251925] hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50'>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                {user.image_url ? <img src={user.image_url} alt={user.user_name}/> : <FaUserCircle size={30}/> }
                        </div>
                        <div className="ml-4 ">
                          <p className="text-2xl font-medium text-white">
                           Account
                          </p>
              </div>
               <MdKeyboardArrowUp 
               className={`${ 
                open ? '' : 'rotate-180 transform' 
              } h-5 w-5 text-purple-500 mr-0 ml-auto`}/>
         
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-[#b0a8c4]">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative bg-[#151923] p-2 ">
                    {solutions.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className=" flex items-center rounded-lg my-1 w-full px-2 transition duration-150 ease-in-out bg-gradient-to-r from-[#232128] to-[#251925] hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                          <item.icon aria-hidden="true" />
                        </div>
                        <div className="ml-4 ">
                          <p className="text-sm font-medium text-white">
                            {item.name}
                          </p>
                        </div>
                      </a>
                    ))}
                  {connectedWallets.length ?  <a className=" flex cursor-pointer  items-center rounded-lg my-1 w-full px-2 transition duration-150 ease-in-out bg-gradient-to-r from-[#232128] to-[#251925] hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        onClick={() => disconnectWallet(wallet)}
                     >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                          <IoMdLogOut />
                        </div>
                        <div className="ml-4 ">
                          <p className="text-sm font-medium text-white">
                            Log Out
                          </p>
                        </div>
                      </a> :  <a className=" flex cursor-pointer  items-center rounded-lg my-1 w-full px-2 transition duration-150 ease-in-out bg-gradient-to-r from-[#232128] to-[#251925] hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                     onClick={() => connectWallet()}
                     >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                          <IoMdLogIn />
                        </div>
                        <div className="ml-4 ">
                          <p className="text-sm font-medium text-white">
                            Log In
                          </p>
                        </div>
                      </a>}
                  </div>
                
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>      
           
          </ul>
        )}
     
      </div>
    </nav>
  )
}

export default Navbar