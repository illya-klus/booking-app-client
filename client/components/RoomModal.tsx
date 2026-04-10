"use client";

import { useEffect } from "react";

type RoomModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

export default function RoomModal({ isOpen, onClose, title, children }: RoomModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-7 w-full max-w-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 text-lg leading-none transition-colors cursor-pointer"
                    >
                        ✕
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}