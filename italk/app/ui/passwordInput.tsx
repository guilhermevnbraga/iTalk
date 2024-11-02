"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface PasswordInputProps {
    label: string;
    onChange?: (value: string) => void;
}

export default function PasswordInput({ label, onChange }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <label
                htmlFor="password"
                className="ml-3 md:text-base text-xs font-medium"
            >
                {label}
            </label>
            <div className="shadow-lg flex items-center justify-between border-solid border-2 rounded-3xl border-[#2d85c3] bg-white px-2">
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-11/12 px-3 p-2 bg-transparent focus:outline-0 placeholder:text-sm landscape:placeholder:text-base"
                    placeholder="•••••••••••••••"
                    onChange={(e) => {
                        if (onChange) return onChange(e.target.value);
                    }}
                />
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setShowPassword(!showPassword);
                    }}
                >
                    {showPassword ? (
                        <EyeIcon className="w-6 h-6 mr-1" />
                    ) : (
                        <EyeSlashIcon className="w-6 h-6 mr-1" />
                    )}
                </button>
            </div>
        </div>
    );
}
