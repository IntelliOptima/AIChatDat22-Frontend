
import { Chatroom } from "@/types/Chatroom";
import { ChatMessage } from "@/types/Message";
import { log } from "console";
import { Dispatch, SetStateAction } from "react";

abstract class FetchData {

  static streamDataAndSetListOfRecords = async <T> (
    url: string,
    setDataRecord: Dispatch<SetStateAction<T[]>>,
  ) => {
    const response = await fetch(url);
    if (!response.body) {
      console.log("response body is NULL - returning from streamDataAndSetListOfObjects")
      return;
    }
  
    const reader = response.body.getReader();
  
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }
  
      const object = new TextDecoder().decode(value);
      const objects = object.split("\n").filter(Boolean);
  
      objects.forEach((line) => {
        try {
          const parsedRecord = JSON.parse(line) as T;
          console.log("PARSED OBJECT:", parsedRecord);
          setDataRecord((prevState: T[]) => [...prevState, parsedRecord]);          
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      });
    }
  };

  static fetchDataAndSetListOfObjects = async <T> (url: string, setDataObject: Dispatch<SetStateAction<T[]>>) => {
    const response = await fetch(url);

    if (!response.ok) {
      console.log("response body is NULL - returning from fetchDataAndSetListofObjects");
      return;
    }

    const data = await response.json();
    console.log("THIS IS DATA: ", data);

    setDataObject(data);
    
  }

  static postFetch = async <T> (url: string, data: T) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Convert data to JSON string
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log("RESPONSE: ", response);
      return await response.json() as T; // Assuming the response is JSON
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for further handling if needed
    }
  };

  static deleteChatroom = async (url: string, chatroomId: string, updateChatroomList: Dispatch<SetStateAction<Chatroom[]>>) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log("RESPONSE: ", response);
  
    
      updateChatroomList((prevChatrooms) => {
        return prevChatrooms ? prevChatrooms.filter(chatroom => chatroom.id !== chatroomId) : [];
      });
  
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for further handling if needed
    }
  };

  static leaveChatroom = async (url: string, chatroomId: string, updateChatroomList: Dispatch<SetStateAction<Chatroom[]>>) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log("RESPONSE: ", response);
  
    
      updateChatroomList((prevChatrooms) => {
        return prevChatrooms ? prevChatrooms.filter(chatroom => chatroom.id !== chatroomId) : [];
      });
  
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for further handling if needed
    }
  };
  

  static postCreateChatroom = async (url: string, setAllChatrooms: Dispatch<SetStateAction<Chatroom[]>>, chatroomName: string) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: chatroomName
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log("RESPONSE: ", response);
 
      const newChatroom = await response.json() as Chatroom;

      setAllChatrooms((prevState) => {
        return prevState ? [...prevState, newChatroom] : [newChatroom];
      });

    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for further handling if needed
    }
  };


  static postAddUserToChatroom = async (url: string, friendEmail: string) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: friendEmail
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log("RESPONSE: ", response);      
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for further handling if needed
    }
  
  }


  
  static streamGPTAnswer = async <T extends ChatMessage> (
    url: string,
    setDataRecord: Dispatch<SetStateAction<T[]>>
  ) => {
    const response = await fetch(url);
    if (!response.body) {
      console.log("response body is NULL - returning from streamData")
      return;
    }
  
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const loopRunner = true;
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
  
      const decodedChunk = decoder.decode(value, { stream: true });
      const parsedRecord = JSON.parse(decodedChunk) as T;
      console.log("PARSED OBJECT:", parsedRecord);
      setDataRecord((prevState) => {
        // If the message is from GPT (userId = 1), append its text to the last GPT message
        if (parsedRecord.userId === 1) {
          let lastMessage = prevState[prevState.length - 1];
          if (lastMessage && lastMessage.userId === 1) {
            return prevState.slice(0, -1).concat({
              ...lastMessage,
              textMessage: lastMessage.textMessage + parsedRecord.textMessage
            });
          }
        }
        return [...prevState, parsedRecord];
      });          
    }
  };
}






export default FetchData;
