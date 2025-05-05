"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "./ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "./ui/form.tsx"
import { Input } from "./ui/input.tsx"
import { useToast } from "../hooks/use-toast.ts"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "./ui/dialog.tsx"

interface ConfirmBidFormProps {
  productId: string
  currentBid: number
  productName: string
}

const bidFormSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Bid amount must be a positive number",
  }),
})

type BidFormValues = z.infer<typeof bidFormSchema>

export function ConfirmBidForm({ productId, currentBid, productName }: ConfirmBidFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [bidAmount, setBidAmount] = useState(0)

  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidFormSchema),
    defaultValues: {
      amount: (currentBid + 10).toString(), // Default to current bid + $10
    },
  })

  function onSubmit(data: BidFormValues) {
    const bidAmount = Number(data.amount)

    if (bidAmount <= currentBid) {
      form.setError("amount", {
        type: "manual",
        message: `Your bid must be higher than the current bid ($${currentBid})`,
      })
      return
    }

    // Show confirmation dialog instead of submitting immediately
    setBidAmount(bidAmount)
    setShowConfirmDialog(true)
  }

  function confirmBid() {
    setIsSubmitting(true)
    setShowConfirmDialog(false)

    // Simulate API call
    setTimeout(() => {
      console.log({ productId, bidAmount })

      toast(`
        title: "Bid placed successfully!",
        description: You've placed a bid of $${bidAmount} on this item. `)

      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <div className="pointer-events-none flex h-10 w-8 items-center justify-center rounded-l-md border border-r-0 bg-muted text-sm">
                      $
                    </div>
                    <Input {...field} type="number" min={currentBid + 1} step="1" className="rounded-l-none" />
                  </div>
                </FormControl>
                <FormDescription>Your bid must be at least ${currentBid + 1}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Placing Bid..." : "Place Bid"}
          </Button>
        </form>
      </Form>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Your Bid</DialogTitle>
            <DialogDescription>
              You are about to place a bid on {productName}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-lg font-semibold">
              Bid Amount: <span className="text-green-600">${bidAmount}</span>
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              This action cannot be undone, and you will be committing to pay this amount if you win the auction.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmBid} 
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm Bid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}