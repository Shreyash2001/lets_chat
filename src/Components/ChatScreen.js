import { Avatar, Button, IconButton } from '@material-ui/core'
import React, { useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { auth, db } from '../firebase'
import "./ChatScreen.css"
import Message from './Message'
import firebase from "firebase"
import getRecipientEmail from '../utils/getRecipientEmail'
import TimeAgo from "timeago-react"

function ChatScreen({props: {props}, id}) {
    const endOfMessageref = useRef(null);
    const [input, setInput] = useState("");
    const [user] = useAuthState(auth)
    const [messageSnapShot] = useCollection(db.collection("chats").doc(id).collection("messages").orderBy("timestamp", "asc"))

    const getUsers = props?.chat?.users
    const [recipientSnapShot] = useCollection(db.collection("users").where("email", "==", getUsers ? getRecipientEmail(getUsers, user) : ""))
    const recipient = recipientSnapShot?.docs?.[0]?.data()

    
    const showMessages = () => {
        
        if(messageSnapShot) {
            return messageSnapShot.docs.map((message) => (
                <Message 
                    key={message.id}
                    messageId={message.id}
                    chatId={id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime()
                    }}
                    recipient={recipient?.lastSeen?.seconds}
                />
            ))
        } else {
            return props?.messages?.map(message => (
                <Message 
                    key={message.id}
                    messageId={message.id}
                    chatId={id}
                    user={message.user}
                    message={message.message}
                    timestamp={message.timestamp}
                    recipient={recipient?.lastSeen?.seconds}
            />
            ))
            
        }

    }

    const scrollToBottom = () => {
        endOfMessageref.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    }
    

    const sendMessage = () => {
        db.collection("users").doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }, {merge: true})

        db.collection("chats").doc(id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoUrl: user.photoURL,
            tick: false
        })
        // scrollToBottom()
        setInput("")
    }

    const recipientEmail = getRecipientEmail(props?.chat?.users, user)
    return (
        <div className="chatScreen">
            <div className="chatScreen__header">
                <div>
                    {recipient ? 
                        (
                            <Avatar src = {recipient.photoURL} />
                        )
                            :
                            (
                                recipientEmail && <Avatar>{recipientEmail[0]}</Avatar>
                            )
                    }
                    
                    <div>
                    <p style={{marginBottom:"3px"}}>{recipientEmail}</p>
                    {recipientSnapShot ? (
                        <p style={{fontSize:"10px", marginTop:"0px"}}>Last active: {" "} {recipient?.lastSeen?.toDate() ? (
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                        ) :
                        ("unavailable")
                        }</p>
                    )
                    :
                    (
                        <p>Loading...</p>
                    )
                    }
                    
                    </div>
                </div>

                <div>
            <Button onClick={() => auth.signOut()} style={{
                backgroundColor:"#cb2d3e", 
                color:"#fff", 
                width:"40px", 
                textTransform:"inherit"
                }}>Logout</Button>
            </div>

            </div>

            <div className="chatScreen__messages">
                {showMessages()}
                {/* <div ref={endOfMessageref} /> */}
            </div>

            <div className="chatScreen__input">
                <div>
                    <input value={input} type="text" placeholder="Type a message" onChange={(e) => setInput(e.target.value)} />
                </div>
                <IconButton style={{backgroundColor:"purple"}} onClick={() => sendMessage()}>
                    <img style={{width:"30px", height:"30px"}} src="https://res.cloudinary.com/cqn/image/upload/v1632635272/pinpng.com-submit-button-png-1914812_lmeoz1.png" alt="send" />
                </IconButton>
            </div>

        </div>
    )
}

export default ChatScreen
