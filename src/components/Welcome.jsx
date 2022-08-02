import React, { useContext, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import {  Link } from "react-router-dom";

import { OnboardContext } from "../context/OnboardContext";
// import { shortenAddress } from "../utils/shortenAddress";
import { Loader } from ".";
import { HexGridItem, HexGridList } from "react-hex-grids";
import'../hex.css'
import truncate from "../utilS/truncate";
import { useEffect } from "react";
import { collection, doc, getDoc, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";
import { db } from "../utilS/firebase";

const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const Welcome = () => {
  const { user } = useContext(OnboardContext);
  const [ featured, setFeatured ] = useState({})

  const featuredPanel = (param) => {
    if(!featured || featured.image_url===undefined)
     return(
      <div className={param + " bg-[#1b1b23] h-full w-full md:max-h-[300px] md:max-w-[400px] lg:max-h-[400px] lg:max-w-[500px]  rounded-lg overflow-hidden "}>
        <div className=" animate-pulse bg-[#322e3d]  w-full h-[250px] md:max-w-[400px] lg:h-[350px] lg:max-w-[500px] "/>
        <div className=" p-2 pl-3 flex items-center space-x-3 " >
          <div className=" animate-pulse w-[32px] h-[32px] bg-[#322e3d] rounded-full border-0 outline-0" />
        </div>
      </div>
     )
    return(
      <div className={param + " bg-[#1b1b23] h-full w-full md:max-h-[300px] md:max-w-[400px] lg:max-h-[400px] lg:max-w-[500px]  rounded-lg overflow-hidden "}>
            <img 
            className="flex-1 w-full object-cover border-0 h-[240px] lg:h-[340px]"
            src={featured.image_url} />
            <div className=" p-2 pl-3 flex items-center space-x-3 ">
              { featured.user_image ? <img 
              className=" bg-[#22222c] w-[32px] h-[32px] rounded-full ring-4 ring-[#1b1b23] "
              src={featured.user_image} alt={"U"}/> :
              <div className=" bg-[#22222c] w-[32px] h-[32px] rounded-full ring-4 ring-[#1b1b23] " />}
              <div className=" text-white text-[12px] ">
                <p className=" text-base ">{featured.name}</p>
                <p>by { featured.owner ? featured.owner : truncate(featured.owner_address) }</p>
              </div>
            </div>
      </div>
    )
  }
  
  const buttonsPanel = (param) => {
    return(
      <div className={ param +" p-5 md:w-96 w-full justify-evenly items-center bg-[#1b1b23] rounded-xl mt-5 "}>
          <Link to="/Create">
               <div className=" text-white theme-animated-border rounded-xl p-[2px] mx-2">
                <div
                className=" bg-[#1b1b23] h-full rounded-xl px-4 py-2"
                >
                  Create</div>
                <span></span>
                <span></span>
               </div>
          </Link>
          <Link to="/Explore">
           <div className=" relative mx-2 h-fit w-fit">
           <div className=" text-white animated-bg before:h-[250%] before:w-[200%] rounded-xl p-[2px] ">
                <div
                className=" bg-[#1b1b23] h-full rounded-xl px-4 py-2"
                >
                  Explore</div>
                <span></span>
                <span></span>
               </div>
           </div> 
         
          </Link>
          </div>
    )
  }

  useEffect( () => {
    const loadFeatured = async () =>{ 
    const date = Timestamp.fromDate(new Date())  
    console.log('start',Timestamp.fromDate(new Date()));
    const q = query(collection(db, "assets"), where("end_date", ">=", date ),orderBy('end_date') ,orderBy("favorites", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((document) => {
      if( document.data().start_date <= date)
      {
        console.log('working')
        getDoc(doc(db,'users',document.data().owner_address))
        .then(
          (snap) => {
            setFeatured({...document.data(),user_image:snap.data().user_image})
          }
        )
      }
      console.log(document.id, " => ", document.data());
    });}
    loadFeatured()
  },[])

  return (
    <div className="flex w-full justify-center items-center gradient-bg-body">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-8 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10 max-w-xl ">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Discover, Buy And Sell <br />  Nft across the world
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base mb-5">
            Explore the crypto world. Buy and sell NFT easily on Nify
          </p>
        
          { featuredPanel("mf:hidden inline self-center ") }
          { buttonsPanel("mf:hidden flex self-center mb-5") }
          <HexGridList className=" mt-2">
            <HexGridItem>
            <div className={companyCommonStyles}>
              Reliability
            </div>
            </HexGridItem>
            <HexGridItem>
            <div className={companyCommonStyles}>
              Security
              </div>
            </HexGridItem>
            <HexGridItem>
            <div className={companyCommonStyles}>
              Ethereum
            </div>
            </HexGridItem>
            <HexGridItem>
            <div className={companyCommonStyles}>
              Web 3.0
            </div>
            </HexGridItem>
            <HexGridItem>
            <div className={companyCommonStyles}>
              Low Fees
              </div>
            </HexGridItem>
            <HexGridItem>
            <div className={companyCommonStyles}>
              Blockchain
            </div>
            </HexGridItem>
          </HexGridList>
         
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          {featuredPanel("hidden mf:inline")}
          {/* <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-white font-light text-sm">
                  {user.account_address !== undefined ? truncate(user.account_address) : ''}
                </p>
                <p className="text-white font-semibold text-lg mt-1">
                  Ethereum
                </p>
              </div>
            </div>
          </div> */}
          {buttonsPanel("hidden mf:flex")}
         
          {/* <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <Input placeholder="Address To" name="addressTo" type="text" handleChange={handleChange} />
            <Input placeholder="Amount (ETH)" name="amount" type="number" handleChange={handleChange} />
            <Input placeholder="Keyword (Gif)" name="keyword" type="text" handleChange={handleChange} />
            <Input placeholder="Enter Message" name="message" type="text" handleChange={handleChange} />

            <div className="h-[1px] w-full bg-gray-400 my-2" />

            {isLoading
              ? <Loader />
              : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Send now
                </button>
              )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Welcome;