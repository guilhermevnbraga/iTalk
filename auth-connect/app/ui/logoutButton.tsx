'use client'

import { signOut } from "next-auth/react"

export default function LogoutButton() {
    return (
        <button className="border-solid border-2 rounded-xl hover:bg-gray-700 hover:text-white p-3 border-gray-700 m-9" onClick={() => signOut()}>Logout</button>
    )
}
