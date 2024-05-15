import "./globals.scss";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Ambiance Creator",
	description:
		"Ambiance creator app to create and share ambiance during RPG sessions",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <html lang="en">{children}</html>;
}
