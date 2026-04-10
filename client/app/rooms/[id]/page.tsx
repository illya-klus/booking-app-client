"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { getRoom } from "../api/rooms.api";


type Room = {
    id: string;
    name: string;
    description?: string;
    capacity: number;
    location?: string;
    price_per_hour?: number;
    status?: "active" | "inactive";
};

export default function RoomDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuthStore();
    const isAdmin = user?.role === "admin";

    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const data = await getRoom(id);
                setRoom(data);
            } catch {
                setError("Кімнату не знайдено");
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    if (loading) return <p className="text-center text-slate-400 mt-20">Завантаження...</p>;
    if (error || !room) return <p className="text-center text-red-500 mt-20">{error}</p>;

    return (
        <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
            <button
                onClick={() => router.back()}
                className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer w-fit"
            >
                ← Назад
            </button>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col gap-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <h1 className="text-2xl font-bold text-slate-900">{room.name}</h1>
                    <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${room.status === "inactive"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                            }`}
                    >
                        {room.status === "inactive" ? "Неактивна" : "Активна"}
                    </span>
                </div>

                {room.description && (
                    <p className="text-slate-500 leading-relaxed text-sm">{room.description}</p>
                )}

                {/* Meta */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-slate-700 text-sm">
                        <span className="text-lg">👥</span>
                        <span>Місткість: <strong>{room.capacity} осіб</strong></span>
                    </div>
                    {room.location && (
                        <div className="flex items-center gap-3 text-slate-700 text-sm">
                            <span className="text-lg">📍</span>
                            <span>Локація: <strong>{room.location}</strong></span>
                        </div>
                    )}
                    {room.price_per_hour !== undefined && (
                        <div className="flex items-center gap-3 text-slate-700 text-sm">
                            <span className="text-lg">💵</span>
                            <span>Ціна: <strong>{room.price_per_hour} грн/год</strong></span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    {!isAdmin && (
                        <button
                            onClick={() => router.push(`/bookings/create?roomId=${room.id}`)}
                            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                            Записатись
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            onClick={() => router.push(`/rooms/edit?id=${room.id}`)}
                            className="px-5 py-2.5 bg-slate-100 text-slate-700 border border-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                            Редагувати
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}