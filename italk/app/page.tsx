import Header from "./ui/header";
import Footer from "./ui/footer";
import Link from "next/link";
import Image from "next/image";
import talk from "./ui/imgs/talk.webp";

export default function Page() {
    return (
        <main className="min-h-screen flex flex-col bg-[#edeff1]">
            <Header></Header>
            <div className="flex flex-col lg:flex-row justify-around items-center grow">
                <section className="flex flex-col items-center w-full lg:w-1/2 text-center lg:text-left">
                    <span className="font-black text-4xl sm:text-5xl md:text-7xl lg:text-5xl mb-6 lg:mb-3">
                        Manage your life
                    </span>
                    <span className="font-light text-sm sm:text-lg md:text-2xl lg:text-lg mb-16">
                        Connect with friends and family
                    </span>
                    <Link
                        className="shadow flex justify-center p-3 rounded-3xl border-2 border-[#2d85c3] bg-[#2d85c3] text-white hover:bg-white hover:text-[#2d85c3] font-medium hover:scale-105 transition-transform duration-300
                        w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-1/3"
                        href="/account/login"
                    >
                        <button>Connect now</button>
                    </Link>
                </section>
                <aside className="hidden landscape:flex justify-center lg:w-1/2">
                    <figure className="shadow-md w-2/3 rounded-xl">
                        <Image src={talk} width={999} height={999} alt="talk"></Image>
                    </figure>
                </aside>
            </div>
            <div className="w-full mt-auto">
                <Footer></Footer>
            </div>
        </main>
    );
}
