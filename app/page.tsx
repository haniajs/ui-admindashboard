//import React from 'react'
//import AdminLogin from './admin/page'

//const page = () => {
//  return (
//    <div>
//      <AdminLogin/>
//    </div>
//  )
//}

//export default page

"use client"

import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const MyComponent = () => {
  const {user} = useUser()
  const router = useRouter()

  if(user && user.primaryEmailAddress?.emailAddress === "haniairshad959@gmail.com"){
    router.push("/admin/dashboard")
  }


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <h1>Admin Login</h1>
      <SignedOut>
        <SignInButton>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Login With Clerk</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Sign Out With Clerk</button>
        </SignOutButton>
      </SignedIn>
    </div>
  )
}

export default MyComponent;