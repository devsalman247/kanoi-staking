"use client";

import { useState } from "react";

export default function Page() {
	const [activeTab, setActiveTab] = useState("nft");

	return (
		<div className="market-bg">
			<div className="flex-grow mb-28">
				<main>
					<div className="container px-5 py-5 mx-auto">
						<div className="container flex flex-col flex-wrap justify-between">
							<div className="py-[14px] basis-1">
								<h1 className="text-3xl font-bold text-center text-black uppercase font-header">Market Tools</h1>
							</div>
							<div className="py-[14px] basis-1">
								<p className="max-w-2xl mx-auto text-center text-slate-500 text-xl">
									Use ApeStake.io’s Market Tools search feature to see whether a BAYC, MAYC, or BAKC is committed to a staking position, how much $APE is staked with it, and the associated wallet
									address.
								</p>
							</div>
						</div>
						<div className="container flex flex-col items-center justify-center text-center py-7">
							<div className="flex flex-col justify-center w-full md:w-2/3 max-w-[550px]">
								<div className="flex justify-start px-2 py-1">
									<div className="mr-1">
										<div>
											<button
												onClick={() => setActiveTab("nft")}
												className={`py-2 px-4 border-blue-100 font-bold uppercase rounded-lg rounded-tab text-sm h-[36px] max-h-[36px] border ${
													activeTab === "nft" ? "bg-blue-100 text-[#e8833a]" : "bg-white text-slate-500"
												}`}
												aria-current="page">
												By NFT ID
											</button>
										</div>
									</div>
									<div>
										<button
											onClick={() => setActiveTab("address")}
											className={`py-2 px-4 text-slate-500 hover:text-slate-600 border-grey-light font-bold uppercase rounded-lg rounded-tab text-sm h-[36px] max-h-[36px] border ${
												activeTab === "address" ? "bg-blue-100 text-[#e8833a]" : "bg-white text-slate-500"
											}`}
											aria-current="page">
											By Address
										</button>
									</div>
								</div>
								<form className="flex flex-col w-full px-2 py-3 md:flex-row">
									<div className="mt-1 md:mr-3 md:mt-0 md:basis-full w-3/5">
										<input
											type="text"
											placeholder={activeTab === "nft" ? "Paste NFT ID" : "Paste Address"}
											id="initial-stake-deposit-searchNftId"
											className="rounded-lg border-1 focus:outline-none focus:ring-[#e8833a] focus:border-[#e8833a] block w-full text-sm border-grey-light/[.2] p-2 w-full px-3 py-2 text-slate-600 mb-4 md:mb-0"
											name="nftId"
										/>
										<p className="mt-1">&nbsp;</p>
									</div>
									<div className="w-full md:w-2/5 md:shrink-0">
										<button
											className="rounded border-2 uppercase px-5 py-2.5 mb-2 text-center font-bold text-xs disabled:cursor-not-allowed transition-colors bg-[#e8833a] text-white border-white-200 hover:bg-[#e8833a] focus:bg-[#e8833a] hover:border-[#e8833a] hover:border-[#e8833a] disabled:bg-grey w-full"
											type="submit">
											Check Value
										</button>
									</div>
								</form>
							</div>
							<div className="container flex flex-col flex-wrap justify-center py-5 my-5 lg:flex-row">
								<p className="text-center text-slate-500 text-lg">There are no staking positions or NFTs that match your search criteria</p>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
