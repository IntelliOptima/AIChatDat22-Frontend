import Logger from "@/shared/logger";
import { Chatroom } from "@/types/Chatroom";
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
}

export default FetchData;

