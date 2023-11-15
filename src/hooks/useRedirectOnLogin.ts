"use client";
import { User } from "@/types/User";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useRedirectOnLogin = (user: User | undefined) => {
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.replace('/dashboard');
        }
    }, [user, router]);
};

export default useRedirectOnLogin;