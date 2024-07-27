"use client";

import { useState, useEffect, useRef } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Posts from "../home/posts";
import Image from "next/image";

interface HeaderProps {
    user: User;
    acessUser: string | null | undefined;
}

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
    profile_picture: string;
    banner: string;
    status: Number;
    about?: string;
}

export default function Option({ user, acessUser }: HeaderProps) {
    const [option, setOption] = useState<number>(0);
    const [data, setData] = useState<Data>({});
    const [content, setContent] = useState<string>("");
    const [aboutEditMode, setAboutEditMode] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [npassword, setNPassword] = useState<string>("");
    const [cpassword, setCPassword] = useState<string>("");
    const [profilePicture, setProfilePicture] = useState<File | undefined>(
        undefined
    );
    const [banner, setBanner] = useState<File | undefined>(undefined);
    const [passwordError, setPasswordError] = useState<string>("");
    const [confirmPasswordError, setConfirmPasswordError] =
        useState<string>("");
    const [credentialError, setCredentialError] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const profilePictureRef = useRef<HTMLInputElement>(null);
    const bannerRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, []);

    const fetchFriends = async () => {
        const response = await fetch("http://localhost:3001/friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email }),
        });

        const data = await response.json();
        if (response.status === 400) {
            console.log(data);
        } else {
            console.log(data);
        }
        setData(data);
    };

    const handleAboutSubmit = async () => {
        const response = await fetch("http://localhost:3001/about", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email, about: content }),
        });

        const data = await response.json();
        if (response.status === 400) {
            console.log(data);
        } else {
            console.log(data);
        }
        setAboutEditMode(false);
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        formData.append("email", user.email);
        formData.append(
            "name",
            `${firstName ? firstName.trim() : user.name.split(" ")[0]} ${
                lastName ? lastName.trim() : user.name.split(" ")[1]
            }`
        );
        formData.append("username", username);
        formData.append("password", password);
        formData.append("npassword", npassword);
        formData.append("cpassword", cpassword);

        if (profilePicture) {
            formData.append("profilePicture", profilePicture);
        }

        if (banner) {
            formData.append("banner", banner);
        }

        const response = await fetch("http://localhost:3001/updateProfile", {
            method: "POST",
            body: formData,
        });

        console.log(formData);
        const data = await response.json();
        if (response.status === 400) {
            setCredentialError(data.error);
        } else {
            console.log(data);
        }
    };

    return (
        <>
            <div className="flex flex-row justify-around w-full p-6">
                <button
                    className={`hover:text-blue-600 active:scale-95 font-medium text-lg ${
                        option === 0
                            ? "underline underline-offset-4 decoration-2 decoration-blue-600"
                            : ""
                    }`}
                    onClick={() => {
                        setOption(0);
                    }}
                >
                    Posts
                </button>
                <button
                    className={`hover:text-blue-600 active:scale-95 font-medium text-lg ${
                        option === 1
                            ? "underline underline-offset-4 decoration-2 decoration-blue-600"
                            : ""
                    }`}
                    onClick={() => {
                        fetchFriends();
                        setOption(1);
                    }}
                >
                    Friends
                </button>
                <button
                    className={`hover:text-blue-600 active:scale-95 font-medium text-lg ${
                        option === 2
                            ? "underline underline-offset-4 decoration-2 decoration-blue-600"
                            : ""
                    }`}
                    onClick={() => setOption(2)}
                >
                    About
                </button>
                {user.name === acessUser ? (
                    <button
                        className={`hover:text-blue-600 active:scale-95 font-medium text-lg ${
                            option === 3
                                ? "underline underline-offset-4 decoration-2 decoration-blue-600"
                                : ""
                        }`}
                        onClick={() => setOption(3)}
                    >
                        Account
                    </button>
                ) : null}
            </div>
            <div className={`px-6 ${option === 0 ? "" : " hidden"}`}>
                <Posts username={user.name || undefined}></Posts>
            </div>
            <div className={`p-6 ${option === 1 ? "" : " hidden"}`}>
                {data.error
                    ? data.error
                    : data.friends
                    ? data.friends.map((user: User, idx) => {
                          return (
                              <Link
                                  key={idx}
                                  className="flex mb-6 items-center"
                                  href={`/${user.username}`}
                              >
                                  {user.profile_picture ? (
                                      <Image
                                          src={`data:image/jpeg;base64,${user.profile_picture}`}
                                          alt="perfil"
                                          className="w-6 h-6 mr-2 rounded-[50%] p-1"
                                      />
                                  ) : (
                                      <UserIcon className="w-12 h-12 mr-3 text-gray-400 border-2 rounded-2xl"></UserIcon>
                                  )}
                                  <p>{user.name}</p>
                              </Link>
                          );
                      })
                    : null}
            </div>
            <div
                className={`p-6 ${
                    option === 2 ? "" : " hidden"
                } grow flex flex-col`}
            >
                <form onSubmit={handleAboutSubmit} className="grow">
                    <textarea
                        className="rounded-2xl bg-gray-300 p-3 w-full focus:outline-0 resize-none text-gray-500 min-h-[40vh]"
                        ref={textareaRef}
                        placeholder="Nothing to see here..."
                        onChange={(e) => {
                            e.target.style.height = "40vh";
                            e.target.style.height =
                                e.target.scrollHeight + "px";
                            setContent(e.target.value);
                        }}
                        disabled={aboutEditMode ? false : true}
                    >
                        {user.about ? user.about : ""}
                    </textarea>
                    {user.name === acessUser ? (
                        <>
                            <div
                                className={`w-full flex justify-end ${
                                    aboutEditMode ? "hidden" : ""
                                }`}
                            >
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setAboutEditMode(true);
                                    }}
                                    className="px-6 py-0.5 bg-blue-400 rounded-md"
                                >
                                    Edit
                                </button>
                            </div>
                            <div
                                className={`w-full flex justify-end ${
                                    aboutEditMode ? "" : "hidden"
                                }`}
                            >
                                <button
                                    type="submit"
                                    onClick={(e) => e.preventDefault()}
                                    className="px-3 py-0.5 bg-green-400 rounded-md mr-3"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setAboutEditMode(false);
                                        if (textareaRef.current) {
                                            if (user.about)
                                                textareaRef.current.value =
                                                    user.about;
                                            else textareaRef.current.value = "";
                                        }
                                    }}
                                    className="px-2 py-0.5 bg-red-400 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : null}
                </form>
            </div>
            <div className={`p-6 ${option === 3 ? "" : " hidden "}grow`}>
                <form
                    onSubmit={handleProfileUpdate}
                    ref={formRef}
                    className="flex flex-col bg-gray-200 rounded-2xl h-fit p-6"
                >
                    <div className="flex w-full justify-between mb-12">
                        <div className="flex flex-col w-[48%]">
                            <div className="flex flex-row w-full justify-between mb-6">
                                <div className="flex flex-col w-[48%]">
                                    <label
                                        htmlFor="first-name"
                                        className="ml-2"
                                    >
                                        First Name
                                    </label>
                                    <input
                                        id="first-name"
                                        type="text"
                                        placeholder={
                                            user.name
                                                ? user.name.split(" ")[0]
                                                : "Error finding your username!"
                                        }
                                        className="focus:outline-0 border-2 border-gray-400 px-2 rounded-2xl "
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="flex flex-col w-[48%]">
                                    <label htmlFor="last-name" className="ml-2">
                                        Last Name
                                    </label>
                                    <input
                                        id="last-name"
                                        type="text"
                                        placeholder={
                                            user.name
                                                ? user.name.split(" ")[1]
                                                : "Error finding your username!"
                                        }
                                        className="focus:outline-0 border-2 border-gray-400 px-2 rounded-2xl "
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col mb-6">
                                <label htmlFor="name" className="ml-2">
                                    Username
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder={
                                        user.username
                                            ? user.username
                                            : "Error finding your username!"
                                    }
                                    className="focus:outline-0 border-2 border-gray-400 px-2 rounded-2xl "
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-col mb-6">
                                <label htmlFor="password" className="ml-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="text"
                                    placeholder="•••••••••••••••"
                                    className="focus:outline-0 border-2 border-gray-400 px-2 rounded-2xl "
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                {credentialError ? (
                                    <span className="text-red-500">
                                        {credentialError}
                                    </span>
                                ) : null}
                            </div>
                            <div className="flex flex-col mb-6">
                                <label htmlFor="npassword" className="ml-2">
                                    New Password
                                </label>
                                <input
                                    id="npassword"
                                    type="text"
                                    placeholder="•••••••••••••••"
                                    className="focus:outline-0 border-2 border-gray-400 px-2 rounded-2xl "
                                    onChange={(e) => {
                                        if (
                                            !/(?=.*[a-z])/.test(e.target.value)
                                        ) {
                                            setPasswordError(
                                                "Password must contain at least one lowercase letter"
                                            );
                                        } else if (
                                            !/(?=.*[A-Z])/.test(e.target.value)
                                        ) {
                                            setPasswordError(
                                                "Password must contain at least one uppercase letter"
                                            );
                                        } else if (
                                            !/(?=.*\d)/.test(e.target.value)
                                        ) {
                                            setPasswordError(
                                                "Password must contain at least one number"
                                            );
                                        } else if (e.target.value.length < 8) {
                                            setPasswordError(
                                                "Password must be at least 8 characters long"
                                            );
                                        } else {
                                            setPasswordError("");
                                        }

                                        if (e.target.value === "") {
                                            setPasswordError("");
                                            setConfirmPasswordError("");
                                        }

                                        setNPassword(e.target.value);
                                    }}
                                />
                                {passwordError ? (
                                    <span className="text-red-500">
                                        {passwordError}
                                    </span>
                                ) : null}
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="cpassword" className="ml-2">
                                    Confirm Password
                                </label>
                                <input
                                    id="cpassword"
                                    type="text"
                                    placeholder="•••••••••••••••"
                                    className="focus:outline-0 border-2 border-gray-400 px-2 rounded-2xl "
                                    onChange={(e) => {
                                        if (e.target.value !== npassword) {
                                            setConfirmPasswordError(
                                                "Passwords do not match"
                                            );
                                        } else {
                                            setConfirmPasswordError("");
                                        }
                                        setCPassword(e.target.value);
                                    }}
                                />
                                {confirmPasswordError ? (
                                    <span className="text-red-500">
                                        {confirmPasswordError}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                        <div className="w-[48%] flex-col flex justify-center items-center">
                            <div className="w-full h-full flex justify-around items-center">
                                <div className="w-full h-full flex flex-col justify-around items-center">
                                    <span className="mb-1">
                                        Profile Picture
                                    </span>
                                    {user.profile_picture ? (
                                        <Image
                                            src={`data:image/jpeg;base64,${user.profile_picture}`}
                                            alt="Profile Picture"
                                            width={100}
                                            height={100}
                                        />
                                    ) : profilePicture ? (
                                        <Image
                                            src={URL.createObjectURL(
                                                profilePicture
                                            )}
                                            alt="Profile Picture"
                                            width={100}
                                            height={100}
                                            className="rounded-[999px]"
                                        />
                                    ) : (
                                        <UserIcon className="bg-white h-24 text-gray-400 border-4 p-1 rounded-[999px]"></UserIcon>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (profilePictureRef.current) {
                                                profilePictureRef.current.click();
                                            }
                                        }}
                                        className="bg-white rounded-md max-w-fit px-2 py-0.5"
                                    >
                                        Change
                                    </button>
                                    <input
                                        type="file"
                                        ref={profilePictureRef}
                                        onChange={(e) =>
                                            setProfilePicture(
                                                e.target.files?.[0]
                                            )
                                        }
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                                <div className="w-full h-full flex flex-col justify-around items-center">
                                    <span className="mb-1">Banner</span>
                                    {user.banner ? (
                                        <Image
                                            src={`data:image/jpeg;base64,${user.banner}`}
                                            alt="Banner"
                                            width={200}
                                            height={100}
                                        />
                                    ) : banner ? (
                                        <Image
                                            src={URL.createObjectURL(banner)}
                                            alt="Banner"
                                            width={200}
                                            height={100}
                                        />
                                    ) : (
                                        <div className="bg-gray-300 min-h-[30%] min-w-[60%]"></div>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (bannerRef.current) {
                                                bannerRef.current.click();
                                            }
                                        }}
                                        className="bg-white rounded-md max-w-fit px-2 py-0.5"
                                    >
                                        Change
                                    </button>
                                    <input
                                        type="file"
                                        ref={bannerRef}
                                        onChange={(e) =>
                                            setBanner(e.target.files?.[0])
                                        }
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-between px-1.5">
                        <button
                            type="submit"
                            className="max-w-fit px-6 py-0.5 bg-green-400 rounded-md"
                        >
                            Save
                        </button>
                        <button
                            type="reset"
                            onClick={(e) => {
                                e.preventDefault();
                                setFirstName("");
                                setLastName("");
                                setUsername("");
                                setPassword("");
                                setNPassword("");
                                setCPassword("");
                                setProfilePicture(undefined);
                                setBanner(undefined);
                                setPasswordError("");
                                setConfirmPasswordError("");
                                setCredentialError("");
                                formRef.current?.reset();
                            }}
                            className="max-w-fit px-4 py-0.5 bg-red-400 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
