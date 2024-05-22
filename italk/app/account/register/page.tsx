"use client";

import Image from "next/image";
import emailIcon from "../../ui/imgs/email.png";
import ProvidersButtons from "../../ui/providersButtons";
import PasswordInput from "../../ui/passwordInput";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userName = firstName + " " + lastName;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const response = await fetch("https://italk-server.vercel.app:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: userName,
                email: email,
                password: password,
            }),
        });

        const data = await response.json();

        if (response.status == 200) {
            console.log(data.message);
            router.push("/account/login");
        } else {
            setError(data.error);
        }

    };

    return (
        <div className="flex flex-col w-full h-full justify-evenly items-center">
            <h1 className="md:text-5xl text-3xl font-bold mb-6">Sign Up</h1>
            <div className="flex flex-col w-full justify-center items-center">
                <form className="flex flex-col w-full landscape:w-3/5 md:w-5/6">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col w-[48%]">
                            <label
                                htmlFor="first-name"
                                className="md:text-base ml-3 text-xs font-medium"
                            >
                                First Name
                            </label>
                            <input
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                }}
                                type="text"
                                id="first-name"
                                placeholder="First Name"
                                className="shadow-lg flex items-center justify-between border-solid border-2 rounded-3xl border-yellow-400 bg-white mb-2 px-3 w-full w-11/12 py-2 bg-transparent focus:outline-0 placeholder:text-xs landscape:placeholder:text-base"
                            />
                        </div>
                        <div className="flex flex-col w-[48%]">
                            <label
                                htmlFor="last-name"
                                className="md:text-base ml-3 text-xs font-medium"
                            >
                                Last Name
                            </label>
                            <input
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                }}
                                type="text"
                                id="last-name"
                                placeholder="Last Name"
                                className="shadow-lg flex items-center justify-between border-solid border-2 rounded-3xl border-yellow-400 bg-white mb-2 px-3 w-full w-11/12 py-2 bg-transparent focus:outline-0 placeholder:text-xs landscape:placeholder:text-base"
                            />
                        </div>
                    </div>
                    <label
                        htmlFor="email"
                        className="md:text-base ml-3 text-xs font-medium"
                    >
                        Email
                    </label>
                    <div className="shadow-lg flex items-center justify-between border-solid border-2 rounded-3xl border-yellow-400 bg-white mb-2 px-2 w-full">
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            id="email"
                            className="w-11/12 py-2 px-3 bg-transparent focus:outline-0 placeholder:text-xs landscape:placeholder:text-base"
                            placeholder="email@email.com"
                            autoComplete="off"
                        />
                        <Image
                            src={emailIcon}
                            className="mr-3 w-6 h-4"
                            alt="email"
                        />
                    </div>
                    <PasswordInput
                        label="Password"
                        onChange={setPassword}
                    ></PasswordInput>
                    <PasswordInput
                        label="Confirm Password"
                        onChange={setConfirmPassword}
                    ></PasswordInput>
                </form>
                <div className="flex justify-around items-center w-full landscape:w-3/5 mb-3 landscape:w-3/5 landscape:justify-between md:text-sm xl:text-base text-xs">
                    <div className="flex flex-row items-center justify-center">
                        <input
                            type="checkbox"
                            className="accent-yellow-400 w-3 h-3 mr-1 ml-3"
                        ></input>
                        <span>Remember me</span>
                    </div>
                    <span className="hover:underline cursor-pointer">
                        Forgot Password?
                    </span>
                </div>
                <button
                    onClick={handleSubmit}
                    className="mb-6 shadow-lg w-full landscape:w-7/12 bg-yellow-400 w-7/12 rounded-3xl p-1 text-white md:text-base lg:text-lg xl:text-xl md:w-4/5 font-medium hover:bg-white hover:text-yellow-400 border-solid border-2 border-yellow-400"
                >
                    Sign Up
                </button>
                <ProvidersButtons></ProvidersButtons>
            </div>
            <div className="error-message">{error && <span>{error}</span>}</div>
        </div>
    );
}
