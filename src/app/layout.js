import { Inter } from "next/font/google";
import "./globals.css";
// Script component
import Script from "next/script";
import Footer from "@/components/footer";
import Navbar from "@/components/nav";
import Web3ModalProvider from "@/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Kanoi Staking",
	description: "Staking Platform ",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link
					href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
					rel="stylesheet"
					integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
					crossOrigin="anonymous"></link>
			</head>
			<body className={inter.className}>
				<Web3ModalProvider>
					{/* Navbar */}
					<Navbar />
					{children}
					{/* Footer */}
					<Footer />
				</Web3ModalProvider>
			</body>
			<Script
				src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
				integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
				crossOrigin="anonymous"></Script>
			<Script src="https://code.iconify.design/2/2.2.1/iconify.min.js"></Script>
			<Script src="https://code.iconify.design/iconify-icon/1.0.1/iconify-icon.min.js"></Script>
			<Script src="https://code.iconify.design/3/3.1.0/iconify.min.js"></Script>
		</html>
	);
}
