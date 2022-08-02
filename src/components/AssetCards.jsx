import React from 'react'
import { useNavigate } from 'react-router-dom'
import truncate from '../utilS/truncate'
import { SiEthereum } from "react-icons/si";
import moment from 'moment';


function AssetCard({id,asset}) {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/Assets/${id}`)} className=" my-20 group  rounded-xl overflow-hidden min-w-[320px] min-h-[400px] w-[320px] h-[500px] drop-shadow-lg ">
                <div className=' bg-slate-600 overflow-hidden items-center'>
                  <img src={asset.image_url} alt="" className="group-hover:scale-125 h-[320px] " /> 
                </div>
                <div className=" group-hover:from-[#22222b] group-hover:to-[#2f2b3b] p-4 flex-col bg-gradient-to-tr from-[#1b1b23]  to-[#22222b]   flex h-[140px] absolute mt-[-10px] rounded-xl w-[320px] ">
                  <div>
                    <p className='text-white'>{asset.name} </p>
                    <p className='text-gray-500 text-sm'>{asset.owner ? asset.owner : truncate(asset.owner_address)} </p>
                  </div>
                  <div>
                    <div className=' mt-2 text-white '>Price</div>
                    <div className=' flex text-white items-center'>
                      <SiEthereum />
                      <p className=" text-white ">{asset.price}</p>
                    </div>
                  </div>
                  
                </div>
    </div>
  )
}

function AssetCardCreated({id,asset}) {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/Created/${id}`)}  className=" my-20 group  rounded-xl overflow-hidden min-w-[320px] min-h-[400px] w-[320px] h-[500px] drop-shadow-lg">
    <div className=' bg-slate-600 overflow-hidden items-center'>
      <img src={asset.image_url} alt="" className="group-hover:scale-125 h-[320px] " /> 
    </div>
    <div className=" group-hover:from-[#22222b] group-hover:to-[#2f2b3b] justify-between p-4 flex-col bg-gradient-to-tr from-[#1b1b23]  to-[#22222b]   flex h-[140px] absolute mt-[-10px] rounded-xl w-[320px] ">
      <p className='text-white'>{asset.name} </p>
      
      <div className=' rounded-md bg-gradient-to-tr from-[#2f2339] flex items-center space-x-1 pl-1 w-fit'>
      <p className=' text-purple-200 '>Available</p>
      <div className=' text-purple-100 rounded-md bg-[#2f2339] px-3 py-1'>
        {asset.supply}
      </div>
     </div>
     <div className=' flex items-center space-x-2 text-sm text-gray-500'>
          <p >Created</p>
          <p >{ moment(asset.created_at.toDate()).format('MMMM YYYY').toString() }</p>
      </div>
    </div>
</div>
  )
}

export{ AssetCard, AssetCardCreated }