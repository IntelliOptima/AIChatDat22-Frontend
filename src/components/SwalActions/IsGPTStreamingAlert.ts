import Swal from "sweetalert2";

export const isGPTStreamingAlert = () => {
  Swal.fire({
    icon: "error",
    title: "Wait for GPT to finish answering!",
  });
};
