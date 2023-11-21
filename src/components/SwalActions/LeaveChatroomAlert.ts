import Swal from "sweetalert2";

export const LeaveChatroomAlert = async () => { 
    await Swal.fire({
        title: "Are you sure you want to leave?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, leave!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "You left the chatroom!",
            icon: "success"
          });
        }
      });

}