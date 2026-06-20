import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { ToastContainer } from 'react-toastify'

import Home from './pages/Home/Home'
import Login from './pages/Login/Login'

import Player from './pages/Player/Player'

import { auth } from './firebase'

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
       {
      setUser(currentUser)
      setLoading(false)

      if (currentUser) {
        console.log("Logged In")
      } else {
        console.log("Logged Out")
      }
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    )
  }

  return (
    <div>
      <ToastContainer theme='dark' />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/player/:id' element={<Player />} />
      </Routes>
    </div>
  )
}

export default App