"use client";

import { deleteRoom } from "@/app/rooms/api/rooms.api";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";


type Room = {
    id: string;
    name: string;
    description?: string;
    capacity: number;
    location?: string;
    price_per_hour?: number;
    status?: "active" | "inactive";
};

type RoomCardProps = {
    room: Room;
    onDeleted?: () => void;
};

export default function RoomCard({ room, onDeleted }: RoomCardProps) {
    const router = useRouter();
    const { user } = useAuthStore();
    const isAdmin = user?.role === "admin";

    const handleDelete = async () => {
        if (!confirm("Видалити кімнату?")) return;
        try {
            await deleteRoom(room.id);
            onDeleted?.();
        } catch {
            alert("Помилка при видаленні");
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col gap-2">
                <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full w-fit uppercase tracking-wide ${room.status === "inactive"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                        }`}
                >
                    {room.status === "inactive" ? "Неактивна" : "Активна"}
                </span>
                <h3 className="text-lg font-semibold text-slate-900">{room.name}</h3>
            </div>

            {room.description && (
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {room.description}
                </p>
            )}

            <div className="flex flex-wrap gap-2">
                <span className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                    👥 {room.capacity} осіб
                </span>
                {room.location && (
                    <span className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                        📍 {room.location}
                    </span>
                )}
                {room.price_per_hour !== undefined && (
                    <span className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                        💵 {room.price_per_hour} грн/год
                    </span>
                )}
            </div>

            <div className="flex gap-2 flex-wrap mt-auto pt-2">
                <button
                    onClick={() => router.push(`/rooms/${room.id}`)}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                    Переглянути
                </button>

                {isAdmin && (
                    <>
                        <button
                            onClick={() => router.push(`/rooms/edit/${room.id}`)}
                            className="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                            Редагувати
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                        >
                            Видалити
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}