import { doc, getDoc } from 'firebase/firestore'
import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Asset, SellAsset, Footer } from '../components/index'
import { OnboardContext } from '../context/OnboardContext'
import { db } from '../utilS/firebase'

function Sell() {
  const params = useParams()
  const asset_id = params.asset_id
  const [ asset, setAsset ] = useState({})
  const { user } = useContext(OnboardContext);

  const loadAsset = async () => { 
    const docRef = doc(db,"users",user.account_address,'creation', asset_id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
    setAsset(docSnap.data())
    console.log("Document data:", docSnap.data());
    } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    }
  }

  useEffect(() => {
    if(user)
    loadAsset()
  },[user])

  return (
    <div>
    <div className="h-full gradient-bg-welcome">
       <SellAsset id={asset_id} asset={asset} />
    </div>
    <Footer />
    </div>
  )
}

export default Sell