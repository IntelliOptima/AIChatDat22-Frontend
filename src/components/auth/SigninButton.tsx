"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import React, { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import FetchData  from '@/utility/FetchData';
import { fetchData } from 'next-auth/client/_utils';
import type { User } from '@/types/User';

const SigninButton = () => {
    const { data: session } = useSession();
    const { setUser } = useUser();
    const router = useRouter();


    useEffect(() => {
      const updateUser = async () => {
        if (session) {
          const sessionUser: User = {
            email: session.user!.email!.toString(),
            fullName: session.user!.name!.toString(),
            profileImage: session.user!.image!.toString().toString(),
          };
  
          try {
            const user = await FetchData.postFetch('http://localhost:8080/api/v1/user', sessionUser);
            console.log("Returned USER: ", user);
            setUser(user);
            router.replace('/dashboard');
          } catch (error) {
            console.error('Error updating user:', error);
          }
        }
      };
  
      updateUser();
    }, [session, setUser, router]);
    
  
    if (session && session.user) {        
      return (
        <div className="flex gap-4 ml-auto items-center">
          <Image
            src={`${session.user.image}`}
            alt="Vercel Logo"
            className="rounded-full"
            width={32}
            height={32}
          />
          <p className="text-sky-600">{session.user.name}</p>
          <button onClick={() => signOut()} className="text-red-600">
            Sign Out
          </button>
        </div>
      );
    } else {
        router.replace('/');
    }


  
    return (
      <div>
        <button
          onClick={() =>
                signIn()
          }
          className="text-green-600 ml-auto"
        >
          Sign In
        </button>
      </div>
    );
  };
  
  export default SigninButton;