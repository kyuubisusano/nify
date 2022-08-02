import React, { useContext, useRef, useState } from 'react'
import { Footer } from '../components/index.js'
import { OnboardContext } from '../context/OnboardContext';
import { FiCopy } from 'react-icons/fi'
import truncate from '../utilS/truncate.js';
import { BsFillImageFill, } from 'react-icons/bs'
import { FiEdit3 } from 'react-icons/fi'
import { MdDeleteForever } from 'react-icons/md'
import { useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { TwinSpin } from 'react-cssfx-loading/lib/index.js';
import { db, storage } from '../utilS/firebase.js';

function SettingsLoading() {
    return (
        <div>
        <div className='min-h-screen gradient-bg-welcome'>
           <div className=' justify-center items-center flex p-1 '>
            <div className='flex sm:w-1/2 flex-col md:flex-row'>
                <div>
                <a href='/Account'>    
                <div
                className=" font-bold my-4 w-1/3 border-white border-2 text-md md:text-xl text-white rounded-xl p-4 shadow-lg justify-center flex">
                Preview
                </div></a>
               <label className=' flex-col w-full text-[#dfdfdf] mt-8 '>
                <p className=""> Username</p>
                <input 
                disabled
                placeholder="Enter username"
                className=" cursor-not-allowed border rounded p-4 bg-transparent text-white my-2 min-w-[300px] w-full no-underline flex border-white focus:border-white focus:ring-0"
                />
        
                </label>

                <label className='flex-col w-full text-[#dfdfdf]'>
                Email
                <input 
                disabled
                placeholder="Enter email"
                className=" cursor-not-allowed border rounded p-4 bg-transparent text-white my-2 min-w-[300px] w-full border-white focus:border-white focus:ring-0"
                /> 
                </label>
                <label className='flex-col w-full text-[#dfdfdf]'>
                Bio
                <input 
                disabled
                placeholder="Enter about yourself"
                className=" cursor-not-allowed border rounded p-4 bg-transparent text-white my-2 min-w-[300px] w-full border-white focus:border-white focus:ring-0"
                /> 
                </label>
                <div
                 className=' cursor-not-allowed   my-2 bg-[#322e3d]  text-white text-sm p-1 pl-2 hidden md:flex rounded-lg items-end justify-end '>
                
                    <div className=' p-2 hover:bg-[#ffffff10] rounded-lg self-end mx-auto'><FiCopy size={18}  className=' text-gray-200'/> </div>
                </div>
                <div
                 className='  cursor-not-allowed  my-2 bg-[#322e3d]  text-white text-sm p-1 pl-2 flex md:hidden rounded-lg items-end justify-end '>
            
                    <div className=' p-2 hover:bg-[#ffffff10] rounded-lg self-end mx-auto'><FiCopy size={18}  className=' text-gray-200'/> </div>
                </div>

                <button className="font-bold mt-4 w-1/4 bg-[#924c81] text-xl text-white rounded-xl p-4 shadow-lg">
                </button>
                </div>
                </div>
                
           </div>
           
        </div>
        <Footer/>
    </div>
    )
}


function Settings() {
  const { user,updateUserData } = useContext(OnboardContext)
  const [formInput, updateFormInput] = useState({ user_name: '', email: '', bio: ''})
  const [userImageUrl, setUserImageUrl] = useState(null)
  const [userCoverUrl, setUserCoverUrl] = useState(null)
  const [ userImageLoading, setUserImageLoading ] = useState(false)
  const [ userCoverLoading, setUserCoverLoading ] = useState(false)
  const userImageInputFile = useRef(null)
  const userCoverInputFile = useRef(null)

  const userMedia = (classname) => {
    return (
        <div className={ ' items-center flex-col m-10 ' + classname }>
        <div onClick={(e) => userImageInputFile.current.click() } className={` group  h-[120px] w-[120px] ring-4 ring-[#1b1b23] bg-[#1b1b23] rounded-full flex justify-center`}>
        { userImageUrl && !userImageLoading &&
            <div className=' group-hover:visible invisible black-glassmorphism flex h-[120px] w-[120px] absolute rounded-full '>
                <FiEdit3  size={20} className=' self-center mx-auto text-[#cea2ff]'/>
                </div> }
           {userImageLoading ? <TwinSpin color='#a658ff' width="25px" height="25px" duration="3s" className=' self-center text-[#a658ff]'/> :
            <img 
                className={" object-cover rounded-full ring-4 ring-[#1b1b23] bg-[#1b1b23] h-[120px] w-[120px]  "} 
                src={userImageUrl} alt={user.user_name}/> }
            <input
                type="file"
                name="userimage"
                className="my-4 hidden"
                accept='image/*'
                ref={userImageInputFile}
                onChange={e => changeUserImage(e)}
            /> 
        </div>
         <div onClick={(e) => userCoverInputFile.current.click() }  className=' group h-[120px] md:w-[120px] w-full bg-[#1b1b23] rounded-md my-5 overflow-hidden justify-center flex relative'>
         { userCoverUrl && !userCoverLoading &&
            <div className=' group-hover:visible invisible black-glassmorphism flex h-[120px] md:w-[120px] w-auto left-0 right-0 absolute rounded '>
                <FiEdit3  size={20} className=' self-center mx-auto text-[#cea2ff]'/>
                </div> }
                {userCoverLoading  ? <TwinSpin color='#a658ff' width="25px" height="25px" duration="3s" className=' self-center text-[#a658ff]'/> :    
            <img className="h-[120px] md:w-[120px] w-full bg-[#1b1b23]  object-cover" src={userCoverUrl} alt={user.user_name}/>}
              <input
                type="file"
                name="usercover"
                className="my-4 hidden"
                accept='image/*'
                ref={userCoverInputFile}
                onChange={e => changeUserCover(e)}
            /> 
         </div>

    </div>
    )
}

  const changeUserImage = async (e) => {
    console.log("userimage input event")
    const file = e.target.files[0]
    try {
      try{
        if(file)
      {
        console.log(file);
        setUserImageLoading(true)
        const imagesRef = ref(storage, `${user.account_address}/Profile/userImage`);
        const uploadTask = uploadBytesResumable(imagesRef,file)
        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
        console.log(error.code)
        setUserImageLoading(false)
        }, 
        async () => {
            getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
            console.log('File available at', downloadURL);
            setUserImageUrl(downloadURL)
            updateUserData(user.account_address,{
                    user_image: downloadURL,
                })
            setUserImageLoading(false)
            });
        }
        )
      }
      }catch(error)
      {
        console.log(error)
      }
  
 
    } catch (error) {
      console.log('Error uploading file: ', error)
      setUserImageLoading(false)
    }  
  }
  const changeUserCover = async (e) => {
    console.log("usercover input event")
    const file = e.target.files[0]
    try {
      try{
        if(file)
      {
        console.log(file);
        setUserCoverLoading(true)
        const imagesRef = ref(storage, `${user.account_address}/Profile/userCover`);
        const uploadTask = uploadBytesResumable(imagesRef,file)
        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
        console.log(error.code)
        setUserCoverLoading(false)
        }, 
        async () => {
            getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
            console.log('File available at', downloadURL);
            setUserCoverUrl(downloadURL)
            updateUserData(user.account_address,{
                    user_cover: downloadURL,
                })
            setUserCoverLoading(false)
            });
        }
        )
      }
      }catch(error)
      {
        console.log(error)
      }
  
 
    } catch (error) {
      console.log('Error uploading file: ', error)
      setUserCoverLoading(false)
    }  
  }

  useEffect( () => {
    if(user && user.user_name !== undefined)
{    setUserImageUrl(user.user_image)
    setUserCoverUrl(user.user_cover)
    updateFormInput({user_name:user.user_name,email:user.email,bio:user.bio})}
  },[user])

  if(user===undefined || user===null ||  user.user_name === undefined)
  return (<SettingsLoading />)
  return (
    <div>
        <div className='min-h-screen gradient-bg-welcome'>
           <div className=' justify-center items-center flex p-1 '>
            <div className='flex sm:w-1/2 flex-col md:flex-row'>
                <div>
                <div
                className="font-bold my-4 w-1/3 border-white border-2 text-md md:text-xl text-white rounded-xl p-4 shadow-lg justify-center flex">
               <a href='/Account'> Preview</a>
                </div>
               <label className='flex-col w-full text-[#dfdfdf] mt-8 '>
                <p className=""> Username</p>
                <input 
                value={formInput.user_name}
                placeholder="Enter username"
                className="  border rounded p-4 bg-transparent text-white my-2 min-w-[300px] w-full no-underline flex border-white focus:border-white focus:ring-0"
                />
        
                </label>

                <label className='flex-col w-full text-[#dfdfdf]'>
                Email
                <input 
                value={formInput.email}
                placeholder="Enter email"
                className=" border rounded p-4 bg-transparent text-white my-2 min-w-[300px] w-full border-white focus:border-white focus:ring-0"
                /> 
                </label>
                <label className='flex-col w-full text-[#dfdfdf]'>
                Bio
                <input 
                value={formInput.bio}
                placeholder="Enter about yourself"
                className=" border rounded p-4 bg-transparent text-white my-2 min-w-[300px] w-full border-white focus:border-white focus:ring-0"
                /> 
                </label>
                <div
                onClick={() =>  navigator.clipboard.writeText(user.account_address)}
                 className=' my-2 bg-[#322e3d]  text-white text-sm p-1 pl-2 hidden md:flex rounded-lg items-center justify-between'>
                    {user.account_address}
                    <div className=' p-2 hover:bg-[#ffffff10] rounded-lg'><FiCopy size={18}  className=' text-gray-200'/> </div>
                </div>
                <div
                onClick={() =>  navigator.clipboard.writeText(user.account_address)}
                 className=' my-2 bg-[#322e3d]  text-white text-sm p-1 pl-2 flex md:hidden rounded-lg items-center justify-between'>
                    {truncate(user.account_address)}
                    <div className=' p-2 hover:bg-[#ffffff10] rounded-lg'><FiCopy size={18}  className=' text-gray-200'/> </div>
                </div>
                { userMedia('flex md:hidden') }
                <button className="font-bold mt-4 w-1/4 bg-[#924c81] text-xl text-white rounded-xl p-4 shadow-lg">
                Save
                </button>
                </div>
                 { userMedia('hidden md:flex') }
                </div>
                
           </div>
           
        </div>
        <Footer/>
    </div>
  )
}

export default Settings