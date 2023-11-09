import { Dispatch, SetStateAction } from "react";

abstract class FetchData {

  static streamDataAndSetListOfObjects = async <T> (
    url: string,
    setDataObject: Dispatch<SetStateAction<T[]>>
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
          const parsedObject = JSON.parse(line) as T;
          console.log("Parsed Message:", parsedObject);
          setDataObject((prevState: T[]) => [...prevState, parsedObject]);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      });
    }
  };

  static postFetch = async (url: string, data: Object) => {
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
      const responseData = await response.json(); // Assuming the response is JSON
      return responseData;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for further handling if needed
    }
  };

}

export default FetchData;
