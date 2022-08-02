import { Popover, Transition } from '@headlessui/react'
import { Fragment, useContext } from 'react'
import { IoSettings } from 'react-icons/io5'
import { FaUserAlt,FaUserCircle } from 'react-icons/fa'
import { IoMdLogOut,IoMdLogIn } from 'react-icons/io'
import { MdFavoriteBorder } from 'react-icons/md'
import { OnboardContext } from '../context/OnboardContext'
const solutions = [
  {
    name: 'Profile',
    href: '/Account',
    icon: IconOne,
  },
  {
    name: 'Favorited',
    href: '/Account?tab=favorited',
    icon: IconTwo,
  },
  {
    name: 'Settings',
    href: '/Account/Settings',
    icon: IconThree,
  },
]

export default function UserDropdown() {
  const { connectWallet,disconnectWallet, connectedWallets,connecting,wallet,user } = useContext(OnboardContext);
  return (
    <div className=" text-white ">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
              `}
            >
           {user.user_image ? <img src={user.user_image} alt={user.user_name} 
           className=' rounded-full ring-2 ring-[#322e3d] h-[30px] w-[30px]'/> : <FaUserCircle size={30}/> }
             
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 -translate-x-1/2 transform px-1 sm:px-0 lg:max-w-3xl">
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
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

function IconOne() {
  return (
    <FaUserAlt />
  )
}
function IconTwo() {
  return (
    <MdFavoriteBorder />
  )
}

function IconThree() {
  return (
    <IoSettings />
  )
}
export { IconOne,IconTwo,IconThree,solutions}


