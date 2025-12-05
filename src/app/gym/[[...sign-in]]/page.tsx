"use client"

import {useState} from "react"

import { usePathname } from "next/navigation"

import SlugInForm from "./sign-in-form"
import { ClientPage } from "@/sections/client-page"

export default function SlugClient() {
  const pathname = usePathname()
  const fullUrl = typeof window !== "undefined" ? window.location.href : "";
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      {/* <p>pathname: {pathname}</p>
      <p>full url: {fullUrl}</p> */}
      {!isLoggedIn && <ClientPage />}
      {isLoggedIn && <SlugInForm />}
    </div>
  )
}