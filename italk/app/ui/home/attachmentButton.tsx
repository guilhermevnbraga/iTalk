'use client'
import { useRef } from "react";
import { PaperClipIcon } from "@heroicons/react/24/solid";

export default function AttachmentButton() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
        }
    };

    return (
        <button onClick={handleButtonClick}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <PaperClipIcon className="hover:scale-105 h-6 w-6 text-gray-400 mr-1" />
        </button>
    );
}