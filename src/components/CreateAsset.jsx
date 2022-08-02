import { Fragment, useState } from 'react'
import { ethers } from 'ethers'
import { BsFillImageFill, } from 'react-icons/bs'
import { MdDeleteForever } from 'react-icons/md'
import { useEffect, useContext, useRef  } from 'react'
import { OnboardContext } from '../context/OnboardContext'
import { Hypnosis } from 'react-cssfx-loading/lib'
import { addDoc, collection, deleteDoc, doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../utilS/firebase'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react'


export default function CreateAsset({asset,id,msg}) {
  const [fileUrl, setFileUrl] = useState(null)
  const [image,setImage] = useState(null)
  const [formInput, updateFormInput] = useState({ name: '', description: '', link: '',supply: 1 })
  const { connectWallet, wallet,user } = useContext(OnboardContext)
  const [provider,setProvider] = useState(null) 
  const [loading,setLoading] = useState(false)
  const inputFile = useRef(null);
  const navigate = useNavigate()
  const [ isOpen, setIsOpen ] = useState(false)


  async function onChange(e) {
    console.log("input event")
    const file = e.target.files[0]
    try {
      try{
        if(file)
      {
        setImage(file) 
        setFileUrl(file.url)
      }
      }catch(error)
      {
        console.log(error)
      }
  
 
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }


 const Create = async () => {
  setLoading(true)
  console.log(loading)
  try {
  
  const creationRef = await addDoc(collection(db,'users',wallet.accounts[0].address,'creation'), {
    owner_name: user.user_name,
    owner_address: wallet.accounts[0].address,
    name: formInput.name,
    description: formInput.description,
    external_link: formInput.link,
    supply: formInput.supply,
    favorites: 0,
    created_at: serverTimestamp(),
    sale: false,
  }).then( (docRef) => {
    const imagesRef = ref(storage, `${wallet.accounts[0].address}/creation/${docRef.id}`);
    const uploadTask = uploadBytesResumable(imagesRef,image)
    uploadTask.on('state_changed', 
    (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
    (error) => {
       console.log(error.code)
      }, 
    () => {
        getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
          console.log('File available at', downloadURL);
          
          updateDoc( doc(db, "users", wallet.accounts[0].address),{
            asset_created: increment(1)
          }).then( async () => {
            updateDoc( doc(db, "users", wallet.accounts[0].address,"creation",docRef.id),{
              image_url: downloadURL,
            })
          })
        });
      }
    )
  })
 



    }catch (error)
     {
      console.log(error)
      
     }finally{
    
      setLoading(false)
      console.log(loading)
     }
 }

 const Save = async () => {
  setLoading(true)
  console.log(loading)

  try {
  // addDataUserDatatoFirebase("",formInput.price,wallet.accounts[0].address," "," ",formInput.name,formInput.description,formInput.link)
  
  fetch(
    asset.image_url,)
                .then((res) => {
                  console.log(res)
                  res.blob().then(
                    (result) => {
                      
                      const imagesRef = ref(storage, `${user.account_address}/creation/${id}`);
                      deleteObject(imagesRef).then(() => {
                        // File deleted successfully
                      }).then(() => {
                        const uploadTask = uploadBytesResumable(imagesRef,result)
                      uploadTask.on('state_changed', 
                      (snapshot) => {
                          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      },
                      (error) => {
                         console.log(error.code)
                        }, 
                      () => {
                          getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
                            console.log('File available at', downloadURL);
                            await updateDoc(doc(db,'users',wallet.accounts[0].address,'creation',id), {
                                owner_address: wallet.accounts[0].address,
                                name: formInput.name,
                                description: formInput.description,
                                image_url: downloadURL,
                                external_link: formInput.link,
                                modified_at: serverTimestamp(),
                              })
                              .then( () =>{
                                setLoading(false)
                              })
                           
                          });
                        }
                      )
                      })
                      .catch((error) => {
                        // Uh-oh, an error occurred!
                      });
              
                  }
                  )
                })
  
 
  



    }catch (error)
     {
      console.log(error)
      
     }finally{
    
      
      console.log(loading)
     }
 }

 const Delete = async () => {
  
 
  console.log(loading)
  try {
  // addDataUserDatatoFirebase("",formInput.price,wallet.accounts[0].address," "," ",formInput.name,formInput.description,formInput.link)
  const imagesRef = ref(storage, `${user.account_address}/creation/${id}`);
  deleteObject(imagesRef).then(() => {
    // File deleted successfully
  }).then(() => {
    const uploadTask = uploadBytesResumable(imagesRef,image)
  uploadTask.on('state_changed', 
  (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  },
  (error) => {
     console.log(error.code)
    }, 
  async () => {
    await deleteDoc(doc(db, "users", user.account_address,'creation',id));
    navigate("/Account?tab=created", { replace: true });
    }
  )
  })
  .catch((error) => {
    // Uh-oh, an error occurred!
  });
  



    }catch (error)
     {
      console.log(error)
      
     }finally{
    
      
      console.log(loading)
     }
 }

 useEffect( () => {
    if (!wallet?.provider) {
      setProvider(null)
      connectWallet()
    } else {
    setProvider( new ethers.providers.Web3Provider(wallet.provider, 'any') )
    }
    console.log("provider : " ,provider)
  },[wallet])

  useEffect(() => {
    if (image)
   { setFileUrl(URL.createObjectURL(image))
    console.log(image)
    console.log(fileUrl)}
  }, [image])

  useEffect( () => {
    if(asset=== undefined) return
    if(asset.name!== undefined)
      { setFileUrl(asset.image_url)
        updateFormInput({name:asset.name,description:asset.description,supply:asset.supply,link:asset.external_link})}
  },[asset])

  return ( 
    <>
    <div className=" flex justify-center flex-col min-h-screen items-center " >
      <div className="px-1 sm:w-1/2 flex flex-col pb-12 justify-start ">
      <p className="mt-5  text-[#dfdfdf] before:content-['*'] before:ml-0.5 before:text-red-500"> Required Fields</p>
 
          <p className="text-[#dfdfdf] after:content-['*'] mb-1 after:ml-0.5 after:text-red-500">Image</p>
          <p className="text-[#c7c7c7] mb-1 text-[11px] ">Files types Supported: jpg,gpeg,png. Max size: 100 MB</p>
        <div onClick={(e) => inputFile.current.click() } className={` group w-[300px] h-[220px] border-2 border-dashed border-white rounded flex justify-center p-1`}>
        { fileUrl ?
         <div className=' group-hover:visible invisible black-glassmorphism flex w-[290px] h-[208px] absolute rounded '>
          <BsFillImageFill  size={50} className=' self-center mx-auto text-[#1b1b23]'/>
          <MdDeleteForever size={25} className='absolute self-end mx-auto right-1 mb-1 text-[#d5d5d5]' onClick={(e) => {setFileUrl(null); setImage(null); e.stopPropagation()}}/>
        </div> :
         <div className=' group-hover:visible invisible white-glassmorphism flex justify-center w-[290px] h-[208px] absolute rounded '>
          <BsFillImageFill  size={50} className='visible self-center absolute text-[#322e3d]  '/> 
          </div>}
        {
          fileUrl && (
            <img className="rounded w-[300px] h-[220px] max-h-full max-w-full bg-cover" src={fileUrl} />
          )
        }
        <input
          type="file"
          name="Asset"
          className="my-4 hidden"
          accept='image/*'
          ref={inputFile}
          onChange={onChange}
        /> 
        </div> 
      <label className='flex-col w-full text-[#dfdfdf] mt-8 '>
         <p className="after:content-['*'] after:ml-0.5 after:text-red-500"> Name</p>
        <input 
          value={formInput.name}
          placeholder="Asset Name"
          className="  border rounded p-4 bg-transparent text-white my-2 min-w-[300px] w-full no-underline"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        /></label>
        <label className='flex-col w-full text-[#dfdfdf]'>
          Description
        <textarea
          value={formInput.description}
          placeholder="Asset Description"
          className="mt-2 border rounded p-4 bg-transparent text-white my-2 min-w-[300px] w-full border-white focus:border-white focus:ring-0"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        /> </label>
        <label className='flex-col w-full text-[#dfdfdf]'>
          External Link
        <input
          value={formInput.link}
          placeholder="Link Website"
          className="mt-2 border rounded p-4 bg-transparent text-white my-2 min-w-[300px] w-full border-white focus:border-white  focus:ring-0"
          onChange={e => updateFormInput({ ...formInput, link: e.target.value })}
        /> </label>
        {msg.mode==='Create' ? <label className='flex-col w-full text-[#dfdfdf]'>
          Supply
        <input
          value={formInput.supply}
          min="1"
         type='number'
          className=" mt-2 border rounded p-4 bg-transparent text-white my-2 min-w-[300px] w-full border-white focus:border-white focus:ring-0 "
          onChange={e =>{ e.target.value > 0 ? updateFormInput({ ...formInput, supply: e.target.value }) : ""}}
        />
        </label> : null }
        <div className=' flex justify-between'>
        { !loading ? <button onClick={() => { 
          msg.mode==='Create' ?
           Create() :
           Save()
        }} className="font-bold mt-4 w-1/4 bg-[#924c81] text-xl text-white rounded-xl p-4 shadow-lg">
          {msg.mode}
        </button> :
       
        <div className=' bg-purple-800 rounded p-4 mt-4 flex justify-evenly cursor-progress w-1/3'>
          <Hypnosis color="pink" width="25px" height="25px" duration="3s" />
          <p className='text-white ml-1'>{msg.action} </p>
          </div>
        }
          {msg.mode==='Save' ? 
          <button
          onClick={()=> setIsOpen(true)}
          className=' border border-red-600 text-red-600 hover:border-red-500 hover:text-red-500 text-xl items-center mt-4 w-1/4 rounded-xl p-4 '>
            Delete
          </button> : null}  
            </div> 
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-[#1b1b23] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-[#cbc5db]"
                  >
                    Delete Item
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-[#b9b9b9]">
                     Are you sure you want to delete this item? 
                    </p>
                  </div>
                  <div className=' flex justify-between'>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none  "
                      onClick={()=> setIsOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent hover:bg-red-500 px-4 py-2 text-sm font-medium hover:text-red-100 bg-red-200 text-red-500  focus:outline-none "
                      onClick={()=> Delete()}
                    >
                      Delete
                    </button>
                  </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
     </div>
     </>
  )
}