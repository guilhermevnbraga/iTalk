import { getServerSession } from "next-auth";
import LogoutButton from "../ui/logoutButton";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getServerSession()
    
    if(!session) {
        redirect('/')
    }

    return (
        <main className="flex justify-center items-center h-screen flex-col">
            <h2>Olá {session?.user?.name}!</h2>
            <LogoutButton></LogoutButton>
        </main>
    )
}