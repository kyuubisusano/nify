import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardContext } from '../context/OnboardContext'

function AssetPlaceHolder()
 {
  return (
    <div className=" my-20  shadow  max-w-sm w-[320px] h-[430px] rounded-xl mx-auto overflow-hidden">
    <div className="animate-pulse flex flex-col">
      <div className=" bg-[#322e3d]  w-[320px] h-[300px]"></div>
    </div>
    <div className=" bg-[#1b1b23] p-4 flex-col flex h-[140px] absolute mt-[-12px] rounded-xl w-[318px] mx-0 ">
    <div className="animate-pulse flex flex-col">
    <div className="flex-1 space-y-6 py-1">
    <div className=' animate-pulse bg-[#322e3d] w-1/2 h-[10px] rounded-2xl ' />
      <div className=" animate-pulse h-2 w-[5rem] bg-[#322e3d] rounded "></div>
      <div className=' mt-5 flex'>
      <div className=" animate-pulse h-2 w-[2rem]  bg-[#322e3d] rounded-full"></div>
      <div className=" animate-pulse ml-4 h-2 w-[5rem] bg-[#322e3d] rounded "></div>
      </div>
      </div>
      </div>
      </div>
  </div>
  )
 }




function AssetGrid({nfts,loading,Card}) {
    const navigate = useNavigate()
    const ell = [1,2,3,4,5,6]
    const { user } =  useContext(OnboardContext)

  if(loading || user===null || user.account_address===undefined)
   return (
    <div className=' flex w-full justify-center min-h-screen'>
    <div className="grid gap-10 pt-4 sm:mx-10 mx-20 md:mx-15 sm:grid-flow-cols md:grid-cols-2 gmf:grid-cols-3 overflow-visible ">
      { 
         ell.map((i) => <AssetPlaceHolder key={i} /> )
      }
    </div>
    </div>
   )

  return (
    <div className=' flex w-full justify-center min-h-screen'>
        <div className="grid gap-10 pt-4 sm:mx-10 mx-20 md:mx-15 sm:grid-flow-cols md:grid-cols-2 gmf:grid-cols-3 overflow-visible ">
          {
             nfts.map(({id,asset}) => (
              <Card key={id} id={id} asset={asset} />
            )) 
          }
        </div>
        
    </div>
  )
}

export default AssetGrid