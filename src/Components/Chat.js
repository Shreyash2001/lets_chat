import { Avatar } from '@material-ui/core'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { auth, db } from '../firebase'
import  getRecipientEmail  from '../utils/getRecipientEmail'
import "./Chat.css"
import {useHistory} from "react-router-dom"
import moment from "moment"

function Chat({id, users}) {
    const history = useHistory()
    const [user] = useAuthState(auth)
    const userRef = db.collection("users").where("email", "==", getRecipientEmail(users, user))
    const [recipientSnapShot] = useCollection(userRef)

    const recipient = recipientSnapShot?.docs?.[0]?.data()
    const userCurrent = recipient?.lastSeen?.seconds
    const current = moment().unix()
    const active = ((Math.abs(current - userCurrent)) / 60) < 3 ? true : false

    const recipientEmail = getRecipientEmail(users, user)
    return (
        <div onClick={() => history.push(`/chat/${id}`)} className="chat">
        {recipient ? 
        (
            <div style={{display:"flex", alignItems:"center"}}>
            <Avatar src = {recipient.photoURL} />
            {active && <div className="active" 
                        style={{
                            width:"10px", 
                            height:"10px", 
                            backgroundColor:"rgb(56, 209, 56)",
                            borderRadius:"50%",
                            marginTop:"20px",
                            marginLeft:"-10px",
                            zIndex:"1"
                            }} />}
            </div>
        )
            :
            (
            <>
            <Avatar>{recipientEmail[0]}</Avatar>
            
            </>
            )
        }
            
            <p>{recipientEmail}</p>
            </div>
    )
}

export default Chat
