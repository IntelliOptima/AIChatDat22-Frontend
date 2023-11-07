import React, { useState } from 'react'
import { DisplayMessages } from './DisplayMessages';

type ChatProps = {
    main: () => void;
}
const Chat = ({ main }: ChatProps) => {
    const [textForMessage, setTextForMessage] = useState<string>("");

    const sendMessage = async () => {
        await main();
        setTextForMessage("");
    };

    return (
        <div>
            <div className='flex flex-col'>

                <div className='flex justify-center'>
                    <div className='border border-gray-200 w-3/4 h-[500px] p-2 rounded-lg shadow-md text-black mt-6 mr-6 mb-4 bg-white p-6'>
                        Display Messages
                    </div>
                </div>

                <div className='flex justify-center'>
                    <input
                        type="text"
                        placeholder="Write a message..."
                        value={textForMessage}
                        onChange={(e) => setTextForMessage(e.target.value)}
                        className="border border-gray-400 w-3/4 p-2 rounded-lg shadow-md text-black mr-6 bg-white"
                    />
                    {textForMessage != "" && <button className='text-black font-semibold hover:scale-110' onClick={sendMessage}>Send</button>}
                </div>

            </div>
        </div>
    )
}

export default Chat