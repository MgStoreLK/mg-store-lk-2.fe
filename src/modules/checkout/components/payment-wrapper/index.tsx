"use client"

import { Cart, PaymentSession } from "@medusajs/medusa"
import React from "react"

type WrapperProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
  children: React.ReactNode
}

const Wrapper: React.FC<WrapperProps> = ({ cart, children }) => {
  return <div>{children}</div>
}

export default Wrapper
