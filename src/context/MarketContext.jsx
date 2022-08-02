import React, { createContext } from 'react'
import NftMarket from '../artifacts/contracts/NftMarket.sol/NftMarket.json'


export const MarketPlaceContext = createContext()  

    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const router = useRouter()
  
    async function onChange(e) {
      const file = e.target.files[0]
      try {
        const added = await client.add(
          file,
          {
            progress: (prog) => console.log(`received: ${prog}`)
          }
        )
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        setFileUrl(url)
      } catch (error) {
        console.log('Error uploading file: ', error)
      }  
    }
    async function uploadToIPFS() {
      const { name, description, price } = formInput
      if (!name || !description || !price || !fileUrl) return
      /* first, upload to IPFS */
      const data = JSON.stringify({
        name, description, image: fileUrl
      })
      try {
        const added = await client.add(data)
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        /* after file is uploaded to IPFS, return the URL to use it in the transaction */
        return url
      } catch (error) {
        console.log('Error uploading file: ', error)
      }  
    }
  
    async function listNFTForSale() {
      const url = await uploadToIPFS()
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
  
      /* next, create the item */
      const price = ethers.utils.parseUnits(formInput.price, 'ether')
      let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
      let listingPrice = await contract.getListingPrice()
      listingPrice = listingPrice.toString()
      let transaction = await contract.createToken(url, price, { value: listingPrice })
      await transaction.wait()
     
      router.push('/')
    }


export const  MarketProvider = ({ children }) => {

 
  return (
    <MarketContext.provider>
        {children}
    </MarketContext.provider>
  )
}
