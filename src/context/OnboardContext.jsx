import React, { useEffect, useState } from "react"
import Onboard from '@web3-onboard/core'
import injectedModule , { ProviderLabel } from '@web3-onboard/injected-wallets'
import { init, useConnectWallet, useSetChain, useWallets } from "@web3-onboard/react"
import { db } from '../utilS/firebase'
import { setDoc, collection, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore'

export const OnboardContext = React.createContext()


const injected = injectedModule({
  filter: {
    [ProviderLabel.Opera]: false  //doesn't show opera wallet (namespace problem with metamask)
  }
})
const onboard = init({
  wallets: [injected],
  chains: [
    {
      id: '0x3',
      token: 'tROP',
      label: 'Ethereum Ropsten Testnet',
      rpcUrl: "https://ropsten.infura.io/v3/32ab07c7ca4c4ef0bf401c8ee5619d0c"
    },
  ],
  accountCenter: {
    desktop: {
      enabled: false,  //annoying ui
    },
    mobile: {
      enabled: false,
    }
  },
  appMetadata: {
    name: 'nify',
    icon: "https://preview.redd.it/htevxof0uzn31.jpg?width=4096&format=pjpg&auto=webp&s=b1b05335f0182a38e1e9ff603477d548df9d1bbd",
    logo: "https://preview.redd.it/htevxof0uzn31.jpg?width=4096&format=pjpg&auto=webp&s=b1b05335f0182a38e1e9ff603477d548df9d1bbd",
    description: 'Nify is a NFT Marketplace',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
    ],
  },
})


export const OnboardProvider = ({ children }) => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const [user, setUser] = useState({})
  const connectedWallets = useWallets()

  const checkIfWalletIsConnect = async () => {
    try {
      const previouslyConnectedWallets = await JSON.parse(
        window.localStorage.getItem('connectedWallets')
      )
  
      if (previouslyConnectedWallets) {
        console.log("prev wallet loaded" ,previouslyConnectedWallets[0] )
        await onboard.connectWallet({
          autoSelect: { label: previouslyConnectedWallets[0], disableModals: true }
        })

      }
      const currentState = onboard.state.get()
      console.log("initial onboard state :",currentState);
      console.log("conn walls ",connectedWallets)
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      await connect()
      console.log("wallet connected")
      // console.log(wallet)
      // console.log("chain ",connectedChain)
      const currentState = onboard.state.get()
      console.log("onboard state after connect :",currentState);
    } catch (error) {
      console.log(error);
      throw new Error("Error connecting wallet");
    }
  };
  const disconnectWallet  = async  (wallet) => {
    try{
      await disconnect(wallet)
      setUser({})
      console.log("wallet disconnected")
    }catch (error)
     {
      console.log(error)
     }
  }

  // useEffect( () => {
  //   if (!wallet?.provider) {
  //     provider = null
  //   } else {
  //   // After this is set you can use the provider to sign or transact 
  //   console.log("chain ",connectedChain)
  //   if(connectedChain.id==='0x1')
  //   setChain({ chainId: '0x3' })
  //   provider = new ethers.providers.Web3Provider(wallet.provider, 'any')
  //   }
  // },[wallet])

  const addDataUserDatatoFirebase  = async (account) => {
    const docRef = doc(db, "users", account.address);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUser(docSnap.data())
      console.log("Document data:", docSnap.data());
      return
    }
    await setDoc(docRef, {
      user_name: '',
      account_address: account.address,
      email: '',
      user_image: '',
      user_cover: '',
      created_at: serverTimestamp(),
      asset_favorited: 0,
      asset_created: 0,
      asset_collected: 0,
      bio:''
    });
  }
  const updateUserData  = async (address,data) => {
  try { await updateDoc( doc(db, "users", address),data).then( async () => {
      const docRef = doc(db, "users",address);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data())
        console.log("Document data:", docSnap.data());
        return
      }
    })}
    catch(error) {
      console.log(error);
    }
  }

  useEffect( () =>{
    if (wallet?.provider) {
      console.log("before check : chain ",connectedChain)
      console.log(wallet)
      if(connectedChain.id==='0x1')
      setChain({ chainId: '0x3' })
      console.log("after check chain ",connectedChain)
      const walletsSub = onboard.state.select('wallets')
      const unsubscribe  = walletsSub.subscribe(wallets => {
        const connectedWallets = wallets.map(({ label }) => label)
        window.localStorage.setItem(
          'connectedWallets',
          JSON.stringify(connectedWallets)
        )
      })
    addDataUserDatatoFirebase(wallet.accounts[0])  
    return () => unsubscribe
  }
   return 
  },[wallet])

  useEffect(() => {
      checkIfWalletIsConnect();
    }, [])

  //   useEffect(async () => {
  //     if(wallet){
  //       const docRef = doc(db, "users",wallet.accounts[0]);
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) 
  //     onSnapshot(doc(db, "users", wallet.accounts[0]), (doc) => {
  //     setUser(doc.data())
  //   });
  // }
    
  //   },[wallet])

  return (
    <OnboardContext.Provider
      value={{
        connectWallet,
        disconnectWallet,
        connectedWallets,
        wallet,
        connecting,
        user,
        updateUserData,
      }}
    >
      {children}
    </OnboardContext.Provider>
  )
}