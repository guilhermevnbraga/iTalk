import { getServerSession } from "next-auth";
import LogoutButton from "../ui/logoutButton";
import { redirect } from "next/navigation";
import Header from "../ui/home/header";

export default async function Page() {
    const session = await getServerSession()
    
    if(!session) {
        redirect('/')
    }

    return (
        <>
            <Header username={session?.user?.name || ''}></Header>
            <main className="flex justify-center items-center h-screen flex-col min-h-screen">
                <h2>Olá {session?.user?.name}!</h2>
                <LogoutButton></LogoutButton>
            </main>
        </>
    )
}
