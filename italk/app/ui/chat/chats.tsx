"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { UserIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Data {
    error?: string;
    friends?: Array<User>;
}

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

export default function Chats({ email }: { email: string }) {
    const router = useRouter();
    const [data, setData] = useState<Data>({});
    const [search, setSearch] = useState("");
    const [hiddenChevron, setHiddenChrevron] = useState<boolean[]>([]);

    const fetchFriends = async () => {
        const response = await fetch("https://italk-server.vercel.app//friends", {
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

        data.friends?.forEach((friend, idx) => {
            if (hiddenChevron.length <= idx) {
                setHiddenChrevron((hiddenChevron) => [...hiddenChevron, true]);
            }
        });
    }, []);

    return (
        <aside className="w-1/4 flex flex-col items-center shadow-[-3px_3px_6px_0px_rgba(0,0,0,0.3)] min-h-full">
            <div className="mt-4 text-xl font-medium">Chats</div>
            <div className="flex p-2 mt-3 border-2 border-gray-700 rounded-2xl bg-gray-100 h-fit w-11/12">
                <MagnifyingGlassIcon className="h-6 w-6 mr-3" />
                <input
                    type="text"
                    placeholder="Search"
                    className="focus:outline-0 bg-gray-100"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="w-full p-3 mt-6">
                {data.error
                    ? data.error
                    : data.friends
                    ? data.friends.map((user: User, idx) => {
                          if (!user.name.toLowerCase().includes(search))
                              return null;
                          return (
                              <div
                                  key={idx}
                                  className="flex hover:bg-gray-200 shadow-[0_1px_1px_0_rgba(0,0,0,0.2)]"
                                  onMouseOut={() => {
                                      hiddenChevron[idx] = true;
                                      console.log(hiddenChevron[idx]);
                                      router.refresh();
                                  }}
                                  onMouseOver={() => {
                                      hiddenChevron[idx] = false;
                                      console.log(hiddenChevron[idx]);
                                      router.refresh();
                                  }}
                              >
                                  <Link
                                      className="flex my-3 w-full"
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
                                      <div className="flex grow justify-between mt-3 px-1">
                                          <span>{user.name}</span>
                                          <button
                                              className={`hover:scale-110 text-gray-400 w-6 h-6 ${
                                                  hiddenChevron[idx]
                                                      ? "hidden"
                                                      : ""
                                              }`}
                                          >
                                              <ChevronDownIcon></ChevronDownIcon>
                                          </button>
                                      </div>
                                  </Link>
                              </div>
                          );
                      })
                    : null}
            </div>
        </aside>
    );
}
