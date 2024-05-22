import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    pages: {
        signIn: "/account/login",
    },
    session: {
        strategy: "jwt",
    },
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        CredentialsProvider({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                try {
                    const response = await fetch(
                        "https://italk-server-iq2u9t70q-s0la1r3s-projects.vercel.app/login",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email: credentials?.email,
                                password: credentials?.password,
                            }),
                        }
                    );

                    const data = await response.json();

                    if (response.status == 200) {
                        console.log("sucesso");
                        console.log({
                            id: data.user.id,
                            email: data.user.email,
                            name: data.user.userName,
                        });
                        return {
                            id: data.user.id,
                            email: data.user.email,
                            name: data.user.userName,
                        };
                    }

                    return null;
                } catch (error) {
                    console.error("erro:\n\n", error);
                    return null;
                }
            },
        }),
    ]
});

export { handler as GET, handler as POST };
