import Swal from "sweetalert2";

export const ChatroomDeleteAlert = async (chatroomName: string) => { 
    let { value: verifyChatroomName } = await Swal.fire({
        title: "Confirm deletion of Chatroom",
        input: "text",
        inputLabel: `write the chatroom name to confirm deletion: ${chatroomName}`,
        showCancelButton: true,
        inputValidator: (value: string) => {
            if (value !== chatroomName) {
                return "Must enter name correct name for Chatroom!";
            }
        }
    });

    if (verifyChatroomName) {
        Swal.fire({
            icon: 'success',
            title: `The chatroom ${chatroomName} has been removed `
        });
    }

    return chatroomName;
}