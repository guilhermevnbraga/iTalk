"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

interface Data {
    error?: string;
    newFriends?: Array<User>;
}

interface User {
    id: Number;
    name: string;
    username: string;
    email: string;
    password: string;
    profile_picture: string;
    banner: string;
    status: Number;
    about?: string;
}

export default function Chats({ email }: { email: string }) {
    const [data, setData] = useState<Data>({});

    const fetchFriends = async () => {
        const response = await fetch("https://italk-server.vercel.app/friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (response.status === 400) {
            console.log(data);
        }
        setData(data);
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    return (
        <aside className="w-1/4 flex flex-col items-center shadow-[-3px_3px_6px_0px_rgba(0,0,0,0.3)] min-h-full">
            <div className="flex p-2 mt-3 border-2 border-gray-700 rounded-2xl bg-gray-100 h-fit w-11/12">
                <MagnifyingGlassIcon className="h-6 w-6 mr-3" />
                <input
                    type="text"
                    placeholder="Search"
                    className="focus:outline-0 bg-gray-100"
                />
            </div>
            <div className="w-full p-3 mt-6">
                {data.error
                    ? data.error
                    : data.newFriends
                    ? data.newFriends.map((user: User, idx) => {
                          return (
                              <div key={idx} className="flex">
                                  <Link
                                      className="flex mb-6"
                                      href={`/${user.username}/chat`}
                                  >
                                      {user.profile_picture ? (
                                          <Image
                                              src={`data:image/jpeg;base64,${user.profile_picture}`}
                                              alt="perfil"
                                              width={100}
                                              height={100}
                                              className="w-20 h-20 mr-2 rounded-[50%] p-1"
                                          />
                                      ) : (
                                          <UserIcon className="w-20 h-20 mr-3 text-gray-400 border-2 rounded-[50%] p-1"></UserIcon>
                                      )}
                                      <p className="mt-3">{user.name}</p>
                                  </Link>
                              </div>
                          );
                      })
                    : null}
            </div>
        </aside>
    );
}
