import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Header from "../ui/home/header";
import Footer from "../ui/footer";
import Post from "../ui/home/post";
import Posts from "../ui/home/posts";
import { UserIcon } from "@heroicons/react/24/solid";
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
            <button>{session?.user?.name || 'aaaa'}</button>
            <main className="flex grow min-h-screen">
                <div className="w-1/6 shadow-[3px_0_9px_0_rgba(0,0,0,0.15)]">
                    <div className="mt-16 w-full shadow-[0_1px_1px_0_rgba(0,0,0,0.1)] p-6">
                        <button className="flex flex-row w-full mb-3">
                            <HomeIcon className="h-6 w-6 text-gray-500 mr-4"></HomeIcon>
                            <span className="flex items-end hover:underline hover:scale-105 active:scale-95">
                                Home
                            </span>
                        </button>
                        <button className="flex flex-row w-full">
                            <UserIcon className="h-6 w-6 text-gray-500 mr-4"></UserIcon>
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
                    <Post email={session?.user?.email || ""}></Post>
                    <Posts></Posts>
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
