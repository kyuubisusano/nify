import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import { Explore, Home, MarketPlace, Create, Account, Assets, Accounts, Created, Edit, Sell, Settings } from './pages/index.js'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Navbar />
       <Routes>
                <Route exact path= "/" element={<Home/>} />
                <Route path='/:user_id' element={<Accounts/>} />
                <Route path='Market' element={<MarketPlace/>} />
                <Route path='Create' element={<Create/>} />
                <Route path='Explore' element={<Explore/>} />
                <Route path='Assets/:asset_id' element={<Assets />} />
                <Route path='Account' element={<Account/>} />
                <Route path='Created/:asset_id' element={<Created/>} />
                <Route path='Edit/:asset_id' element={<Edit/>} />
                <Route path='Sell/:asset_id' element={<Sell/>} />
                <Route path='Account/Settings' element={<Settings/>} />
        </Routes>
     </Router>
    
  )
}

export default App
