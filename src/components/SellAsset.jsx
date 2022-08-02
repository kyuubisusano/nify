import { DatePicker, DatePickerInput } from '@carbon/react';
import React, { useContext, useEffect, useState } from 'react'
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
// import 'react-dates/lib/css/_datepicker.css';
import '../calendar.css';
import 'react-dates/initialize';
import { marketConractABI as NftMarket, marketContractAddress, NFT_STORAGE_KEY } from '../utilS/constants'
import { addDoc, collection, deleteDoc, doc, getDoc, increment, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
import { File, NFTStorage } from 'nft.storage'
// import Moment from 'react-moment';
import moment from 'moment';
import { db, storage } from '../utilS/firebase';
import { FadingBalls, Hypnosis } from 'react-cssfx-loading/lib';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { OnboardContext } from '../context/OnboardContext';
import { ethers } from 'ethers';
// import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
// import aphroditeInterface from 'react-with-styles-interface-aphrodite';
// import DefaultTheme from 'react-dates/lib/theme/DefaultTheme';
 
// ThemedStyleSheet.registerInterface(aphroditeInterface);
// ThemedStyleSheet.registerTheme({
//   reactDates: {
//     ...DefaultTheme.reactDates,
//     color: {
//       ...DefaultTheme.reactDates.color,
//       highlighted: {
//         backgroundColor: '#82E0AA',
//         backgroundColor_active: '#58D68D',
//         backgroundColor_hover: '#58D68D',
//         color: '#186A3B',
//         color_active: '#186A3B',
//         color_hover: '#186A3B',
//       },
//     },
//   },
// });

async function storeNFT(image, name, description) {
  
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

    return nftstorage.store({
        image,
        name,
        description,
    })
}

function SellAsset({asset,id}) {
  const [ formInput, updateFormInput ] = useState({ quantity: 1, price: '', link: '',})
  const { connectWallet, wallet, } = useContext(OnboardContext)
  const [ provider,setProvider ] = useState(null) 
  const [ loading, setLoading ] = useState(false)
  const [ startDate, setStartDate ] = useState(null)
  const [ endDate, setEndDate ] = useState(null)
  const [ focusedInput, setFocusedInput ] = useState(null)
  const [ image, setImage ] = useState(null)

  const addAssetToFirestore  = async (url,token,txnHAsh) => {
    const imagesRef = ref(storage, `assets/${txnHAsh}`);
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
  
          await setDoc(doc(db,'assets',txnHAsh), {
            ipfs: url,
            price: formInput.price,
            owner: asset.owner_name,
            owner_address: asset.owner_address,
            token_id: token,
            transactionHash: txnHAsh,
            name: asset.name,
            description: asset.description,
            image_url: downloadURL,
            start_date: Timestamp.fromDate(startDate.toDate()),
            end_date: Timestamp.fromDate(endDate.toDate()),
            external_link: formInput.link,
            created_at: serverTimestamp(),
            quantity: formInput.quantity,
            favroites: 0,
            id: id,
          }).then( async () => {
              await updateDoc(doc(db, "users", asset.owner_address,'creation',id),{
                supply: increment(-formInput.quantity)
              })
            //   if( asset.supply - formInput.quantity <= 0 ){
            // await deleteDoc(doc(db, "users", owner,'creation',id))
            //   await updateDoc(doc(db, "users", asset.owner),{
            //     asset_created: increment(-1)
            //   })
            // }

          })
        
        });
      }
    )
  
  }
  

  async function listAssetForSale() {
    setLoading(true)
    const nftToken = await storeNFT(image,asset.name,asset.description)
    try{
      const signer = provider.getSigner()
      const price = ethers.utils.parseUnits(formInput.price, 'ether')
      let contract = new ethers.Contract(marketContractAddress, NftMarket, signer)
      let listingPrice = await contract.getListingPrice()
      listingPrice = listingPrice.toString()
      console.log(listingPrice)
      let transaction = await contract.createToken('url', price, { value: listingPrice })
  
      const receipt = await transaction.wait()

      const tokenId = receipt.events[0].args.tokenId.toString()

      const transactionHash = receipt.transactionHash

      await addAssetToFirestore(nftToken.url,tokenId,transactionHash)
    }catch (error)
     {
      console.log(error)
      
     }finally{
    
      setLoading(false)
     }
  }


  useEffect( () => {
    console.log(startDate," ",new Date())
    if(startDate)
    console.log(startDate.unix()," ",startDate.valueOf()," ",Timestamp.fromDate(startDate.toDate()))
    console.log(endDate)
  },[startDate,endDate])

  useEffect( () => {
    if (!wallet?.provider) {
      setProvider(null)
      connectWallet()
    } else {
    setProvider( new ethers.providers.Web3Provider(wallet.provider, 'any') )
    }
    console.log("provider : " ,provider)
  },[wallet])

  useEffect( () => {
    fetch(
      asset.image_url,)
                  .then((res) => {
                    console.log(res)
                    res.blob().then(
                      (result) => {
                        // console.log(result.text());
                        setImage(result)
                    }
                    )
                  })
  },[asset])
  
  return (
    <div className=' min-h-screen py-2'>
    <div  className=' justify-center flex'>
       <div className="px-1 sm:w-1/2 flex flex-col pb-12 justify-start space-y-5 ">
        {
          asset.image_url ? (
            <img className="rounded w-[230px] h-[160px] max-h-full max-w-full bg-cover" src={asset.image_url} />
          ) :
          <div className=' animate-pulse rounded w-[230px] h-[160px] bg-[#1b1b23] '></div>
        }
       
      <label className='flex-col w-full text-[#dfdfdf] mt-8 '>
         <p className=""> Quantity</p>
        <input 
        id='datepickerId'
          value={formInput.quantity}
          placeholder="Asset Name"
          min={1}
          max={asset.supply}
          type='number'
          className="  border rounded p-4 bg-transparent text-white my-2 min-w-[300px] w-full no-underline flex border-white focus:border-white focus:ring-0"
          onChange={e => {e.target.value<=asset.supply ? updateFormInput({ ...formInput, quantity: e.target.value }) : ''}}
        />
         <p className='flex justify-end text-sm text-gray-500 mx-auto'>{asset.supply} available</p>
        </label>

        <label className='flex-col w-full text-[#dfdfdf]'>
          Price per unit
          <input 
          value={formInput.price}
          placeholder="Amount"
          min={1}
          type='number'
          className=" border rounded p-4 bg-transparent text-white my-2 min-w-[300px] w-full border-white focus:border-white focus:ring-0"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        /> 
        <p className='flex justify-end text-sm text-gray-500 mx-auto'>Total: {formInput.price * formInput.quantity} Eth </p>
        </label>

        <DateRangePicker 
          className=' bg-slate-500'
          startDate={startDate} // momentPropTypes.momentObj or null,
          startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
          endDate={endDate} // momentPropTypes.momentObj or null,
          endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
          onDatesChange={({ startDate, endDate }) => {setStartDate(startDate);setEndDate(endDate)} } // PropTypes.func.isRequired,
          focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={focusedInput => setFocusedInput(focusedInput)} // PropTypes.func.isRequired,
          numberOfMonths={1}
          required={true}
        />

        <div className=' flex justify-between'>
        { !loading ? <button
        onClick={ () => { listAssetForSale() }}
        className="font-bold mt-4 w-1/3 bg-[#924c81] text-lg text-white rounded-xl p-4 shadow-lg">
          List Asset
        </button> :
       
        <div className=' bg-purple-800 rounded p-4 mt-4 flex justify-evenly cursor-progress w-1/3'>
          <FadingBalls color="pink" width="25px" height="25px" duration="3s" />
          
          </div>
        }
          
            </div> 
      </div>
    </div>
    </div>
  )
}

export default SellAsset