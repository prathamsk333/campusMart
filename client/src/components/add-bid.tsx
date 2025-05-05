"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useToast } from "../hooks/use-toast"

interface AddBidProps {
  lastBid: number
  auctionEnded: boolean
  onAddBid: (amount: number) => void
}

export function AddBid({ lastBid, auctionEnded, onAddBid }: AddBidProps) {
  const { toast } = useToast()
  const [amount, setAmount] = useState<number | ''>('')
  const [showInput, setShowInput] = useState(false)

  const handleAddBid = () => {
    if (amount === '' || amount <= lastBid) {
      toast(`{
        title: "Invalid Bid",
        description: Your bid must be higher than the last bid ($${lastBid}).,
      }`)
      return
    }

    onAddBid(amount as number)
    setAmount('')
    setShowInput(false)
    toast(`{
      title: "Bid Added",
      description: You've added a bid of $${amount}.,
    }`)
  }

  if (auctionEnded) {
    return null
  }

  return (
    <div>
      <Button onClick={() => setShowInput(!showInput)}>
        {showInput ? "Cancel" : "Add Bid"}
      </Button>
      {showInput && (
        <div className="mt-2">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Enter your bid amount"
          />
          <Button onClick={handleAddBid} className="mt-2">
            Confirm Bid
          </Button>
        </div>
      )}
    </div>
  )
}