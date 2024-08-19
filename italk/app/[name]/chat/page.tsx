import Header from "@/app/ui/home/header";
import Chats from "@/app/ui/chat/chats";
import Chat from "@/app/ui/chat/chat";
import { getServerSession } from "next-auth";

export default async function Page({ params }: { params: { name: string } }) {
    const session = await getServerSession();
    const { name } = params;

    const fetchUsername = await fetch("http://localhost:3001/username", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user?.email }),
    });

    let username = "";
    const usernameData = await fetchUsername.json();
    if (fetchUsername.status === 400) {
        console.log(usernameData);
    } else {
        username = usernameData.username;
    }

    return (
        <>
            <Header
                name={session?.user?.name || " "}
                email={session?.user?.email || ""}
                username={username}
            ></Header>
            <main className="flex w-full h-[92vh]">
                <Chats email={session?.user?.email || ""}></Chats>
                <Chat username={name} email={session?.user?.email || ""}></Chat>
            </main>
        </>
    );
}
