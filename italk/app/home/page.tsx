import { getServerSession } from "next-auth";
import LogoutButton from "../ui/logoutButton";
import { redirect } from "next/navigation";
import Header from "../ui/home/header";
import Footer from "../ui/footer";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { PaperClipIcon } from "@heroicons/react/24/solid";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/solid";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { UsersIcon } from "@heroicons/react/24/solid";

export default async function Page() {
    const session = await getServerSession();

    if (!session) {
        redirect("/");
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header username={session?.user?.name || ""}></Header>
            <main className="flex grow">
                <div className="w-1/6 shadow-[3px_0_9px_0_rgba(0,0,0,0.15)]">
                    <div className="mt-16 w-full shadow-[0_1px_1px_0_rgba(0,0,0,0.1)] p-6">
                        <button className="flex flex-row w-full mb-3">
                            <HomeIcon className="h-6 w-6 text-gray-500 mr-4"></HomeIcon>
                            <span className="flex items-end hover:underline hover:scale-105 active:scale-95">
                                Home
                            </span>
                        </button>
                        <button className="flex flex-row w-full">
                            <UserIcon className="h-6 w-6 text-gray-900 mr-4"></UserIcon>
                            <span className="flex items-end hover:underline hover:scale-105 active:scale-95">
                                My Profile
                            </span>
                        </button>
                    </div>
                    <div className="flex flex-col w-full shadow-[0_1px_1px_0_rgba(0,0,0,0.1)] p-6 mb-3">
                        <span className="font-bold mb-6">Favorites</span>
                        <button className="flex flex-row w-full mb-3">
                            <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-500 mr-4"></ChatBubbleLeftRightIcon>
                            <span className="flex items-end hover:underline hover:scale-105 active:scale-95">
                                Inbox
                            </span>
                        </button>
                        <button className="flex flex-row w-full mb-3">
                            <UsersIcon className="h-6 w-6 text-gray-500 mr-4"></UsersIcon>
                            <span className="flex items-end hover:underline hover:scale-105 active:scale-95">
                                Friends
                            </span>
                        </button>
                    </div>
                </div>
                <div className="w-[44%] p-6 items-center flex flex-col">
                    <div className="w-full bg-white rounded-2xl shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)]">
                        <div className="w-full flex flex-row items-end justify-center p-6 pb-0">
                            <UserIcon className="h-8 w-8 text-gray-900 mr-3"></UserIcon>
                            <div className="flex grow shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)] rounded-2xl p-2">
                                <input
                                    className="w-full ml-2 focus:outline-0"
                                    placeholder="What's on your mind?"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="w-full flex flex-row justify-between items-center p-6">
                            <div className="flex flex-row justify-between ml-1">
                                <button>
                                    <PhotoIcon className="hover:scale-105 h-6 w-6 text-gray-400 mr-1" />
                                </button>
                                <button>
                                    <PaperClipIcon className="hover:scale-105 h-6 w-6 text-gray-400 mr-1"></PaperClipIcon>
                                </button>
                                <button>
                                    <MapPinIcon className="hover:scale-105 h-6 w-6 text-gray-400 mr-1"></MapPinIcon>
                                </button>
                                <button>
                                    <FaceSmileIcon className="hover:scale-105 h-6 w-6 text-gray-500"></FaceSmileIcon>
                                </button>
                            </div>
                            <button className="hover:scale-105 rounded-xl shadow-[0_4px_9px_0px_rgba(0,0,0,0.15)] py-2 px-6 active:scale-95">
                                Share
                            </button>
                        </div>
                    </div>
                    <LogoutButton></LogoutButton>
                </div>
                <div className="flex justify-center w-[22%] bg-yellow-400 p-6">
                    Events
                </div>
                <div className="flex justify-center w-1/6 shadow-[-3px_0px_9px_0px_rgba(0,0,0,0.15)] p-6">
                    Chats
                </div>
            </main>
            <Footer></Footer>
        </div>
    );
}
