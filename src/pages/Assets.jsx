import { doc, getDoc } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Asset, Footer } from '../components/index'
import { db } from '../utilS/firebase'
function Assets() {
  const params = useParams()
  const asset_id = params.asset_id
  const [ asset, setAsset ] = useState({})

  const loadAsset = async () => { 
    const docRef = doc(db, "assets", asset_id)
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
    loadAsset()
  },[])

  return (
    <div>
      {<Asset asset={asset} owner={null}/>}
      <Footer />
    </div>
  )
}

export default Assets