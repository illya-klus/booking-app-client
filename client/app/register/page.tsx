"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "@/validation/register.schema";
import { register } from "./api/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../login/api/login";

export default function RegisterPage() {
    const router = useRouter();

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (data: RegisterSchema) => {
        try {
            setLoading(true);
            setError("");

            await register(data);
            await login(data);

            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Register failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-2xl font-bold">Register</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        {...formRegister("name")}
                        placeholder="Name"
                        className="w-full rounded-lg border p-3"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}

                    <input
                        {...formRegister("email")}
                        placeholder="Email"
                        className="w-full rounded-lg border p-3"
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}

                    <input
                        type="password"
                        {...formRegister("password")}
                        placeholder="Password"
                        className="w-full rounded-lg border p-3"
                    />
                    {errors.password && (
                        <p className="text-sm text-red-500">
                            {errors.password.message}
                        </p>
                    )}

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <button
                        disabled={loading}
                        className="w-full rounded-lg bg-green-600 p-3 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
}