import React, { useState, useEffect } from 'react'
import AddressItem from './AddressItem'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store/store'
import { Link, useNavigate } from 'react-router-dom'
import { getAllAddresses } from '@/api/api_function'

import AddressModal from './modals/addressModal'
import { set } from 'react-hook-form'

interface IAddress {
  _id: string;
  customerId: string;
  receiverFirstName: string;
  receiverLastName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverWard: string;
  receiverDistrict: string;
  receiverCity: string;
  isDefault: boolean;
}

const Address = () => {
    const dispatch = useDispatch()
    const currentUser = useSelector((state: RootState) => state.auth.currentUser)
    const userId = useSelector((state: RootState) => state.auth.id)
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [addresses, setAddresses] = useState<IAddress[]>([])
    const [reload, setReload] = useState(false)

    const handleReload = () => {
        setReload(!reload)
    }

    useEffect(() => {
        if (currentUser) {
            getAllAddresses(userId, currentUser)
            .then((res) => {
                const addr= res.data.data
                // console.log("adr", addr)
                setAddresses(addr)
                // console.log("address", addresses)
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }, [currentUser, reload])

    const handleAddADdress = () => {
        if (!currentUser)
            navigate('signin')
        setOpen(true)
    }

    return (
        <>
        <AddressModal open={open} setOpen={setOpen} handleReload={handleReload}/>
        <div className="pl-[5rem] border-l-2 mt-10 flex justify-start"> 
            <div className="w-[48rem] max-[512px]:w-full">
            <h1 className='flex justify-center text-2xl font-bold text-gray-700'>Danh sách địa chỉ</h1>
            <button 
                onClick={() => handleAddADdress()}
                className={`px-3 py-1 text-white bg-secondary-1 border rounded-sm border-secondary-1
                hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50
                `}>
                    Thêm địa chỉ
            </button>
            {/* Form */}    
            {addresses.map((address) => (
                <AddressItem key={address._id} address={address} handleReload={handleReload} />
            ))}
            </div>
        </div>
        </>
    )
}

export default Address