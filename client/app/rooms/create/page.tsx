"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import RoomForm from "@/components/RoomForm";
import { useAuthStore } from "@/store/auth.store";
import { createRoom } from "../api/rooms.api";

export default function CreateRoomPage() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);

    useEffect(() => {
        if (!user) return;

        if (user.role !== "admin") {
            router.replace("/rooms");
        }
    }, [user]);

    const handleSubmit = async (data: any) => {
        await createRoom(data);
        router.push("/rooms");
    };

    return (
        <div className="max-w-xl mx-auto px-6 py-10 flex flex-col gap-6">
            <button
                onClick={() => router.back()}
                className="text-slate-500 hover:text-slate-800 text-sm font-medium"
            >
                ← Назад
            </button>

            <h1 className="text-2xl font-bold">Нова кімната</h1>

            <RoomForm onSubmit={handleSubmit} />
        </div>
    );
}