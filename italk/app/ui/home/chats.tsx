"use client";

import { UserIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface User {
    id: Number;
    name: string;
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    banner: string;
    status: Number;
    about?: string;
}

interface Message {
    id: number;
    content: string;
    senderName: string;
}

export default function Chats({
    email,
    username,
}: {
    email: string;
    username: string;
}) {
    const [lastMessages, setLastMessages] = useState<Message[]>([]);
    const [friends, setFriends] = useState<User[]>([]);

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
        } else {
            setFriends(data.friends);
            data.friends.forEach(async (friend: User) => {
                console.log(username, friend.username)
                const response = await fetch(
                    "https://italk-server.vercel.app/lastMessage",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            senderName: username,
                            receiverName: friend.username,
                        }),
                    }
                );

                const data = await response.json();

                setLastMessages((lastMessages) => [
                    ...lastMessages,
                    {
                        id: data.id,
                        content: data.content,
                        senderName: data.senderName,
                    },
                ]);

                if (response.status === 400) {
                    console.log("Last Message Error");
                    console.log(response);
                }
            });
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    return (
        <div className="p-6">
            {friends
                ? friends.map((user: User, idx: number) => {
                      console.log(lastMessages);
                      return (
                          <div
                              key={idx}
                              className={`flex ${
                                  idx === friends.length - 1 ? "" : "mb-6"
                              }`}
                          >
                              <Link
                                  className="flex"
                                  href={`/${user.username}/chat`}
                              >
                                  {user.profilePicture ? (
                                      <Image
                                          src={`data:image/jpeg;base64,${user.profilePicture}`}
                                          alt="perfil"
                                          width={100}
                                          height={100}
                                          className="w-20 h-20 mr-2 rounded-[50%] p-1"
                                      />
                                  ) : (
                                      <UserIcon className="w-20 h-20 mr-3 text-gray-400 border-2 rounded-[50%] p-1"></UserIcon>
                                  )}
                                  <div className="h-full flex flex-col justify-between">
                                      <span className="mt-3">{user.name}</span>
                                      <span className="mb-3 text-gray-500 font-medium">
                                          {lastMessages.length >= idx + 1
                                              ? lastMessages[idx].id
                                                  ? `${lastMessages[idx].senderName}: ${lastMessages[idx].content}`
                                                  : ""
                                              : null}
                                      </span>
                                  </div>
                              </Link>
                          </div>
                      );
                  })
                : null}
        </div>
    );
}
