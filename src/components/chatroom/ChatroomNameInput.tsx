import React from 'react'

type ChatroomNameInputProps = {
    setNewChatroomName: React.Dispatch<React.SetStateAction<string>>,
    handleCreateChatroom: (e: React.FormEvent<HTMLFormElement>) => void
}

const ChatroomNameInput = ({ setNewChatroomName, handleCreateChatroom}: ChatroomNameInputProps) => {
  return (
    <div>
        <form onSubmit={handleCreateChatroom}>
        <input onChange={(e) => setNewChatroomName(e.target.value)} type='text' placeholder='Chatroom Name' />
        <button type='submit'>Create</button>
        </form>
    
    </div>
  )
}

export default ChatroomNameInput