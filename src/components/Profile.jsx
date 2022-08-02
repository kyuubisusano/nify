import { Tab } from '@headlessui/react';
import moment from 'moment';
import React, { useContext,useEffect,useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { AssetGrid} from '.';
import truncate from '../utilS/truncate';
import { AssetCard, AssetCardCreated } from './AssetCards';

function ProfilePlaceholder () {

  return (
    <div className=' flex flex-col  p-5 w-full min-h-screen'>
    <div className=' sm:h-[300px] md:h-[410px] lg:h-[430px] bg-[#1b1b23] rounded-md my-5 overflow-hidden min-w-[300px]'>
  
    <div className=" animate-pulse h-[100px] sm:h-[200px] md:h-[300px] w-full bg-[#322e3d]   " > </div>
    <div className={' animate-pulse text-white ml-[40px] mt-[40px] mb-[5px] text-xl font-bold' +
     ' sm:ml-[80px] sm:mt-[50px] md:text-2xl sm:mb-0 '+
     '  md:ml-[100px] md:mt-[40px] md:text-2xl md-mb-0 ' +
     ' lg:ml-[120px] lg:mt-[60px] lg:text-2xl lg:mb-0 '}>
     
           <div className=' rounded-lg w-[100px] h-[15px] bg-[#322e3d]' />
           <div className=' mt-2 rounded-lg w-[100px] h-[10px] bg-[#322e3d]' />
    </div>
    </div>
    <div className='  '>
            
    <div 
    className={" z-0  absolute rounded-full ring-4 ring-[#1b1b23] bg-[#1b1b23] h-[90px] w-[90px] left-[50px] top-[170px] " +
         " sm:left-[80px] sm:top-[250px] sm:h-[120px] sm:w-[120px] " +
         " md:left-[90px] md:top-[300px] md:h-[150px] md:w-[150px] " + 
         " lg:left-[100px] lg:top-[300px] lg:h-[170px] lg:w-[170px]  "} />
    <div 
    className={" z-[1] animate-pulse absolute rounded-full ring-4 ring-[#1b1b23] bg-[#322e3d]  h-[90px] w-[90px] left-[50px] top-[170px] " +
         " sm:left-[80px] sm:top-[250px] sm:h-[120px] sm:w-[120px] " +
         " md:left-[90px] md:top-[300px] md:h-[150px] md:w-[150px] " + 
         " lg:left-[100px] lg:top-[300px] lg:h-[170px] lg:w-[170px]  "} />
    </div>
    
    
    <div className="w-full py-16 sm:px-0 ">
  <Tab.Group  >
    <Tab.List className=" text-white flex flex-row mx-auto sm:mx-auto sm:self-center md:ml-[100px] mt-2 p-5 min-w-[300px] sm:w-96 justify-evenly items-center rounded-xl bg-[#1b1b23]">
    <Tab className={({ selected }) => classNames(
              ' animate-pulse px-4 p-2 rounded-xl w-[5rem] h-10 flex items-center focus:ring-0',
            'bg-gradient-to-tr from-[#382339]'
            )} 
         onClick={() => setSearchParams({tab: 'collected'})}   
          ></Tab>
    <Tab className={({ selected }) => classNames(
              // 'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
              ' animate-pulse px-4 p-2 ml-2 sm:ml-5 rounded-xl w-[5rem] h-10  flex items-center ',
              'bg-gradient-to-tr from-[#2f2339]'
            )}
         onClick={() => setSearchParams({tab: 'created'})}    
         ></Tab>
    <Tab className={({ selected }) => classNames(
              // 'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
              ' animate-pulse px-4 p-2 ml-2 sm:ml-5 rounded-xl w-[5rem] h-10 flex items-center ',
            'bg-gradient-to-tr from-[#282339]'
            )}
         onClick={() => setSearchParams({tab: 'favorited'})}    
         ></Tab>     
          
    </Tab.List>

  </Tab.Group>
</div>

</div>
  )
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function NothingHere(msg,button='Explore',link='/Explore') {
   return( 
   <div className=' text-white text-5xl m-5 theme-gradient-border rounded-md min-h-[90vh]  items-center'> 

    <div className='bg-[#22222c] rounded-md h-[90vh] flex-col items-center justify-center p-2  flex space-y-5'>
      <p className=' p-2 '>{msg}</p>
      <a href={link}>
      <div className=' theme-animated-border rounded-sm'>
          <div className=' bg-[#22222c] p-5 rounded-sm '>
            <p className=' text-white '>{button}</p>
          </div>
          <span></span>
          <span></span>
      </div>
      </a>
    </div>
  
  </div>
   )
}

function Profile({user,created,collected,favorited,loadingCollected,loadingCreated,loadingFavorited,countCreated,countCollected,countFavorited}) {
  const [ searchParams, setSearchParams ] = useSearchParams()
  const tabIndex = { collected: 0, created: 1, favorited: 2 } 
  useEffect( () => { 
    console.log(searchParams.getAll('tab'),tabIndex[searchParams.getAll('tab')])
  }, [searchParams])

  const renderCreated = () => {
    if(loadingCreated === false && countCreated === 0 )
    return NothingHere('You haven\'t create anything, \n go create some amazing art ','Create','/Create')

    return  <AssetGrid nfts={created} loading={loadingCreated} Card={AssetCardCreated}/> 
  }

  const renderCollected = () => {
    // console.log(loadingCollected,countCollected)
    if(loadingCollected === false && countCollected === 0 )
    return NothingHere('No favorites found, \n Browse through our collection ')

    return   <AssetGrid nfts={collected} loading={loadingCollected} Card={AssetCard}/> 
  }

  const renderFavorited = () => {
    if(loadingFavorited === false && countFavorited === 0 )
    return NothingHere('No favorites found, \n Browse through our collection ')

    return  <AssetGrid nfts={favorited} loading={loadingFavorited} Card={AssetCard}/> 
  }
  if(user === null || user === undefined || user.user_name === undefined)
   return <ProfilePlaceholder />
  return (
    <div className=' flex flex-col  p-5 w-full min-h-screen'>
        <div className='sm:h-[300px] md:h-[410px] lg:h-[430px] bg-[#1b1b23] rounded-md my-5 overflow-hidden min-w-[300px]'>
        <img className="h-[100px] sm:h-[200px] md:h-[300px] w-full bg-[#1b1b23]  object-cover" src={user.user_cover} alt={user.user_name}/>
        <div className={' text-white ml-[40px] mt-[40px] mb-[5px] text-xl font-bold' +
         ' sm:ml-[80px] sm:mt-[50px] md:text-2xl sm:mb-0 '+
         '  md:ml-[100px] md:mt-[40px] md:text-2xl md-mb-0 ' +
         ' lg:ml-[120px] lg:mt-[60px] lg:text-2xl lg:mb-0 '}>
            <p>{user.user_name ? user.user_name : "Unnamed"}</p>
            <div className='flex space-x-2'>
              <p className=' text-sm font-normal '>{user.account_address ? truncate(user.account_address) : "0x00..."}</p>
              <p className=' text-sm text-gray-500 font-normal'>Joined {
              moment(user.created_at.toDate()).format('MMMM YYYY').toString()}</p> 
            </div>
        </div>
        </div>
        <div className='  '>
        { user.user_image ? <img 
        className={" object-cover absolute rounded-full ring-4 ring-[#1b1b23] bg-[#1b1b23] h-[90px] w-[90px] left-[50px] top-[170px] " +
             " sm:left-[80px] sm:top-[250px] sm:h-[120px] sm:w-[120px] " +
             " md:left-[90px] md:top-[300px] md:h-[150px] md:w-[150px] " + 
             " lg:left-[100px] lg:top-[300px] lg:h-[170px] lg:w-[170px]  "} src={user.user_image} alt={user.user_name}/> :
         <div
             className={" object-cover absolute rounded-full ring-4 ring-[#1b1b23] bg-[#22222c] h-[90px] w-[90px] left-[50px] top-[170px] " +
             " sm:left-[80px] sm:top-[250px] sm:h-[120px] sm:w-[120px] " +
             " md:left-[90px] md:top-[300px] md:h-[150px] md:w-[150px] " + 
             " lg:left-[100px] lg:top-[300px] lg:h-[170px] lg:w-[170px]  "} />
        }
        </div>
        
        
        <div className="w-full py-16 sm:px-0 ">
      <Tab.Group defaultIndex={tabIndex[searchParams.getAll('tab')]} >
        <Tab.List className="text-white flex flex-row mx-0 sm:mx-auto sm:self-center md:ml-[100px] mt-2 p-5 min-w-[300px] sm:w-96 justify-evenly items-center rounded-xl bg-[#1b1b23]">
        <Tab className={({ selected }) => classNames(
                  'px-4 p-2 rounded-xl flex items-center focus:ring-0',
                  selected
                    ? 'shadow-[0_30px_10px_-15px_rgba(145,63,124,0.8)] bg-[#382339]'
                    : 'bg-gradient-to-tr from-[#382339]'
                )} 
             onClick={() => setSearchParams({tab: 'collected'})}   
              >Collected</Tab>
        <Tab className={({ selected }) => classNames(
                  // 'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                  'px-4 p-2 ml-2 sm:ml-5 rounded-xl  flex items-center ',
                  selected
                    ? 'shadow-[0_30px_10px_-15px_#63477a] bg-[#2f2339] '
                    : 'bg-gradient-to-tr from-[#2f2339]'
                )}
             onClick={() => setSearchParams({tab: 'created'})}    
             >Created</Tab>
        <Tab className={({ selected }) => classNames(
                  // 'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                  'px-4 p-2 ml-2 sm:ml-5 rounded-xl  flex items-center ',
                  selected
                    ? 'shadow-[0_30px_10px_-15px_#615292] bg-[#282339] '
                    : 'bg-gradient-to-tr from-[#282339]'
                )}
             onClick={() => setSearchParams({tab: 'favorited'})}    
             >Favorited</Tab>     
              
        </Tab.List>
        <Tab.Panels className="mt-2 flex min-w-96">
          <Tab.Panel className={classNames(
                'rounded-xl bg-[#22222c] p-3 w-full  my-[2rem]',
              )} >
                {renderCollected()}
                </Tab.Panel>
          <Tab.Panel className={classNames(
                'rounded-xl bg-[#22222c] p-3 w-full  my-[2rem]',
              )} > 
            { renderCreated() }   
                      
                </Tab.Panel>
          <Tab.Panel className={classNames(
                'rounded-xl bg-[#22222c] p-3 w-full  my-[2rem]',
              )} > 
            { renderFavorited() }   
                      
                </Tab.Panel>     
        </Tab.Panels>
      </Tab.Group>
    </div>
    </div>
  )
}

export default Profile