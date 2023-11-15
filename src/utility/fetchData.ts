import Logger from "@/shared/logger";
import { Chatroom } from "@/types/Chatroom";
import { ChatMessage } from "@/types/Message";
import { log } from "console";
import { Dispatch, SetStateAction } from "react";

export const fetchChatMessages = async (chatRoomID: string): Promise<ChatMessage[] | undefined> => {


    const url = `http://localhost:8080/api/v1/message/findByChatroomId=${chatRoomID}`;
    const response = await fetch(url);

    if (!response.ok) {
      Logger.info("response not ok");
      return undefined;
    }

    const data = await response.json();
    console.log("data: ", data);

    return data;
}

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
      Logger.info("response body is NULL - returning from fetchDataAndSetListofObjects");
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

  static postCreateChatroom = async (url: string, setCurrentChatroom: Dispatch<SetStateAction<Chatroom | undefined>>) => {
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
      setCurrentChatroom(await response.json() as Chatroom);
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for further handling if needed
    }
  };


  
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
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
  
      const object = new TextDecoder().decode(value);
      const objects = object.split("\n").filter(Boolean);

      objects.forEach((line) => {
        try {
          const parsedRecord = JSON.parse(line) as T;
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
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      });
    }
  };
}






export default FetchData;

