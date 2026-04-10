"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { getAllRooms } from "./api/rooms.api";
import RoomCard from "@/components/RoomCard";


type Room = {
    id: string;
    name: string;
    description?: string;
    capacity: number;
    location?: string;
    price_per_hour?: number;
    status?: "active" | "inactive";
};

export default function RoomsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const isAdmin = user?.role === "admin";

    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const data = await getAllRooms();
            setRooms(data);
        } catch {
            setError("Не вдалося завантажити кімнати");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Переговорні кімнати</h1>
                {isAdmin && (
                    <button
                        onClick={() => router.push("/rooms/create")}
                        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                        + Нова кімната
                    </button>
                )}
            </div>

            {loading && (
                <p className="text-center text-slate-400 mt-20 text-base">Завантаження...</p>
            )}
            {error && (
                <p className="text-center text-red-500 mt-20 text-base">{error}</p>
            )}
            {!loading && !error && rooms.length === 0 && (
                <p className="text-center text-slate-400 mt-20 text-base">Кімнат поки немає</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} onDeleted={fetchRooms} />
                ))}
            </div>
        </div>
    );
}