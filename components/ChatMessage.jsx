import React from 'react'

const ChatMessage = (message) => {
  return (
    <div className = "chatMessage">
        <p><b>{message.user}</b></p>
        <p>{message.text}</p> 
    </div>
  )
}

export default ChatMessage