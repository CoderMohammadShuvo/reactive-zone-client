"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Printer, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  reset,
  setCardAmount,
  setCardName,
  setCash,
  setChangeAmount,
  setDiscount,
  setMfsAmount,
  setMfsName,
  setReceivedAmount,
  setTotalRecievable,
} from "@/store/slices/salesSlice"
import { SalePrintLog } from "@/components/ui/SalePrintLog"
import { SaleReturnPrint } from "@/components/ui/SaleReturnPrint"
import { createOrder } from "@/lib/utils"

export function InfoCard() {
  const dispatch = useDispatch()
  const [activate, setActive] = useState(false)
  const [savedData, setSavedData] = useState(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const posData = useSelector((state) => state.sales)

  useEffect(() => {
    dispatch(setTotalRecievable(posData?.total))
  }, [posData?.total, dispatch])

  useEffect(() => {
    const totalReceived =
      Number.parseFloat(posData?.paidAmount?.cash || 0) +
      Number.parseFloat(posData?.paidAmount?.card?.amount || 0) +
      Number.parseFloat(posData?.paidAmount?.mfs?.amount || 0)

    const changeAmount =
      totalReceived +
      (posData?.discount ? Number.parseFloat(posData.discount) : 0) -
      (posData?.totalRecievable ? Number.parseFloat(posData.totalRecievable) : 0)

    dispatch(setReceivedAmount(totalReceived))
    dispatch(setChangeAmount(changeAmount))
  }, [posData.paidAmount, posData.discount, posData.totalRecievable, dispatch])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const order = await createOrder(posData)
      if (order) {
        setActive(true)
        setSavedData(order)
        dispatch(reset())
        localStorage.removeItem("sales_cart")
        setAlertOpen(false)
        toast.success("Order Creation Success :)")
      } else {
        if (!posData.userId) {
          toast.error("Please Select Customer")
        } else {
          toast.error("Order Creation Failed :(")
        }
      }
    } catch (error) {
      console.error(error)
      toast.error("Error creating order")
    }
  }

  return (
    <>
      <div className="w-full flex justify-between border-b pb-4 font-bold">
        <p>Finalize Order</p>
      </div>

      <div className="space-y-4 mt-4">
        <div className="flex justify-between">
          <p className="font-medium">Total Item:</p>
          <p>{posData?.totalItem}</p>
        </div>

        <div className="flex justify-between">
          <p className="font-medium">Return Product Total:</p>
          <p>{posData?.returnCalculation?.total} BDT</p>
        </div>

        <div className="flex justify-between">
          <p className="font-medium">Total:</p>
          <p>{posData?.total} BDT</p>
        </div>

        <div className="flex justify-between">
          <p className="font-medium">Vat/Tax Amount:</p>
          <p>{posData?.vat} BDT</p>
        </div>

        <div className="flex justify-between">
          <p className="font-medium">Gross Total:</p>
          <p>{posData?.grossTotal} BDT</p>
        </div>

        <div className="flex justify-between">
          <p className="font-medium">Gross Total(Round):</p>
          <p>{posData?.grossTotalRound} BDT</p>
        </div>

        <div className="flex justify-between items-center">
          <p className="font-medium">Cash Received:</p>
          <Input type="text" className="w-1/3" placeholder="0" onChange={(e) => dispatch(setCash(e.target.value))} />
        </div>

        <div className="flex justify-between items-center">
          <p className="font-medium">Card:</p>
          <Select onValueChange={(value) => dispatch(setCardName(value))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Visa" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="visa">Visa</SelectItem>
                <SelectItem value="dbbl">DBBL</SelectItem>
                <SelectItem value="mtb">MTB</SelectItem>
                <SelectItem value="city">City</SelectItem>
                <SelectItem value="amex">Amex</SelectItem>
                <SelectItem value="ebl">EBL</SelectItem>
                <SelectItem value="brac">Brac</SelectItem>
                <SelectItem value="masterCard">Master Card</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input className="w-1/3" placeholder="0" onChange={(e) => dispatch(setCardAmount(e.target.value))} />
        </div>

        <div className="flex justify-between items-center">
          <p className="font-medium">MFS:</p>
          <Select onValueChange={(value) => dispatch(setMfsName(value))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Bkash" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="bkash">Bkash</SelectItem>
                <SelectItem value="nagad">Nagad</SelectItem>
                <SelectItem value="upay">Upay</SelectItem>
                <SelectItem value="rocket">Rocket</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input className="w-1/3" placeholder="0" onChange={(e) => dispatch(setMfsAmount(e.target.value))} />
        </div>

        <div className="flex justify-between items-center">
          <p className="font-medium">Discount:</p>
          <Input
            type="number"
            className="w-1/3"
            placeholder="0"
            onChange={(e) => dispatch(setDiscount(e.target.value))}
          />
        </div>

        <div className="flex justify-between">
          <p className="font-medium">Total Received:</p>
          <p>{posData?.totalRecieved} BDT</p>
        </div>

        <div className="flex justify-between">
          <p className="font-medium">Change Amount:</p>
          <p>{posData?.changeAmount} BDT</p>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex justify-center gap-4">
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <Button onClick={() => dispatch(reset())}>
            <RotateCcw size={18} className="mr-2" /> Reset
          </Button>
          <AlertDialogTrigger asChild>
            <Button>
              <Printer size={18} className="mr-2" /> Generate Order
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure to proceed with the Order?</AlertDialogTitle>
              <AlertDialogDescription>Please confirm to process the order.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onSubmit}>
                <Printer size={18} className="mr-2" /> Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {savedData?.returnActive ? (
        <SaleReturnPrint open={activate} setOpen={setActive} entry={savedData} />
      ) : (
        <SalePrintLog open={activate} setOpen={setActive} entry={savedData} />
      )}

      <Toaster />
    </>
  )
}

