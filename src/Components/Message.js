import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import "./Message.css"
import moment from "moment"

function Message({user, message, recipient, messageId, chatId}) {
    
    const [userLoggedIn] = useAuthState(auth)
    const [isSender, setIsSender] = useState(false);

    const current = moment().unix()
    const active = ((Math.abs(current - recipient)) / 60) < 3 ? true : false
    
    useEffect(() => {
        if(user === userLoggedIn.email) {
            setIsSender(true)
        } else {
            setIsSender(false)
            db.collection("chats").doc(chatId).collection("messages").doc(messageId).set({
                tick: true
            }, {merge: true})
            console.log("hi")
        }
    }, [user, userLoggedIn.email, chatId, messageId])


    return (
        <div className="message">
        {isSender 
        ?
        <div className="message__own">
        <span className="message__main">{message.message}</span>
        <span className="message__timestamp">{message.timestamp ? moment(message.timestamp).format("LT") : "..."}</span> 
        {message.tick ? 
        <div>
        <img style={{width:"20px", height:"20px"}} src="https://cdn-icons-png.flaticon.com/512/5685/5685015.png" alt="" />
        </div>
        : 
        !active 
        ? 
        <div>
        <img style={{width:"20px", height:"20px"}} src="https://cdn-icons-png.flaticon.com/512/447/447147.png" alt="" />
        </div>
        : 
        <div>
        <img style={{width:"20px", height:"20px"}} src="https://cdn-icons-png.flaticon.com/512/2716/2716288.png" alt="" />
        </div>
        }
        </div>
        :
        <div className="message__other">
        <span className="message__main">{message.message}</span>
        <span className="message__timestamp">{message.timestamp ? moment(message.timestamp).format("LT") : "..."}</span> 
        </div>
        }
            
        </div>
    )
}

export default Message
