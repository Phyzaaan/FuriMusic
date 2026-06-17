"use client";
import { useState } from "react";
import { createClient } from "../utils/supabase/client";
import { SecondaryBtn } from "../ui/components/Buttons";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [input, setInput] = useState({ email: "", pass: "" });
    const [status, setStatus] = useState<string | null>(null);
    const [isLogingIn, setIsLogingIn] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setIsLogingIn(true)
        const { error } = await supabase.auth.signInWithPassword({ email: input.email, password: input.pass });
        if (!error) {
            router.push("/Dashboard");
            return;
        }
        setStatus(error.message);
        setIsLogingIn(false);
    }
    return (
        <main className="no-scrollbar flex h-full w-full flex-col items-center gap-5 overflow-y-auto pt-22 pb-20">
            <h1 className="text-3xl font-bold">Wellcome Phantom!</h1>
            <p className="w-3/4 text-primary text-center">
                Please Authenticate your self in order to access admin dashboard!
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col mx-auto gap-5 py-12">
                <input
                    type="email"
                    placeholder="Email..."
                    className="bg-dark-bg border-card-border flex w-80 items-center justify-between rounded-sm border px-2 py-1"
                    onChange={(e) => setInput(prev => ({ ...prev, email: e.target.value }))}
                    required
                    value={input.email}
                />
                <input
                    type="password"
                    placeholder="Password..."
                    className="bg-dark-bg border-card-border flex w-80 items-center justify-between rounded-sm border px-2 py-1"
                    onChange={(e) => setInput(prev => ({ ...prev, pass: e.target.value }))}
                    required
                    value={input.pass}
                />
                <SecondaryBtn type="submit" disabled={isLogingIn}>Login</SecondaryBtn>
            </form>

            <div className={`absolute w-110 bg-card-bg p-2 border border-card-border rounded-lg backdrop-blur-sm flex flex-col items-center gap-5 transition-all ${status === null && 'scale-50 opacity-0'}`}>
                <h1 className="text-center text-xl font-semibold">Oopse! Somting Not Good!</h1>
                <p className="text-center text-lg">{status}</p>
                <SecondaryBtn onClick={() => setStatus(null)} className="w-1/2 text-2xl">OK</SecondaryBtn>
            </div>
        </main>
    );
}