import Header from "@/app/ui/home/header";
import Chats from "@/app/ui/chat/chats";
import Chat from "@/app/ui/chat/chat";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { name: string } }) {
    const session = await getServerSession();

    if (!session) {
        redirect("/");
    }

    const { name } = params;

    const fetchUsername = await fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/user/email/${session?.user?.email}`
    );

    let username = "";
    const usernameData = await fetchUsername.json();
    if (fetchUsername.status === 400) {
        console.log(usernameData);
    } else {
        username = usernameData.user.username;
    }

    const fetchUser = await fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/user/username/${name}`
    );

    let profilePicture = "";
    const userData = await fetchUser.json();
    if (fetchUser.status === 400) {
        console.log(userData);
    } else {
        profilePicture = userData.user.profilePicture;
    }

    return (
        <>
            <Header
                name={session?.user?.name || " "}
                email={session?.user?.email || ""}
                username={username}
                profile={profilePicture}
            ></Header>
            <main className="flex w-full h-[92vh]">
                <Chats
                    username={username}
                    email={session?.user?.email || ""}
                ></Chats>
                <Chat username={name} email={session?.user?.email || ""}></Chat>
            </main>
        </>
    );
}
