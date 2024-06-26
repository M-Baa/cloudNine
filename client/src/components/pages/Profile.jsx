import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, ref, getStorage, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { v4 as uuidv4 } from 'uuid';
import Header from '../Header';

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut
} from '../../redux/user/userSlice'

export default function Profile() {
  const fileRef = useRef(null)
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [image, setImage] = useState(undefined)
  const [imagePercent, setImagePercent] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const dispatch = useDispatch()

  console.log(formData);



  useEffect(() => {
    if (image) {
      handleFileUpload(image)
    }
  }, [image])
  const handleFileUpload = async (image) => {
    const storage = getStorage(app)
    const fileName = uuidv4();
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, image)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImagePercent(Math.round(progress))
      },

      (error) => {
        setImageError(true)
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) => {
            setFormData({ ...formData, profile_picture: downloadURL })
          })
      }
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`http://localhost:8000/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data))
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error))
    }
  }

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`http://localhost:8000/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure())
        return
      }
      dispatch(deleteUserSuccess())
    } catch (error) {
      dispatch(deleteUserFailure(error))
    }
  }


  const handleSignout = async () => {
    try {
      await fetch('http://localhost:8000/api/auth/signout')
      dispatch(signOut())
    } catch (error) {
      console.log(error);
    }
  }

  return (

    <div >
      <Header /> <br />
      <br />
      <br />
      <br />
      <div className='p-3 max-w-lg mx-auto profile-card '>







        <h1 className=''>Welcom to {currentUser.username}</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

          <input
            type="file"
            ref={fileRef}
            onChange={(e) => setImage(e.target.files[0])} />
          <img src={formData.profile_picture || currentUser.profile_picture} onClick={() => fileRef.current.click()} />
          <p >{imageError ? (
            <span className='text-red-700'>
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-700'>Image uploaded successfully</span>
          ) : (
            ''
          )}
          </p>

          <input
            defaultValue={currentUser.username}
            type="text"
            id='username'
            placeholder='Username'
            className=''
            onChange={handleChange} />

          <input
            defaultValue={currentUser.email}
            type="text"
            id='email'
            placeholder='Email'
            className=''
            onChange={handleChange} />

          <input
            type="text"
            id='password'
            placeholder='Password'
            className=''
            onChange={handleChange} />

          <button
            className='buttom'>
            {loading ? 'LOADING' : 'UPDATE'}
          </button>
        </form>

        <div className='flex justify-between mt-5'>
          <span onClick={handleDeleteAccount} className='text-red-700 cursor-pointer'>Delete Account</span>
          <span onClick={handleSignout} className='text-red-700 cursor-pointer'>Sign Out</span>
        </div>
        <p className='text-red'>{error && 'Something went wrong!'}</p>
        <p className='text-green'>{updateSuccess && 'User is updated successfully!'}</p>

      </div></div>
  )
}

