import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { db } from '../firebase';
import "./ChatContainer.css"
import ChatScreen from './ChatScreen';

function ChatContainer() {

    const {chatId} = useParams();
    const [chatData, setChatData] = useState({})
    useEffect(() => {
        if(chatId) {
            // db.collection("chats").doc(chatId).onSnapshot((snapShot) => setRecipientHeader(snapShot.data()))
            async function getData() {
                const data = await getMessages(chatId)
                setChatData(data)
            }
            getData()
        }
    }, [chatId])

     async function getMessages(id) {
        const ref = db.collection("chats").doc(id)

        const messagesRes = await ref.collection("messages").orderBy("timestamp", "asc").get()

        const messages = messagesRes.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })).map(messages => ({
            ...messages,
            timestamp: messages.timestamp.toDate().getTime()
        }))

        const chatRes = await ref.get()
        const chat = {
            id: chatRes.id,
            ...chatRes.data()
        }
        return {
            props: {
                messages: messages,
                chat: chat
            }
        }
    }
    
    return (
        <div className="chatcontainer">
            <ChatScreen props={chatData} id={chatId} />
        </div>
    )
}

export default ChatContainer
