"use client";

import { useRef } from "react";
import { PaperClipIcon } from "@heroicons/react/24/solid";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { UserIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface PostProps {
    email: string;
}

export default function Post({ email }: PostProps) {
    const [mapVisibility, setMapVisibility] = useState(false);
    const [moodVisibility, setMoodVisibility] = useState(false);
    const [content, setContent] = useState("");
    const [attachment, setAttachment] = useState<File | null>(null);
    const [picture, setPicture] = useState<File | null>(null);
    const [locale, setLocale] = useState("");
    const [mood, setMood] = useState("");
    const attachmentInputRef = useRef<HTMLInputElement>(null);
    const pictureInputRef = useRef<HTMLInputElement>(null);

    const toogleMapVisibility = () => {
        setMapVisibility(!mapVisibility);
        if (moodVisibility) setMoodVisibility(false);
    };

    const toogleMoodVisibility = () => {
        setMoodVisibility(!moodVisibility);
        if (mapVisibility) setMapVisibility(false);
    };

    const handleAttachmentClick = () => {
        if (attachmentInputRef.current) {
            attachmentInputRef.current.click();
        }
    };

    const handlePictureClick = () => {
        if (pictureInputRef.current) {
            pictureInputRef.current.click();
        }
    };

    const handleAttachmentChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files) {
            setAttachment(event.target.files[0]);
        }
    };

    const handlePictureChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files) {
            setPicture(event.target.files[0]);
        }
    };

    const post = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mapVisibility) setMapVisibility(false);
        if (moodVisibility) setMoodVisibility(false);

        const response = await fetch("https://italk-server.vercel.app/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                message: content,
                pictures: picture,
                attachments: attachment,
                locale: locale,
                mood: mood,
            }),
        });

        const data = await response.json();
        console.log(data);

        if (e.target instanceof HTMLFormElement) {
            e.target.reset();
        }

        setAttachment(null);
        setPicture(null);
        setContent("");
        setLocale("");
        setMood("");
    };

    return (
        <form onSubmit={post} className="w-full bg-white rounded-2xl shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)] mb-6">
            <div className="w-full flex flex-row items-end justify-center p-6 pb-0">
                <UserIcon className="h-8 w-8 text-gray-900 mr-3"></UserIcon>
                <div className="flex grow shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)] rounded-2xl p-2">
                    <input
                        className="w-full ml-2 focus:outline-0"
                        placeholder="What's on your mind?"
                        type="text"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
            </div>
            <div className="w-full flex flex-row justify-between items-center p-6">
                <div className="flex flex-row justify-between ml-1">
                    <button type='button' onClick={handlePictureClick}>
                        <input
                            type="file"
                            ref={pictureInputRef}
                            onChange={handlePictureChange}
                            className="hidden"
                            accept="image/*"
                        />
                        <PhotoIcon className="hover:scale-105 h-6 w-6 text-gray-400 mr-1" />
                    </button>
                    <button type='button' onClick={handleAttachmentClick}>
                        <input
                            type="file"
                            ref={attachmentInputRef}
                            onChange={handleAttachmentChange}
                            className="hidden"
                        />
                        <PaperClipIcon className="hover:scale-105 h-6 w-6 text-gray-400 mr-1" />
                    </button>
                    <button type='button' onClick={toogleMapVisibility}>
                        <MapPinIcon className="hover:scale-105 h-6 w-6 text-gray-400 mr-1"></MapPinIcon>
                    </button>
                    <div
                        className={`${
                            mapVisibility ? "" : "hidden"
                        } shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)] rounded-2xl mr-1`}
                    >
                        <input
                            className="ml-2 mr-2 p-1 text-sm focus:outline-0"
                            type="text"
                            placeholder="Where are you?"
                            onChange={(e) => setLocale(e.target.value)}
                        />
                    </div>
                    <button type='button' onClick={toogleMoodVisibility}>
                        <FaceSmileIcon className="hover:scale-105 h-6 w-6 text-gray-500"></FaceSmileIcon>
                    </button>
                    <div
                        className={`${
                            moodVisibility ? "" : "hidden"
                        } shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)] rounded-2xl mr-1`}
                    >
                        <input
                            className="ml-2 mr-2 p-1 text-sm focus:outline-0"
                            type="text"
                            placeholder="How are you feeling?"
                            onChange={(e) => setMood(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    type='submit'
                    className="hover:scale-105 rounded-xl shadow-[0_4px_9px_0px_rgba(0,0,0,0.15)] py-2 px-6 active:scale-95"
                >
                    Share
                </button>
            </div>
        </form>
    );
}
