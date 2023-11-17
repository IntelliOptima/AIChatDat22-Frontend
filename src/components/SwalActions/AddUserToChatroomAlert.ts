import Swal from "sweetalert2";

export const AddUserToChatroom = async () => { 
    let { value: friendEmail } = await Swal.fire({
        title: "Enter your friends email address",
        input: "email",
        inputLabel: "Your Friends email",
        showCancelButton: true,
        inputValidator: (value: string) => {
            if (!value) {
                return "Must enter email to add new friend!";
            }
        }
    });

    const checkEmailSyntax = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    if (friendEmail && checkEmailSyntax(friendEmail)) {
        Swal.fire({
            icon: 'success',
            title: `Your friend has been added - GO CHAT!`
        });

        return friendEmail;
    } else {
        Swal.fire({
            icon: 'error',
            title: `Friend email does not exist!`
        });
    }

}