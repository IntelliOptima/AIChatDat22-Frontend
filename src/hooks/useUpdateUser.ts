"use client";
import { useUser } from "@/contexts/UserContext";
import FetchData from "@/utility/fetchData";
import type { User } from "@/types/User";
import { useEffect } from "react";

const useUpdateUser = (session: any) => {
    const { setUser } = useUser();

    useEffect(() => {
        let isMounted = true;

        const updateUser = async () => {
            if (session && isMounted) {
                const sessionUser: User = {
                    email: session.user!.email!.toString(),
                    fullName: session.user!.name!.toString(),
                    profileImage: session.user!.image!.toString(),
                };

                try {
                    const user = await FetchData.postFetch(`${process.env.NEXT_PUBLIC_FETCH_USER}`, sessionUser)
                    console.log(process.env.NEXT_PUBLIC_FETCH_USER)
                    console.log('User updated:', user);
                    setUser(user);
                } catch (error) {
                    console.error('Error updating user:', error);
                }
            }
        };

        updateUser();

        return () => {
            isMounted = false;
        };
    }, [session, setUser]);
};

export default useUpdateUser;