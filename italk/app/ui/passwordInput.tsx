"use client";

import { useState } from "react";

interface PasswordInputProps {
    label: string;
    onChange?: (value: string) => void;
}

export default function PasswordInput({ label, onChange }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [eyeClass, setEyeClass] = useState("hidden");
    const [closedEyeClass, setEyeClosedClass] = useState(
        "bg-[url(https://static.thenounproject.com/png/22249-200.png)]"
    );

    const handleClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        setEyeClass(
            showPassword
                ? "hidden"
                : "bg-[url(https://static.vecteezy.com/system/resources/thumbnails/014/551/056/small_2x/eye-icon-simple-flat-eye-design-vision-care-concept-wear-glasses-for-a-clear-vision-png.png)]"
        );
        setEyeClosedClass(
            showPassword
                ? "bg-[url(https://static.thenounproject.com/png/22249-200.png)]"
                : "hidden"
        );
    };

    return (
        <div>
            <label
                htmlFor="password"
                className="ml-3 md:text-base text-xs font-medium"
            >
                {label}
            </label>
            <div className="shadow-lg flex items-center justify-between border-solid border-2 rounded-3xl border-yellow-400 bg-white px-2">
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-11/12 px-3 p-2 bg-transparent focus:outline-0 placeholder:text-sm landscape:placeholder:text-base"
                    placeholder="•••••••••••••••"
                    onChange={(e) => {
                        if (onChange) return onChange(e.target.value)
                    }}
                />
                <button
                    className={`bg-cover w-7 h-7 mr-1 ${closedEyeClass}`}
                    onClick={(e) => {
                        handleClick(e);
                        togglePasswordVisibility();
                    }}
                ></button>
                <button
                    className={`bg-cover w-7 h-7 mr-1 ${eyeClass}`}
                    onClick={(e) => {
                        handleClick(e);
                        togglePasswordVisibility();
                    }}
                ></button>
            </div>
        </div>
    );
}
