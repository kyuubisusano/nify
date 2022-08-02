import React from 'react'
import { CreateAsset,Navbar,Footer } from '../components/index.js'
function Create() {
  return (
    <div className="min-h-screen ">
       <div className="gradient-bg-welcome">
      <CreateAsset msg={{mode:"Create",action:"Creating..."}} />
      </div>
      <Footer />
    </div>
  )
}

export default Create