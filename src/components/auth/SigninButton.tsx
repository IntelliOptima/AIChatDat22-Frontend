"use client";
import { useUser } from "@/contexts/UserContext";
import useRedirectOnLogin from "@/hooks/useRedirectOnLogin";
import useUpdateUser from "@/hooks/useUpdateUser";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

const SigninButton = () => {
  const { data: session } = useSession();
  const { user } = useUser();

  useRedirectOnLogin(user);
  useUpdateUser(session);

  if (!session || !session.user) {
    return (
      <button onClick={() => signIn()} className="text-green-600 ml-auto">
        Sign In
      </button>
    );
  }

  return (
    <div className="flex gap-4 ml-auto items-center">
      <Image src={`${session.user.image}`} alt="User Image" className="rounded-full" width={32} height={32} />
      <p>{user?.fullName}</p>
      <button onClick={() => signOut()} className="text-red-600">
        Sign Out
      </button>
    </div>
  );
};

export default SigninButton;