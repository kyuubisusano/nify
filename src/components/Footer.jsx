import React from "react";
const Footer = () => (
  <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
    <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4 ">
      <div className="flex flex-[0.5] justify-center items-center">
        {/* <img src={logo} alt="logo" className="w-32" /> */}
        <div className=" text-white p-2 bg-gradient-to-r from-slate-800 rounded-full">Contact</div>
      </div>
      <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full text-white">
      <a href="https://github.com/kyuubisusano" target="_blank" > <p>Github</p> </a>
           <a href="https://www.linkedin.com/in/abhishek-bisht-5b9079190/" target="_blank" > <p>Linkedin</p> </a>
           <a href="mailto:abhishekbisht354@gmail.com" > <p>Mail</p> </a>
        </div>
      
    </div>
    <div className="flex flex-1 justify-between items-center my-4 sm:mt-0 mt-5 w-full">
          </div>
    
    <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5 " />

    <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
      <p className="text-white text-left text-xs">@Nify2022</p>
      <p className="text-white text-right text-xs">All rights reserved</p>
    </div>
  </div>
);

export default Footer;