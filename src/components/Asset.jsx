import { Disclosure } from '@headlessui/react'
import { MdFavoriteBorder, MdKeyboardArrowUp } from 'react-icons/md'
import React, { useContext, useState } from 'react'
import truncate from '../utilS/truncate'
import { Link } from 'react-router-dom'
import { OnboardContext } from '../context/OnboardContext'
import { addDoc, collection, doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { ethers } from 'ethers'
import { marketConractABI as NftMarket, marketContractAddress, NFT_STORAGE_KEY } from '../utilS/constants'
import { useEffect } from 'react'
import { db } from '../utilS/firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

function AssetPlaceHolder() {

  const dynamicPanel = (param) => {
    return (
      <div className={param + ' my-5 rounded-md bg-[#1b1b23] md:mt-10 md:ml-5  p-2 h-[120px] '}>
      <div className=" animate-pulse h-2 bg-[#322e3d] rounded w-full"></div>
      <div className=' mt-5 flex'>
          <div className=" animate-pulse h-2 w-1/4  bg-[#322e3d] rounded"></div>
          <div className=" animate-pulse ml-4 h-2 w-1/3 bg-[#322e3d] rounded "></div>
      </div>
      <div className='relative '>
      <div className="mt-3 animate-pulse h-[50px] w-[90px] bg-[#26232e] rounded-md absolute p-1">
        <div className='bg-[#1b1b23]  h-full w-full rounded-md '></div>
      </div>
      <div className="ml-[100px] mt-3 animate-pulse h-[50px] w-[90px] bg-[#26232e] rounded-md absolute p-1">
        <div className='bg-[#1b1b23]  h-full w-full rounded-md '></div>
      </div>
      </div>
      </div>
    )
  }
  return (
    <div className='flex md:flex-row min-h-screen gradient-bg-welcome px-10 py-10 flex-col justify-center'>
      <div className='  flex h-full  flex-col md:ml-20'>
        <div className=' flex flex-col rounded-md bg-[#1b1b23] overflow-hidden  w-full h-full min-h-[300px]  md:w-[400px] md:h-[400px] lg:w-[600px] lg:h-[600px] pt-5'>
        <div className='animate-pulse bg-[#322e3d] mx-auto w-full h-full min-h-[300px] rounded-md ' />
        </div>
         {dynamicPanel('md:hidden inline w-full')}
          <div className=" mx-auto w-full h-full rounded-2xl mt-10 bg-[#1b1b23] p-2">
         <div className=' animate-pulse bg-[#322e3d] mx-auto w-full h-[40px] rounded-2xl ' />
         <div className=' animate-pulse bg-[#322e3d] mx-auto w-full h-[40px] rounded-2xl mt-5 ' />
          </div>
      </div>
      {dynamicPanel(' md:inline hidden w-[300px] ')}
    </div>
  )
}

function Asset({asset,owner,id}) {
  // console.log(owner.account_address === asset.owner_address ? "you" :"no");
  const { user, connectWallet, wallet, } = useContext(OnboardContext)
  const [ favorited,setFavorited ] = useState(false)
  const [ favorites, setFavorites ] = useState(0)
  const [ provider, setProvider ] = useState(null) 

  const addTofavorite = () => {
   setDoc(doc(collection(db,'users',user.account_address,'favorited'),asset.transactionHash), {
      owner: asset.owner_address   
    }).then( () =>
       {
        updateDoc(doc(db,'users',user.account_address ),{
          asset_favorited: increment(1)
        })
        updateDoc(doc(db,'assets',asset.transactionHash),{
          favorites: increment(1)
        })
        setFavorited(true)
        setFavorites(prev => prev+1)
       }
    )
   setDoc(doc(collection(db,'assets',asset.transactionHash,'favorited'),user.account_address), {
      user: user.account_address   
    })
  }
  const addToCollection = async (image) => {
    try {
      await addDoc(collection(db,'users',user.account_address,'collection'), {
      owner_name: user.user_name,
      owner_address: user.account_address,
      name: asset.name,
      description: asset.description,
      external_link: asset.external_link,
      favorites: 0,
      created_at: serverTimestamp(),
      sale: false,
      token_id: asset.token_id,
      transactionHash: asset.transactionHash,
      ipfs: asset.ipfs,
    }).then( (docRef) => {
      const imagesRef = ref(storage, `${user.account_address}/collection/${docRef.id}`);
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
            
            updateDoc( doc(db, "users", user.account_address),{
              asset_collected: increment(1)
            }).then( async () => {
              updateDoc( doc(db, "users", user.account_address,"collection",docRef.id),{
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
      
       }
   }
  const buy = async () => {
    try {
      if(!provider)
      {
        alert("You have to be Logged in to buy Nft")
        connectWallet()
        return
      }
      
      const signer = provider.getSigner()
      let contract = new ethers.Contract(marketContractAddress, NftMarket, signer)
      const price = ethers.utils.parseUnits(asset.price.toString(), 'ether')   
      const transaction = await contract.createMarketSale(asset.token_id, {
        value: price
      })
      await transaction.wait()
      console.log(transaction)
      fetch(
        asset.image_url,)
                    .then((res) => {
                      console.log(res)
                      res.blob().then(
                        async (result) => {
                          // console.log(result.text());
                          await addToCollection(result)
                      }
                      )
                    })
    }
    catch(error) {
      console.log(error);
    }
  }
  const assetRightBottomPanel = (param) => {
    return (
      <div className={'rounded-md bg-[#1b1b23] my-5  md:mt-10 md:ml-5 px-4 py-2 h-full   ' + param}>
      <div className=' text-white font-bold  text-3xl'>{asset.name}</div>
      <div className=' text-white font-bold mt-5 flex space-y-2 divide-y divide-[#322e3d]  flex-col'>
        <div className=' flex flex-row space-x-2 justify-start md:items-center'>
        <span className=' text-[#b9b9b9]'>Owned by</span>
        <span className=' text-[#a65151]'><a href={
         `/${user && user.account_address ===asset.owner_address ? 'Account' : asset.owner_address}`
          }>{user && user.account_address === asset.owner_address ? "you" : asset.owner_name ? asset.owner_name : truncate(asset.owner_address)}</a></span>
        </div>
        { owner && owner.account_address !==undefined ?  null : <div className='flex flex-col space-y-1 justify-start '>
        <span className=' text-[#b9b9b9]'>Price</span>
        <span className='text-2xl'> {asset.price}</span>  
        </div>  }
      </div>
      {owner && owner.account_address !==undefined ? 
      <div className="py-2 w-full mt-5 lg:self-center lg:mx-auto max-w-[450px] space-x-5 flex justify-evenly items-center rounded-xl ">
      <Link to={`/Edit/${id}`}>
      <div className=" text-white text-2xl custom-theme-animated-border rounded-md p-[2px] ">
           <div
        className='bg-[#1b1b23] rounded-md text-[30px] inline-block px-4 py-2 z-20 '>
         <p>Edit</p>
        </div>
        <span></span>
        <span></span>
           </div>
      </Link>
      <Link to={`/Sell/${id}`}>
           <div className=" text-white text-2xl  rainbow-animated-border rounded-md p-[2px] ">
           <div
        className='bg-[#1b1b23] rounded-md text-[30px] inline-block px-4 py-2 z-20 '>
         <p>Sell</p>
        </div>
        <span></span>
        <span></span>
           </div>
      </Link>
      </div> :
      <div className=' relative h-[100px] p-1'> 
      <div className=' rainbow-animated-border rounded-md p-1 left-0 mt-5 inline-block'>
        <div
        onClick={buy}
        className='bg-[#1b1b23] rounded-md text-[30px] inline-block px-4 py-1 z-20 '>
         <p>Buy</p>
         <span></span>
         <span></span>
        </div>
        <span></span>
        <span></span>
      </div>
      </div>
      }

</div>
    )
  }

  useEffect(  () => {
    if(!user || user.account_address === undefined || !asset || asset.transactionHash === undefined)
    return
    getDoc(doc(db,`users/${user.account_address}/favorited`,asset.transactionHash))
    .then(
      (fav) => {
        if(fav.exists())
        setFavorited(true)
      }
    )
    setFavorites(asset.favorites)
  },[asset])

  useEffect( () => {
    if (!wallet?.provider) {
      setProvider(null)
      connectWallet()
    } else {
    setProvider( new ethers.providers.Web3Provider(wallet.provider, 'any') )
    }
    console.log("provider : " ,provider)
  },[wallet])

  if(asset.owner_address===undefined || asset===undefined ||(owner!==null && owner.account_address === undefined)){
    console.log("asset o ",asset);
  return  <AssetPlaceHolder />
}
  return (
    <div className='flex md:flex-row min-h-screen gradient-bg-welcome px-2 py-2 sm:px-10 sm:py-10 flex-col justify-center'>
      <div className=' flex h-full  flex-col  md:ml-20 '>
        <div className=' flex flex-col md:flex-row '>
          <div className=' flex flex-col rounded-md bg-[#1b1b23] overflow-hidden'>
              <div className=' flex items-center self-end mr-5 my-2 text-[#b0a8c4]'>{favorites}
              {favorited ? <MdFavoriteBorder className=' ml-1 text-red-500' /> : user.account_address === asset.owner_address ? <MdFavoriteBorder className=' ml-1' /> : <MdFavoriteBorder 
              onClick={addTofavorite} 
              className=' ml-1 hover:text-red-500' /> }
              </div>
              <img src={asset.image_url} 
              className=' object-cover sm:w-full md:w-[600px] md:h-full'/>
          </div>
          {assetRightBottomPanel('md:hidden inline ')}
        </div>
         
          <div className="mx-auto w-full divide-y divide-[#322e3d] sm:w-full md:w-[600px] rounded-2xl mt-10 bg-[#1b1b23] p-2">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg  px-4 py-2 text-left text-xl text-white font-medium ">
                <span>Description</span>
               <MdKeyboardArrowUp 
               className={`${ 
                open ? '' : 'rotate-180 transform' 
              } h-5 w-5 text-purple-500`}/>
         
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-[#b0a8c4] text-clip">
               {asset.description}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure defaultOpen={true} as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-2 text-xl text-white font-medium ">
                <span>Details</span>
                <MdKeyboardArrowUp 
               className={`${
                open ? '' : 'rotate-180 transform' 
              } h-5 w-5 text-purple-500`}/>
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-[#b0a8c4] ">
              <div className=' flex justify-between'><p className=' text-[#cbc5db] '>Contract Address</p> 
              <a href="https://ropsten.etherscan.io/address/0x4d2e1ff643e1e338899a6716cccbb7a7085edf4c" target='_blank'>
                <p className=' text-[#a65151]'>{truncate('0x4d2e1ff643e1e338899a6716cccbb7a7085edf4c')}</p> 
              </a>
              </div>
              <div className=' flex justify-between mt-2'><p className=' text-[#cbc5db] '>Token Id</p> <p >{asset.token_id}</p> </div>
              <div className=' flex justify-between mt-2'><p className=' text-[#cbc5db] '>Txn Hash</p> 
              <a href={`https://ropsten.etherscan.io/tx/${asset.transactionHash}`} target='_blank'>
                <p className=' text-[#a65151]'>{truncate(asset.transactionHash ? truncate(asset.transactionHash) : '')}</p> 
              </a>
              </div>
              <div className=' flex justify-between mt-2'><p className=' text-[#cbc5db] '>Metadata</p> <p >Centralized</p> </div>
              <div className=' flex justify-between mt-2'><p className=' text-[#cbc5db] '>BlockChain</p> <p >Ropsten ETH</p> </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

          </div>
      </div>
      {assetRightBottomPanel(' md:inline hidden ')}
    </div>
  )
}

export default Asset