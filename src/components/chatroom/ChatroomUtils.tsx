import { Dispatch, SetStateAction, useEffect } from "react";
import type { Chatroom } from "@/types/Chatroom";
import FetchData from "@/utility/fetchData";
import { User } from "@/types/User";
import { RSocket } from "rsocket-core";
import { getRSocketConnection } from "../Rsocket/RSocketConnector";
import { ChatMessage } from "@/types/Message";
import { rsocketRequestStream } from "../Rsocket/RSocketRequests/RSocketRequestStream";
import { AddUserToChatroom } from "../SwalActions/AddUserToChatroomAlert";
import { rsocketGptRequestStream } from "../Rsocket/RSocketRequests/RSocketGPTRequestStream";

type setUpChatroomProps = {
  allChatrooms: Chatroom[];
  user: User | undefined;
  currentChatroom: Chatroom | undefined;
  setCurrentChatroom: Dispatch<SetStateAction<Chatroom | undefined>>;
  setAllChatrooms: Dispatch<SetStateAction<Chatroom[]>>;
  rsocket: RSocket | null;
  setRSocket: Dispatch<SetStateAction<RSocket | null>>;
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  hasMounted: React.MutableRefObject<boolean>;
  setIsGptStreaming: Dispatch<SetStateAction<boolean>>;
}

export const useSetupChatroom = (
  {
    allChatrooms,
    user,
    currentChatroom,
    setAllChatrooms,
    setCurrentChatroom,
    rsocket,
    setRSocket,
    setChatMessages,
    hasMounted,
    setIsGptStreaming,
  }: setUpChatroomProps

) => {


  useEffect(() => {
    if (allChatrooms.length === 0) {
      FetchData.fetchDataAndSetListOfObjects(
        `${process.env.NEXT_PUBLIC_FETCH_ALL_CHATROOMS}${user?.id}`,
        setAllChatrooms
      );
    }

    if (localStorage.getItem('currentChatroom')) {
      setCurrentChatroom(JSON.parse(localStorage.getItem('currentChatroom')!));
    }

  }, [allChatrooms.length, user]);


  useEffect(() => {
    if (allChatrooms.length > 0) {
      if (currentChatroom === undefined) {
        setCurrentChatroom(allChatrooms[0]);
      }
      FetchData.fetchDataAndSetListOfObjects(
        `${process.env.NEXT_PUBLIC_FETCH_MESSAGES}${currentChatroom?.id !== undefined ? currentChatroom?.id : allChatrooms[0].id}`,
        setChatMessages
      );
    }
  }, [currentChatroom?.id, allChatrooms.length]);


  useEffect(() => {
    const connectToRSocket = async () => {
      try {
        const connection = await getRSocketConnection();
        setRSocket(connection);
        hasMounted.current = true;
      } catch (error) {
        console.error("Failed to establish RSocket connection:", error);
      }
    };

    if (!rsocket && !hasMounted.current) {
      connectToRSocket();
    }

    if (rsocket && currentChatroom?.id !== undefined) {
      rsocketGptRequestStream(
        rsocket,
        `chat.stream.${currentChatroom.id}`,
        setChatMessages,
        setIsGptStreaming,
      );
    }

  }, [rsocket, currentChatroom?.id]);

}


export const handleAddUserToChatroom = async (currentChatroom: Chatroom | undefined) => {
  const friendEmail = await AddUserToChatroom();
  if (friendEmail) {
    FetchData.postAddUserToChatroom(`${process.env.NEXT_PUBLIC_ADD_FRIEND_TO_CHATROOM}${currentChatroom?.id}`, friendEmail);
  }
}