"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import RoomForm from "@/components/RoomForm";
import { useAuthStore } from "@/store/auth.store";
import { getRoom, updateRoom } from "../../api/rooms.api";

type Room = {
    id: string;
    name: string;
    description?: string;
    capacity: number;
    location?: string;
    price_per_hour?: number;
    status?: "active" | "inactive";
};

export default function EditRoomPage() {
    const router = useRouter();
    const params = useParams();

    const id = params?.id as string;

    const user = useAuthStore((s) => s.user);

    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (!id) return;
        if (user === undefined) return;

        if (!user) {
            router.replace("/rooms");
            return;
        }

        if (user.role !== "admin") {
            router.replace("/rooms");
            return;
        }
    }, [mounted, user, id]);

    useEffect(() => {
        if (!mounted) return;
        if (!id) return;
        if (!user || user.role !== "admin") return;

        const fetchRoom = async () => {
            try {
                setLoading(true);

                const data = await getRoom(id);
                setRoom(data);
            } catch (err) {
                setError("Не вдалося завантажити кімнату");
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [mounted, user, id]);

    const handleSubmit = async (data: any) => {
        await updateRoom(id, data);
        router.push("/rooms");
    };

    if (!mounted || loading) {
        return (
            <p className="text-center mt-20 text-slate-400">
                Завантаження...
            </p>
        );
    }

    if (error || !room) {
        return (
            <p className="text-center mt-20 text-red-500">
                {error || "Room not found"}
            </p>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-6 py-10 flex flex-col gap-6">
            <button
                onClick={() => router.back()}
                className="text-slate-500 hover:text-slate-800 text-sm"
            >
                ← Назад
            </button>

            <h1 className="text-2xl font-bold">
                Edit room: {room.name}
            </h1>

            <RoomForm
                initialData={room}
                onSubmit={handleSubmit}
                isEdit
            />
        </div>
    );
}