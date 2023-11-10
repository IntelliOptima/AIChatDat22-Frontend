import { Chatroom } from "@/types/Chatroom";
import { Dispatch, SetStateAction } from "react";

abstract class FetchData {

  static streamDataAndSetListOfObjects = async <T> (
    url: string,
    setDataObject: Dispatch<SetStateAction<T[]>>,
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
          const parsedObject = JSON.parse(line) as T;
          console.log("PARSED OBJECT:", parsedObject);
          setDataObject((prevState: T[]) => [...prevState, parsedObject]);          
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      });
    }
  };

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
}

export default FetchData;

