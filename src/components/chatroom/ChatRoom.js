import { useState, useEffect } from 'react';

import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore'

import ChatMessage from './ChatMessage';

const ChatRoom = (props) => {
  const [messages, setMessages] = useState([])
  const getMessages = async () => {
    let m = []
    const c = await getDocs(collection(props.db, "messages"));
    c.forEach((doc) => {
      m.push({
        id: doc.id,
        ...doc.data()
      })
    })
    setMessages(m)
  }

  // Initial load
  useEffect(() => {
    getMessages()

    // Initialize the update listener
    const q = query(collection(props.db, "messages"), where("text", "!=", ""));
    onSnapshot(q, (querySnapshot) => {
      let m = [];
      querySnapshot.forEach((doc) => {
        m.push({
          id: doc.id,
          ...doc.data()
        })
      })
  
      setMessages(m)
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    </div>
  )
}

export default ChatRoom