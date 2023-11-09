import {Dispatch, SetStateAction} from "react";

export const fetchDataStream = async <T extends any[]>(url: string, setDataObject: Dispatch<SetStateAction<T>>) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/ndjson',
        'Content-Type': 'application/ndjson',
      },
      credentials: 'include', // only if necessary
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    // Assuming the response is NDJSON
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      try {
        let result = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
  
          result += decoder.decode(value, { stream: true });
  
          // Process the lines
          const lines = result.split('\n');
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (line) {
              try {
                const json = JSON.parse(line);
                setDataObject((prevData) => [...prevData, json as T[number]]); // update state with the new json object
              } catch (e) {
                console.error('Error parsing JSON:', e);
              }
            }
          }
  
          // Keep the last incomplete line if any
          result = lines[lines.length - 1];
        }
  
        // Process any remaining text
        if (result.trim()) {
          try {
            const json = JSON.parse(result);
            setDataObject((prevData) => [...prevData, json as T[number]]); // update state with the new json object
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      } finally {
        reader.releaseLock();
      }
    }
  };
  
  
  


export const fetchDataSSE = <T> (url: string, setDataObject:  Dispatch<SetStateAction<T>>) => {
    const eventSource = new EventSource(url, {
        withCredentials: true,
    });

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("FETCHED DATA: ", data);
        setDataObject(data as T);
    };

    eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
    };
}
