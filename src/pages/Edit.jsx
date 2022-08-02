import { doc, getDoc } from 'firebase/firestore'
import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Asset, CreateAsset, Footer } from '../components/index'
import { OnboardContext } from '../context/OnboardContext'
import { db } from '../utilS/firebase'

function Edit() {
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
    <div className="min-h-screen ">
    <div className="gradient-bg-welcome">
      <CreateAsset id={asset_id} asset={asset} msg={{mode:"Save",action:"Saving..."}} />
      </div>
    </div>
  )
}

export default Edit