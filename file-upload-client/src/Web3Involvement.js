import { useState } from "react"
import { CloseModal } from "./CloseModal"
import TokenTransfer from "./interactor"
import axios from 'axios';
export const Web3Involvement = ({id,setChange,change}) => {
    const [walletAddress,setWalletAddress] = useState("")
    const [bounty,setBounty] = useState("")
    const closeHandler = async(id,text) => {
        try{
            // write this api in tokentransfer
            let data = await axios.post("http://localhost:5000/issues/pay",{id,text} ,{
                headers: {
                    "Content-Type": "application/json"
            }
            })
            setChange(!change)
            setWalletAddress(data.data.walletAddress)
            setBounty(data.data.bounty)
        }
        catch(err){
            console.log(err)
        }
    }
    return (
        <>
            <CloseModal closeHandler = {closeHandler} id = {id} walletAddress= {walletAddress} />
            <TokenTransfer walletAddress= {walletAddress} bounty = {bounty} id = {id} setChange = {setChange} change = {change}/>
        </>
    )
}