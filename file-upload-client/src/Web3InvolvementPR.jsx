import { useState } from "react"
import { CloseModal } from "./CloseModal"
import TokenTransfer from "./interactor3"
import axios from 'axios';
export const Web3InvolvementPR = ({walletAddress,id,setChange,change}) => {
    const [walletAddressTemp,setWalletAddress] = useState(walletAddress)
    const [bounty,setBounty] = useState("")
   
    return (
        <>
            <TokenTransfer walletAddress= {walletAddressTemp}  id = {id} setChange = {setChange} change = {change}/>
        </>
    )
}