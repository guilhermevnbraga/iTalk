import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Banner from "../ui/profile/banner";
import Header from "../ui/home/header";
import Option from "../ui/profile/options";

export default async function Page({
    params,
}: {
    params: { name: string };
}) {
    let user = null;
    const session = await getServerSession();

    if (!session) {
        redirect("/");
    }

    const { name } = params;

    const fetchUser = await fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/user/username/${name}`
    );

    const userData = await fetchUser.json();
    if (fetchUser.status === 400) {
        console.log(userData);
    } else {
        user = userData.user;
    }

    const hasFriend = await fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/friend/hasFriend?userEmail=${session?.user?.email}&friendEmail=${user.email}`
    );

    let acessUsername = "";
    const fetchAcessUsername = await fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/user/email/${session?.user?.email}`
    );

    const acessUsernameData = await fetchAcessUsername.json();
    if (fetchAcessUsername.status === 400) {
        console.log(acessUsernameData);
    } else {
        acessUsername = acessUsernameData.user.username;
    }

    const friendData = await hasFriend.json();
    if (hasFriend.status === 400) {
        console.log(friendData);
    } else {
        user.hasFriend = friendData.hasFriend;
    }

    return (
        <main className="flex flex-col items-center min-h-screen">
            <Header
                name={session?.user?.name || ""}
                username={user.username}
                email={session?.user?.email || ""}
                profile={user.profilePicture}
            />
            <div className="flex flex-col w-full sm:w-5/6 lg:w-4/6 grow shadow-[0_0_9px_0_rgba(0,0,0,0.15)]">
                <Banner
                    user={user}
                    acessUsername={acessUsername}
                    acessUserEmail={session?.user?.email || ""}
                />
                <Option user={user} acessUser={acessUsername} />
            </div>
        </main>
    );
}
