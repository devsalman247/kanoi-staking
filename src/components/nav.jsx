"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ConnectButton from "./ui/walletConnect";

const Navbar = () => {
	const currentPath = usePathname();
	const [activeTab, setActiveTab] = useState("/dashboard");
	const tabsTitle = [
		{ title: "Dashboard", route: "/dashboard" },
		{ title: "Pools Info", route: "/dashboard/pools" },
		// { title: "Market Tools", route: "/dashboard/market" },
	];

	const dashboardAllowedPaths = ["/dashboard", "/dashboard/pools"];

	useEffect(() => {
		return () => {
			setActiveTab("/dashboard");
		};
	}, []);
	return (
		<>
			<div className="home-nav">
				<div className="container">
					<div className="flex justify-between items-center w-full py-6">
						{/* logo */}
						<Link href={"/"} className="text-black text-2xl font-bold text-decoration-none">
							Kanoi
						</Link>
						{/* tabs */}
						{dashboardAllowedPaths.includes(currentPath) && (
							<div className="bg-white shadow-md rounded-lg p-1 sm-nav-tabs">
								<ul className="nav nav-tabs border-0">
									{tabsTitle.map((tab, index) => (
										<li className="nav-item" key={index}>
											<Link className={`nav-link text-uppercase  ${activeTab === tab.route ? "active" : ""}`} aria-current="page" href={tab.route} onClick={() => setActiveTab(tab.route)}>
												{tab.title}
											</Link>
										</li>
									))}
								</ul>
							</div>
						)}
						{/* tabs */}
						{dashboardAllowedPaths.includes(currentPath) ? (
							<ConnectButton />
						) : (
							<Link href={"/dashboard"} className="btn btn-primary text-uppercase font-bold !bg-[#e8833a] !px-10 py-2">
								Launch App
							</Link>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;
