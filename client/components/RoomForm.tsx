"use client";

import { useState } from "react";

type RoomFormData = {
    name: string;
    description: string;
    capacity: number;
    location: string;
    price_per_hour: number;
    status?: "active" | "inactive";
};

type RoomFormProps = {
    initialData?: Partial<RoomFormData>;
    onSubmit: (data: RoomFormData) => Promise<void>;
    isEdit?: boolean;
};

export default function RoomForm({ initialData, onSubmit, isEdit = false }: RoomFormProps) {
    const [form, setForm] = useState<RoomFormData>({
        name: initialData?.name ?? "",
        description: initialData?.description ?? "",
        capacity: initialData?.capacity ?? 1,
        location: initialData?.location ?? "",
        price_per_hour: initialData?.price_per_hour ?? 0,
        status: initialData?.status ?? "active",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "capacity" || name === "price_per_hour" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await onSubmit(form);
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Щось пішло не так");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-7 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Назва *</label>
                <input
                    className={inputClass}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Назва кімнати"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Опис</label>
                <textarea
                    className={`${inputClass} resize-none`}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Опис кімнати"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Місткість *</label>
                    <input
                        className={inputClass}
                        name="capacity"
                        type="number"
                        min={1}
                        value={form.capacity}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Ціна за годину (грн)</label>
                    <input
                        className={inputClass}
                        name="price_per_hour"
                        type="number"
                        min={0}
                        value={form.price_per_hour}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Локація</label>
                <input
                    className={inputClass}
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Поверх, кабінет..."
                />
            </div>

            {isEdit && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Статус</label>
                    <select
                        className={inputClass}
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="active">Активна</option>
                        <option value="inactive">Неактивна</option>
                    </select>
                </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="mt-1 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
                {loading ? "Збереження..." : isEdit ? "Зберегти зміни" : "Створити кімнату"}
            </button>
        </form>
    );
}