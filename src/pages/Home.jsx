import React from 'react'
import { Navbar,Footer,Welcome } from '../components/index.js'

function Home() {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Welcome />
      </div>
      <Footer />
    </div>
  )
}

export default Home