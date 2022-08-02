import { collection, onSnapshot, orderBy, query } from '@firebase/firestore';
import React, { useEffect, useState } from 'react'
import { AssetCard } from '../components/AssetCards.jsx';
import {Footer, AssetGrid, Welcome } from '../components/index.js'
import { db } from '../utilS/firebase.js';
function Explore() {
  const [ nfts, setNfts] = useState([])
  const [ loading,setLoading ] = useState(false)
  useEffect(() => {
    setLoading(true)
    const assetRef = collection(db, "assets")
    const Query= query(assetRef,orderBy("created_at"));
    const unsubscribe = onSnapshot(Query, (postQuerySnapshot) => {
    setNfts([])
    postQuerySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    setNfts(assets => [...assets,{id:doc.id,asset:doc.data()}])
    console.log(nfts);
    });
    setLoading(false)
  });


return () =>unsubscribe()
  },[])  

  return (
    <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <AssetGrid nfts={nfts} loading={loading} Card={AssetCard}/>
    </div>
    <Footer />
  </div>
  )
}

export default Explore