import { Dispatch, SetStateAction } from "react";

abstract class FetchData {

  static streamDataAndSetListOfObjects = async <T extends any[]>(
    url: string,
    setDataObject: Dispatch<SetStateAction<T>>
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
  
      const message = new TextDecoder().decode(value);
      const messages = message.split("\n").filter(Boolean);
  
      messages.forEach((line) => {
        try {
          const parsedObject = JSON.parse(line);
          console.log("Parsed Message:", parsedObject as T);
          setDataObject((prevState) => [...prevState, parsedObject]);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      });
    }
  };

  static postFetch = async () => {

  } 

}

export default FetchData;

