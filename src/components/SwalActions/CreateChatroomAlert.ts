import Swal from "sweetalert2";

export const ChatroomCreatorAlert = async () => { 
    let { value: chatroomName } = await Swal.fire({
        title: "Enter Chatroom name",
        input: "text",
        inputLabel: "Your Chatroom name",
        showCancelButton: true,
        inputValidator: (value: string) => {
            if (!value) {
                return "You need to write something!";
            }
        }
    });

    if (chatroomName) {
        Swal.fire({
            icon: 'success',
            title: `Your chatroom has been named - ${chatroomName}`
        });
    }

    return chatroomName;
}