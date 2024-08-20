"use client";
import Image from "next/image";
import { Room } from "./Room";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";

export default function Home() {
	return (
		<main className="h-screen overflow-hidden">
			<Navbar />

			<div className="flex h-full flex-row">
				<Live />
			</div>
		</main>
	);
}
