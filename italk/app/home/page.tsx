import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import { HomeIcon } from "@heroicons/react/24/solid";
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

    let username = "";
    const fetchUsername = await fetch(`${process.env.NEXT_PUBLIC_DB_URL}/username`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user?.email }),
    });

    const usernameData = await fetchUsername.json();
    if (fetchUsername.status === 400) {
        console.log(usernameData);
    } else {
        username = usernameData.username;
    }

    let profilePicture = "";
    const fetchProfile = await fetch(`${process.env.NEXT_PUBLIC_DB_URL}/profile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username }),
    });

    const profileData = await fetchProfile.json();
    if (fetchProfile.status === 400) {
        console.log(profileData);
    } else {
        profilePicture = profileData.user.profilePicture;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                name={session?.user?.name || ""}
                username={username}
                email={session?.user?.email || ""}
            ></Header>
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
                            <Link href={`/${username}`}>
                                <span className="flex items-end hover:underline hover:scale-105 active:scale-95">
                                    My Profile
                                </span>
                            </Link>
                        </button>
                    </div>
                </div>
                <div className="p-6 items-center flex flex-col grow">
                    <Post
                        email={session?.user?.email || ""}
                        profile={profilePicture}
                        name={session?.user?.name || ""}
                    ></Post>
                    <Posts></Posts>
                </div>
                <div className="flex align-center flex-col w-1/6 shadow-[-3px_0px_9px_0px_rgba(0,0,0,0.15)]">
                    <div className="flex flex-col shadow-[0_1px_1px_0_rgba(0,0,0,0.1)] h-fit w-full">
                        <Link href={`/${username}/chat`} className="shadow-[0_1px_1px_0_rgba(0,0,0,0.1)] w-full p-6 flex justify-center">
                            Chats
                        </Link>
                        <Chats email={session?.user?.email || ""} username={username}></Chats>
                    </div>
                    <div className="flex justify-center shadow-[0_1px_1px_0_rgba(0,0,0,0.1)] h-fit w-full p-6">
                        Groups
                    </div>
                </div>
            </main>
            <Footer></Footer>
        </div>
    );
}
