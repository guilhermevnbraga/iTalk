import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { UserIcon, HomeIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";
import Header from "../ui/home/header";
import Footer from "../ui/footer";
import Post from "../ui/home/post";
import Posts from "../ui/home/posts";
import Chats from "../ui/home/chats";
import Link from "next/link";

export default async function Page() {
    const session = await getServerSession();

    if (!session) {
        redirect("/");
    }

    const fetchProfile = await fetch(`${process.env.NEXT_PUBLIC_DB_URL}/user/email/${session?.user?.email}`);
    const userData = await fetchProfile.json();

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                name={session?.user?.name || ""}
                username={userData.user.username}
                email={session?.user?.email || ""}
                profile={userData.user.profilePicture}
            ></Header>
            
            <main className="flex grow flex-col lg:flex-row min-h-screen">
                {/* Sidebar */}
                <div className="w-full lg:w-1/6 shadow-[3px_0_9px_0_rgba(0,0,0,0.15)]">
                    <div className="mt-6 lg:mt-16 w-full shadow-[0_1px_1px_0_rgba(0,0,0,0.1)] p-6">
                        <button className="flex flex-row w-full mb-3">
                            <HomeIcon className="h-6 w-6 text-gray-500 mr-4" />
                            <span className="flex items-end hover:underline hover:scale-105 active:scale-95">
                                Home
                            </span>
                        </button>
                        <button className="flex flex-row w-full mb-3">
                            <UserIcon className="h-6 w-6 text-gray-500 mr-4" />
                            <Link href={`/${userData.user.username}`}>
                                <span className="flex items-end hover:underline hover:scale-105 active:scale-95 text-sm xl:text-md">
                                    My Profile
                                </span>
                            </Link>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6 items-center flex flex-col grow">
                    <Post
                        email={session?.user?.email || ""}
                        profile={userData.user.profilePicture}
                        name={session?.user?.name || ""}
                    ></Post>
                    <Posts></Posts>
                </div>

                {/* Chat Sidebar */}
                <div className="hidden lg:flex flex-col w-1/6 shadow-[-3px_0px_9px_0px_rgba(0,0,0,0.15)]">
                    <div className="flex flex-col shadow-[0_1px_1px_0_rgba(0,0,0,0.1)] h-fit w-full">
                        <Link href={`/${userData.user.username}/chat`} className="shadow-[0_1px_1px_0_rgba(0,0,0,0.1)] w-full p-6 flex justify-center">
                            Chats
                        </Link>
                        <Chats email={session?.user?.email || ""} username={userData.user.username}></Chats>
                    </div>
                </div>
            </main>

            <Footer></Footer>
        </div>
    );
}
