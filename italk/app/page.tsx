import Header from "./ui/header";
import Footer from "./ui/footer";
import Link from "next/link";
import Image from "next/image";
import town from './ui/imgs/town.webp'

export default function Page() {
    return (
        <main className="h-screen flex justify-center flex-col bg-gradient-to-b from-white to-blue-400">
            <Header></Header>
            <div className="flex lg:flex-row flex-col justify-around items-center grow">
                <section className="flex flex-col lg:w-1/2 items-center w-full">
                    <span className="font-black lg:text-5xl md:text-7xl sm:text-5xl text-4xl lg:mb-3 mb-6 w-fit">
                        Manage your life
                    </span>
                    <span className="lg:text-lg md:text-2xl sm:text-lg text-sm font-light mb-16 w-fit">
                        Connect with friends and family
                    </span>
                    <Link
                        className="hover:scale-105 shadow flex justify-center 2xl:w-1/5 xl:w-1/4 lg:w-1/3 md:w-1/5 p-3 rounded-3xl border-solid border-2 border-yellow-400 bg-yellow-400 text-white hover:bg-white hover:text-yellow-500"
                        href="/account/login"
                    >
                        <button>Connect now</button>
                    </Link>
                </section>
                <aside className="hidden lg:flex justify-center w-1/2">
                <figure className="shadow-md 2xl:w-2/3 xl:w-4/5 md:w-11/12 border-8 border-yellow-400 border-solid rounded-xl">
                        <Image
                            className="w-full"
                            src={town}
                            alt="club penguin"
                        />
                    </figure>
                </aside>
            </div>
            <div className="hidden landscape:flex w-full">
                <Footer></Footer>
            </div>
        </main>
    );
}
