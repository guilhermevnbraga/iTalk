import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import { HomeIcon } from "@heroicons/react/24/solid";
import Header from "../ui/home/header";
import Footer from "../ui/footer";
import Post from "../ui/home/post";
import Posts from "../ui/home/posts";
import Link from "next/link";

export default async function Page() {
    const session = await getServerSession();

    if (!session) {
        redirect("/");
    }

    let username = "";
    const response = await fetch("http://localhost:3001/username", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user?.email }),
    });

    const data = await response.json();
    if (response.status === 400) {
        console.log(data);
    } else {
        username = data.username;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                username={session?.user?.name || ""}
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
                        profile={null}
                        name={session?.user?.name || ""}
                    ></Post>
                    <Posts></Posts>
                </div>
                <div className="flex align-center flex-col w-1/6 shadow-[-3px_0px_9px_0px_rgba(0,0,0,0.15)]">
                    <div className="flex justify-center shadow-[0_1px_1px_0_rgba(0,0,0,0.1)] h-fit w-full p-6">
                        Chats
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
