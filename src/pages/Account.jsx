import React, { useContext, useEffect, useState } from 'react'
import { Profile, Footer } from '../components/index.js'
import { OnboardContext } from '../context/OnboardContext.jsx';
import { collection, getDocs, doc, getDoc } from '@firebase/firestore';
import { db } from '../utilS/firebase';

function Account() {
  const { user } = useContext(OnboardContext);
  const [ created, setCreated ] = useState([])
  const [ collected,setCollected ] = useState([])
  const [ favorited,setFavorited ] = useState([])
  const [ loadingCreated,setLoadingCreated ] = useState(false)
  const [ loadingCollected,setLoadingCollected ] = useState(false)
  const [ loadingFavorited,setLoadingFavorited ] = useState(false)
  const [ countCreated, setCountCreated ] = useState(0)
  const [ countCollected, setCountCollected ] = useState(0)
  const [ countFavorited, setCountFavorited ] = useState(0)

  const loadCreated = async () => {
    setLoadingCreated(true)
    const querySnapshot = await  getDocs(collection(db, "users",user.account_address,'creation'))
    setCountCreated(querySnapshot.docs.length)
    // console.log(querySnapshot.docs)
    if(querySnapshot.docs.length === 0)
    setLoadingCreated(false)
    querySnapshot.forEach(async (document) => {
        // doc.data() is never undefined for query doc snapshots
        setCreated(assets => [...assets,{id:document.id,asset:document.data()}])
         console.log("Document data:", document.data());
        // const docRef = doc(db, "assets", document.id);
        // const docSnap = await getDoc(docRef);
        
        // if (docSnap.exists()) {
        // const data = docSnap.data()  
        // setCreated(assets => [...assets,{id:docSnap.id,asset:data}])
        // console.log("Document data:", docSnap.data());
        // console.log(created.length)
        // } else {
        // // doc.data() will be undefined in this case
        // console.log("No such document!");
        // }
        // console.log(document.id, " => ", document.data());
    })
    // setLoadingCreated(false)
  }
  const loadCollected = async () => {
    setLoadingCollected(true)
    console.log('doc.id, " => ", doc.data()');
    const querySnapshot = await  getDocs(collection(db, "users",user.account_address,'collection'))
    setCountCollected(querySnapshot.docs.length)
    if(querySnapshot.docs.length === 0)
     setLoadingCollected(false)
    // console.log(querySnapshot.docs.length)
    querySnapshot.forEach(async (document) => {
      setCollected(assets => [...assets,{id:document.id,asset:document.data()}])
      console.log("Document data:", document.data());
    }
    )
    // setLoadingCollected(fFavorited
  }

  const loadFavorited = async () => {
    setLoadingFavorited(true)
    console.log('doc.id, " => ", doc.data()');
    const querySnapshot = await  getDocs(collection(db, "users",user.account_address,'favorited'))
    setCountFavorited(querySnapshot.docs.length)
    if(querySnapshot.docs.length === 0)
     setLoadingFavorited(false)
    // console.log(querySnapshot.docs.length)
    querySnapshot.forEach(async (document) => {
        const docRef = doc(db, "assets", document.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFavorited(assets => [...assets,{id:docSnap.id,asset:docSnap.data()}]).then(
          )
          console.log("Document data:", docSnap.data());
        } else {
          console.log("No such document!");
        }
    }
    )
    // setLoadingCollected(false);
  }
  useEffect( () => {
    if(countCreated === created.length) 
    setLoadingCreated(false)
  },[created,countCreated])

  useEffect( () => {
    if(countCollected === collected.length)
    setLoadingCollected(false)
  },[collected,countCollected])

  
  useEffect( () => {
    if(countFavorited === favorited.length)
    setLoadingFavorited(false)
  },[favorited,countFavorited])

  useEffect(() => {
    if(!user) return
    loadCreated()
    loadCollected()
    loadFavorited()
  },[user])

  return (
    <div className="min-h-screen ">
    <div className="gradient-bg-welcome">
   <Profile 
   user={user} 
   created={created} 
   collected={collected} 
   favorited={favorited}
   loadingCollected={loadingCollected} 
   loadingCreated={loadingCreated}
   loadingFavorited={loadingFavorited}
   countCreated={countCreated}
   countCollected={countCollected}
   countFavorited={countFavorited}/>
   </div>
   <Footer />
 </div>
  )
}

export default Account