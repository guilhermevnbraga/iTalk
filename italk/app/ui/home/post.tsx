"use client";

import { useRef } from "react";
import { PaperClipIcon } from "@heroicons/react/24/solid";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { UserIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Image from "next/image";

interface PostProps {
    email: string;
    profile: string | null;
    name: string;
}

export default function Post({ email, profile, name }: PostProps) {
    const [mapVisibility, setMapVisibility] = useState(false);
    const [moodVisibility, setMoodVisibility] = useState(false);
    const [content, setContent] = useState("");
    const [attachments, setAttachment] = useState<File[] | null>(null);
    const [pictures, setPictures] = useState<File[] | null>(null);
    const [locale, setLocale] = useState("");
    const [mood, setMood] = useState("");
    const attachmentInputRef = useRef<HTMLInputElement>(null);
    const picturesInputRef = useRef<HTMLInputElement>(null);

    const handleRemovePicture = (idx: number) => {
        if (pictures) {
            const newPictures = pictures.filter((p, x) => {
                return x !== idx;
            });
            setPictures(newPictures);
        }
    };

    const handleRemoveAttachment = (idx: number) => {
        if (attachments) {
            const newAttachments = attachments.filter((p, x) => {
                return x !== idx;
            });
            setAttachment(newAttachments);
        }
    };

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

    const handlePicturesClick = () => {
        if (picturesInputRef.current) {
            picturesInputRef.current.click();
        }
    };

    const handleAttachmentChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files) {
            if (attachments)
                setAttachment([
                    ...attachments,
                    ...Array.from(event.target.files),
                ]);
            else setAttachment(Array.from(event.target.files));
        }
    };

    const handlePicturesChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files) {
            if (pictures)
                setPictures([...pictures, ...Array.from(event.target.files)]);
            else setPictures(Array.from(event.target.files));
        }
    };

    const post = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        formData.append("email", email);
        formData.append("message", content);
        if (pictures) {
            pictures.forEach((picture) => {
                formData.append("pictures", picture);
            });
        }
        if (attachments) {
            attachments.forEach((attachment) => {
                formData.append("attachments", attachment);
            });
        }
        if (locale) {
            formData.append("locale", locale);
        }
        if (mood) {
            formData.append("mood", mood);
        }

        if (mapVisibility) setMapVisibility(false);
        if (moodVisibility) setMoodVisibility(false);

        try {
            const response = await fetch("http://localhost:3001/post", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log(data);
        } catch (err) {
            console.log(err);
        }

        if (e.target instanceof HTMLFormElement) {
            e.target.reset();
        }

        setAttachment(null);
        setPictures(null);
        setContent("");
        setLocale("");
        setMood("");
    };

    return (
        <form
            onSubmit={post}
            className="w-full bg-white rounded-2xl shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)] mb-6"
            method="post"
            encType="multipart/form-data"
        >
            <div className="w-full flex items-center justify-center p-6 pb-0">
                <div className="flex w-full flex-col grow border-2 rounded-2xl p-6">
                    <div className="flex flex-row mb-2">
                        {profile ? (
                            <Image
                                src={profile}
                                alt="perfil"
                                className="w-12 h-12 mr-2 rounded-[50%] p-1"
                            />
                        ) : (
                            <UserIcon className="bg-gray-300 text-gray-500 w-12 h-12 mr-2 rounded-[50%] p-1" />
                        )}
                        <div className="flex flex-col justify-center">
                            <span className="">{`${name} ${
                                mood ? `is feeling ${mood}.` : ""
                            }`}</span>
                            {locale ? (
                                <div className="flex flex-row items-center">
                                    <MapPinIcon className="w-4 h-4 text-gray-500 mr-0.5" />
                                    <span className="font-light text-sm">{`in ${locale}`}</span>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    <textarea
                        className="w-full ml-2 mr-2 mb-6 focus:outline-0 resize-none"
                        placeholder="What's on your mind?"
                        onChange={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height =
                                e.target.scrollHeight + "px";
                            setContent(e.target.value);
                        }}
                    />
                    <div className="flex flex-row flex-wrap justify-between">
                        {pictures
                            ? pictures.map((p, idx) => (
                                  <figure
                                      key={idx}
                                      className="flex items-center m-1"
                                  >
                                      <Image
                                          onClick={() => handleRemovePicture(idx)}
                                          src={URL.createObjectURL(p)}
                                          alt="perfil"
                                          width={333}
                                          height={100}
                                          className="hover:cursor-pointer"
                                      />
                                  </figure>
                              ))
                            : null}
                    </div>
                    <div className="flex flex-col mt-1">
                        {attachments
                            ? attachments.map((p, idx) => {
                                  return (
                                      <a
                                          key={idx}
                                          onClick={() => handleRemoveAttachment(idx)}
                                          className="text-blue-500 hover:cursor-pointer"
                                      >
                                          {p.name}
                                      </a>
                                  );
                              })
                            : null}
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-row justify-between items-center p-6">
                <div className="flex flex-row justify-between ml-1">
                    <button type="button" onClick={handlePicturesClick}>
                        <input
                            type="file"
                            ref={picturesInputRef}
                            onChange={handlePicturesChange}
                            className="hidden"
                            accept="image/*"
                            multiple
                        />
                        <PhotoIcon className="hover:scale-105 h-6 w-6 text-gray-400 mr-1" />
                    </button>
                    <button type="button" onClick={handleAttachmentClick}>
                        <input
                            type="file"
                            ref={attachmentInputRef}
                            onChange={handleAttachmentChange}
                            className="hidden"
                            multiple
                        />
                        <PaperClipIcon className="hover:scale-105 h-6 w-6 text-gray-400 mr-1" />
                    </button>
                    <button type="button" onClick={toogleMapVisibility}>
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
                    <button type="button" onClick={toogleMoodVisibility}>
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
                    type="submit"
                    className="hover:scale-105 rounded-xl shadow-[0_4px_9px_0px_rgba(0,0,0,0.15)] py-2 px-6 active:scale-95"
                >
                    Share
                </button>
            </div>
        </form>
    );
}
