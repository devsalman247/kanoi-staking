"use client";
import Image from "next/image";
import Decimal from "decimal.js";
import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import {
	STAKING_CONTRACT_ADDRESS,
	KANOI_CONTRACT_ADDRESS,
	SAISEN_CONTRACT_ADDRESS,
	STAKING_CONTRACT_ABI,
	KANOI_CONTRACT_ABI,
	SAISEN_CONTRACT_ABI,
	STAKING_CONTRACT_CONFIG,
	KANOI_CONTRACT_CONFIG,
	SAISEN_CONTRACT_CONFIG,
	POOLS,
} from "../../../constants";

export default function Page() {
	const poolInfoData = useReadContracts({
		contracts: POOLS.map((pool) => ({
			...STAKING_CONTRACT_CONFIG,
			functionName: "poolInfo",
			args: [pool],
		})),
	});

	const { kanoiTotalStaked, saisenTotalStaked, kanoiPossibleRewards, saisenPossibleRewards } = useMemo(() => {
		let kanoiTotalStaked = 0;
		let saisenTotalStaked = 0;
		let kanoiPossibleRewards = 0;
		let saisenPossibleRewards = 0;
		if (!poolInfoData.data || poolInfoData.data?.length === 0)
			return {
				kanoiTotalStaked,
				saisenTotalStaked,
				kanoiPossibleRewards,
				saisenPossibleRewards,
			};

		const kanoiMaxApy = new Decimal(poolInfoData.data[4].result[3].toString());
		const saisenMaxApy = new Decimal(poolInfoData.data[9].result[3].toString());

		kanoiTotalStaked = poolInfoData.data
			.slice(0, 5)
			.reduce((acc, pool) => acc.add(new Decimal(pool.result[2].toString())), new Decimal(0));
		saisenTotalStaked = poolInfoData.data
			.slice(5, 10)
			.reduce((acc, pool) => acc.add(new Decimal(pool.result[2].toString())), new Decimal(0));

		kanoiPossibleRewards = kanoiTotalStaked.mul(kanoiMaxApy).div(100).div(365).div(1e18).toFixed(2);
		saisenPossibleRewards = saisenTotalStaked.mul(saisenMaxApy).div(100).div(365).div(1e18).toFixed(2);
		console.log("🚀 ~ Page ~ poolInfoData.data:", kanoiPossibleRewards, saisenPossibleRewards);

		return {
			kanoiTotalStaked: kanoiTotalStaked.div(1e18).toFixed(2),
			saisenTotalStaked: saisenTotalStaked.div(1e18).toFixed(2),
			kanoiPossibleRewards,
			saisenPossibleRewards,
		};
	}, [poolInfoData.data]);

	return (
		<div className="pools-bg">
			<div className="flex-grow pb-28">
				<div className="container flex flex-col flex-wrap justify-between">
					<div className="py-[14px] basis-1">
						<h1 className="text-3xl font-bold text-center text-black uppercase font-header">Pools and Allocation</h1>
					</div>
					<div className="py-[14px] basis-1">
						<p className="max-w-2xl mx-auto text-center text-grey-light text-xl">
							Below is a quick reference summary of the available pools and staking limits, and while your choices
							depend on what you have in your wallet, we’re happy to say that there’s an option for everyone.
						</p>
					</div>
				</div>
				<div className="container">
					<div className="hidden mt-10 mb-2 text-grey-light md:block">
						<div className="flex flex-row items-center hidden xl:flex justify-between">
							<div className="w-full md:w-4/12 md:max-w-[311px] pl-6">
								<p className="text-xs text-gray-400 uppercase">Pool</p>
							</div>
							<div className="w-full md:w-4/12 md:max-w-[230px]">
								<p className="text-xs text-gray-400 uppercase">About</p>
							</div>
							<div className="w-full md:w-1/12">
								<div className="text-xs text-gray-400 uppercase xl:flex">
									<p>total staked</p>
									<div className="relative">
										<button className="px-1" type="button" aria-expanded="false">
											<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M8 7.33398V10.6673"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
											</svg>
										</button>
									</div>
								</div>
							</div>
							<div className="w-full md:w-1/12">
								<div className="text-xs text-gray-400 uppercase xl:flex">
									<p>Possible Rewards</p>
									<div className="relative">
										<button className="px-1" type="button" aria-expanded="false">
											<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M8 7.33398V10.6673"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
											</svg>
										</button>
									</div>
								</div>
							</div>
							<div className="w-full md:w-1/12">
								<div className="text-xs text-gray-400 uppercase xl:flex">
									<p>Cap</p>
									<div className="relative">
										<button className="px-1" type="button" aria-expanded="false">
											<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M8 7.33398V10.6673"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
											</svg>
										</button>
									</div>
								</div>
							</div>
							<div className="w-full md:w-1/12">
								<div className="text-xs text-gray-400 uppercase xl:flex">
									<p>Commitment</p>
									<div className="relative">
										<button className="px-1" type="button" aria-expanded="false">
											<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M8 7.33398V10.6673"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
											</svg>
										</button>
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-row flex flex-col items-center xl:hidden md:flex-row">
							<div className="w-full md:w-3/12 px-6">
								<p className="text-xs text-gray-400 uppercase">Pool</p>
							</div>
							<div className="w-full md:w-5/12 px-6">
								<p className="text-xs text-gray-400 uppercase">About</p>
							</div>
							<div className="w-full md:w-4/12 px-6"></div>
						</div>
					</div>
				</div>

				<div className="container">
					<div className="py-8 my-5 bg-white border rounded border-grey-200 text-grey-light">
						<div className="flex flex-row items-center hidden xl:flex justify-between">
							<div className="w-full md:w-4/12 md:max-w-[311px] pl-6">
								<div className="flex flex-col xl:flex-row">
									<p className="flex my-5 text-xs uppercase md:hidden text-grey-light flex-inline">Available Pool</p>
									<div className="hidden xl:block">
										<Image
											alt="Ape Coin"
											src="/apecoin-pool-image.png"
											className="min-w-[172px] min-h-[172px] w-[172px] h-[172px]"
											height={172}
											width={172}
										/>
									</div>
									<div className="flex flex-col justify-center xl:px-5">
										<div className="my-auto">
											<h1 className="text-xl font-bold text-black uppercase">
												KANOICOIN
												<br className="hidden md:block" />
												($kANOI){" "}
											</h1>
										</div>
									</div>
									<div className="block xl:hidden">
										<Image
											alt="Ape Coin"
											src="/apecoin-pool-image.png"
											className="min-w-[172px] min-h-[172px] w-[172px] h-[172px]"
											height={172}
											width={172}
										/>
									</div>
								</div>
							</div>
							<div className="w-full md:w-4/12 md:max-w-[230px]">
								<p className="flex my-5 text-xs uppercase md:hidden text-grey-light flex-inline">About</p>
								<p className="my-3 text-sm text-justify">
									As long as you have at least one $KANOI in your wallet, you can stake and start accruing rewards. No
									NFTs required.
								</p>
							</div>
							<div className="w-full md:w-1/12">
								<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
									<p>total staked</p>
									<div className="relative" data-headlessui-state="">
										<button
											className="px-1"
											id="headlessui-popover-button-:r52:"
											type="button"
											aria-expanded="false"
											data-headlessui-state="">
											<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path d="M8 7.33398V10.6673" stroke="#F6688C" strokeLinecap="round" strokeLinejoin="round" />
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</button>
									</div>
								</div>
								<b className="text-grey-dark">{kanoiTotalStaked}</b>
								<p className="text-xs uppercase">
									$KANOI <br />
								</p>
							</div>
							<div className="w-full md:w-1/12">
								<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
									<p>Possible Rewards</p>
									<div className="relative" data-headlessui-state="">
										<button
											className="px-1"
											id="headlessui-popover-button-:r55:"
											type="button"
											aria-expanded="false"
											data-headlessui-state="">
											<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path d="M8 7.33398V10.6673" stroke="#F6688C" strokeLinecap="round" strokeLinejoin="round" />
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</button>
									</div>
								</div>
								<b className="text-grey-dark">{kanoiPossibleRewards}</b>
								<br />
								<p className="text-xs uppercase">
									$KANOI <br />
									(per 24H)
								</p>
							</div>
							<div className="w-full md:w-1/12">
								<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
									<p>Cap</p>
									<div className="relative" data-headlessui-state="">
										<button
											className="px-1"
											id="headlessui-popover-button-:r58:"
											type="button"
											aria-expanded="false"
											data-headlessui-state="">
											<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path d="M8 7.33398V10.6673" stroke="#F6688C" strokeLinecap="round" strokeLinejoin="round" />
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</button>
									</div>
								</div>
								<b className="text-grey-dark">None</b>
							</div>
							<div className="w-full md:w-1/12 text-right pr-6">
								<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
									<p>Commitment</p>
									<div className="relative" data-headlessui-state="">
										<button
											className="px-1"
											id="headlessui-popover-button-:r5b:"
											type="button"
											aria-expanded="false"
											data-headlessui-state="">
											<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path d="M8 7.33398V10.6673" stroke="#F6688C" strokeLinecap="round" strokeLinejoin="round" />
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</button>
									</div>
								</div>
								<b className="text-grey-dark">KanoiCoin</b>
							</div>
						</div>
						<div className="flex flex-col items-center xl:hidden md:flex-row">
							<div className="w-full md:w-3/12 px-6">
								<div className="flex flex-col xl:flex-row">
									<p className="flex my-5 text-xs uppercase md:hidden text-grey-light flex-inline">Available Pool</p>
									<div className="hidden xl:block">
										<Image
											alt="Ape Coin"
											src="/apecoin-pool-image.png"
											className="min-w-[172px] min-h-[172px] w-[172px] h-[172px]"
											height={172}
											width={172}
										/>
									</div>
									<div className="flex flex-col justify-center xl:px-5">
										<div className="my-auto">
											<h1 className="text-xl font-bold text-black uppercase">
												APECOIN
												<br className="hidden md:block" />
												($APE){" "}
											</h1>
										</div>
									</div>
									<div className="block xl:hidden">
										<Image
											alt="Ape Coin"
											src="/apecoin-pool-image.png"
											className="min-w-[172px] min-h-[172px] w-[172px] h-[172px]"
											height={172}
											width={172}
										/>
									</div>
								</div>
							</div>
							<div className="w-full md:w-5/12 px-6">
								<p className="flex my-5 text-xs uppercase md:hidden text-grey-light flex-inline">About</p>
								<p className="my-3 text-sm text-justify">
									As long as you have at least one $APE in your wallet, you can stake and start accruing rewards. No
									NFTs required.
								</p>
							</div>
							<div className="w-full md:w-4/12 px-6">
								<div className="flex flex-col justify-center">
									<div className="items-center w-full py-8">
										<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
											<p>total staked</p>
											<div className="relative" data-headlessui-state="">
												<button
													className="px-1"
													id="headlessui-popover-button-:r5e:"
													type="button"
													aria-expanded="false"
													data-headlessui-state="">
													<svg
														width={16}
														height={16}
														viewBox="0 0 16 16"
														fill="none"
														xmlns="http://www.w3.org/2000/svg">
														<path
															d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M8 7.33398V10.6673"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</button>
											</div>
										</div>
										<b className="text-grey-dark">89,482,136.3</b>
										<p className="text-xs uppercase">
											$APE <br />
										</p>
									</div>
									<div className="items-center w-full pb-8">
										<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
											<p>Possible Rewards</p>
											<div className="relative" data-headlessui-state="">
												<button
													className="px-1"
													id="headlessui-popover-button-:r5h:"
													type="button"
													aria-expanded="false"
													data-headlessui-state="">
													<svg
														width={16}
														height={16}
														viewBox="0 0 16 16"
														fill="none"
														xmlns="http://www.w3.org/2000/svg">
														<path
															d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M8 7.33398V10.6673"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</button>
											</div>
										</div>
										<b className="text-grey-dark">0.00045</b>
										<br />
										<p className="text-xs uppercase">
											$APE <br />
											(per 24H)
										</p>
									</div>
									<div className="items-center w-full pb-8">
										<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
											<p>Cap</p>
											<div className="relative" data-headlessui-state="">
												<button
													className="px-1"
													id="headlessui-popover-button-:r5k:"
													type="button"
													aria-expanded="false"
													data-headlessui-state="">
													<svg
														width={16}
														height={16}
														viewBox="0 0 16 16"
														fill="none"
														xmlns="http://www.w3.org/2000/svg">
														<path
															d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M8 7.33398V10.6673"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</button>
											</div>
										</div>
										<b className="text-grey-dark">None</b>
									</div>
									<div className="items-center w-full">
										<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
											<p>Commitment</p>
											<div className="relative" data-headlessui-state="">
												<button
													className="px-1"
													id="headlessui-popover-button-:r5n:"
													type="button"
													aria-expanded="false"
													data-headlessui-state="">
													<svg
														width={16}
														height={16}
														viewBox="0 0 16 16"
														fill="none"
														xmlns="http://www.w3.org/2000/svg">
														<path
															d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M8 7.33398V10.6673"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</button>
											</div>
										</div>
										<b className="text-grey-dark">ApeCoin</b>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="py-8 my-5 bg-white border rounded border-grey-200 text-grey-light">
						<div className="d-flex flex-row items-center hidden xl:flex justify-between">
							<div className="w-full md:w-4/12 md:max-w-[311px] pl-6">
								<div className="flex flex-col xl:flex-row">
									<p className="flex my-5 text-xs uppercase md:hidden text-grey-light flex-inline">Available Pool</p>
									<div className="hidden xl:block">
										<Image
											alt="Ape Coin"
											src="/apecoin-pool-image.png"
											className="min-w-[172px] min-h-[172px] w-[172px] h-[172px]"
											height={172}
											width={172}
										/>
									</div>
									<div className="flex flex-col justify-center xl:px-5">
										<div className="my-auto">
											<h1 className="text-xl font-bold text-black uppercase">
												SAISEN
												<br className="hidden md:block" />
												($SAISEN){" "}
											</h1>
										</div>
									</div>
									<div className="block xl:hidden">
										<Image
											alt="Ape Coin"
											src="/apecoin-pool-image.png"
											className="min-w-[172px] min-h-[172px] w-[172px] h-[172px]"
											height={172}
											width={172}
										/>
									</div>
								</div>
							</div>
							<div className="w-full md:w-4/12 md:max-w-[230px]">
								<p className="flex my-5 text-xs uppercase md:hidden text-grey-light flex-inline">About</p>
								<p className="my-3 text-sm text-justify">
									As long as you have at least one $SAISEN in your wallet, you can stake and start accruing rewards. No
									NFTs required.
								</p>
							</div>
							<div className="w-full md:w-1/12">
								<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
									<p>total staked</p>
									<div className="relative" data-headlessui-state="">
										<button
											className="px-1"
											id="headlessui-popover-button-:r52:"
											type="button"
											aria-expanded="false"
											data-headlessui-state="">
											<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path d="M8 7.33398V10.6673" stroke="#F6688C" strokeLinecap="round" strokeLinejoin="round" />
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</button>
									</div>
								</div>
								<b className="text-grey-dark">{saisenTotalStaked}</b>
								<p className="text-xs uppercase">
									$SAISEN <br />
								</p>
							</div>
							<div className="w-full md:w-1/12">
								<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
									<p>Possible Rewards</p>
									<div className="relative" data-headlessui-state="">
										<button
											className="px-1"
											id="headlessui-popover-button-:r55:"
											type="button"
											aria-expanded="false"
											data-headlessui-state="">
											<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path d="M8 7.33398V10.6673" stroke="#F6688C" strokeLinecap="round" strokeLinejoin="round" />
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</button>
									</div>
								</div>
								<b className="text-grey-dark">{saisenPossibleRewards}</b>
								<br />
								<p className="text-xs uppercase">
									$SAISEN <br />
									(per 24H)
								</p>
							</div>
							<div className="w-full md:w-1/12">
								<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
									<p>Cap</p>
									<div className="relative" data-headlessui-state="">
										<button
											className="px-1"
											id="headlessui-popover-button-:r58:"
											type="button"
											aria-expanded="false"
											data-headlessui-state="">
											<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path d="M8 7.33398V10.6673" stroke="#F6688C" strokeLinecap="round" strokeLinejoin="round" />
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</button>
									</div>
								</div>
								<b className="text-grey-dark">None</b>
							</div>
							<div className="w-full md:w-1/12 text-right pr-6">
								<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
									<p>Commitment</p>
									<div className="relative" data-headlessui-state="">
										<button
											className="px-1"
											id="headlessui-popover-button-:r5b:"
											type="button"
											aria-expanded="false"
											data-headlessui-state="">
											<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path d="M8 7.33398V10.6673" stroke="#F6688C" strokeLinecap="round" strokeLinejoin="round" />
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</button>
									</div>
								</div>
								<b className="text-grey-dark">SaisenCoin</b>
							</div>
						</div>
						<div className="flex flex-col items-center xl:hidden md:flex-row">
							<div className="w-full md:w-3/12 px-6">
								<div className="flex flex-col xl:flex-row">
									<p className="flex my-5 text-xs uppercase md:hidden text-grey-light flex-inline">Available Pool</p>
									<div className="hidden xl:block">
										<Image
											alt="Ape Coin"
											src="/apecoin-pool-image.png"
											className="min-w-[172px] min-h-[172px] w-[172px] h-[172px]"
											height={172}
											width={172}
										/>
									</div>
									<div className="flex flex-col justify-center xl:px-5">
										<div className="my-auto">
											<h1 className="text-xl font-bold text-black uppercase">
												APECOIN
												<br className="hidden md:block" />
												($APE){" "}
											</h1>
										</div>
									</div>
									<div className="block xl:hidden">
										<Image
											alt="Ape Coin"
											src="/apecoin-pool-image.png"
											className="min-w-[172px] min-h-[172px] w-[172px] h-[172px]"
											height={172}
											width={172}
										/>
									</div>
								</div>
							</div>
							<div className="w-full md:w-5/12 px-6">
								<p className="flex my-5 text-xs uppercase md:hidden text-grey-light flex-inline">About</p>
								<p className="my-3 text-sm text-justify">
									As long as you have at least one $APE in your wallet, you can stake and start accruing rewards. No
									NFTs required.
								</p>
							</div>
							<div className="w-full md:w-4/12 px-6">
								<div className="flex flex-col justify-center">
									<div className="items-center w-full py-8">
										<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
											<p>total staked</p>
											<div className="relative" data-headlessui-state="">
												<button
													className="px-1"
													id="headlessui-popover-button-:r5e:"
													type="button"
													aria-expanded="false"
													data-headlessui-state="">
													<svg
														width={16}
														height={16}
														viewBox="0 0 16 16"
														fill="none"
														xmlns="http://www.w3.org/2000/svg">
														<path
															d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M8 7.33398V10.6673"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</button>
											</div>
										</div>
										<b className="text-grey-dark">89,482,136.3</b>
										<p className="text-xs uppercase">
											$APE <br />
										</p>
									</div>
									<div className="items-center w-full pb-8">
										<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
											<p>Possible Rewards</p>
											<div className="relative" data-headlessui-state="">
												<button
													className="px-1"
													id="headlessui-popover-button-:r5h:"
													type="button"
													aria-expanded="false"
													data-headlessui-state="">
													<svg
														width={16}
														height={16}
														viewBox="0 0 16 16"
														fill="none"
														xmlns="http://www.w3.org/2000/svg">
														<path
															d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M8 7.33398V10.6673"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</button>
											</div>
										</div>
										<b className="text-grey-dark">0.00045</b>
										<br />
										<p className="text-xs uppercase">
											$APE <br />
											(per 24H)
										</p>
									</div>
									<div className="items-center w-full pb-8">
										<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
											<p>Cap</p>
											<div className="relative" data-headlessui-state="">
												<button
													className="px-1"
													id="headlessui-popover-button-:r5k:"
													type="button"
													aria-expanded="false"
													data-headlessui-state="">
													<svg
														width={16}
														height={16}
														viewBox="0 0 16 16"
														fill="none"
														xmlns="http://www.w3.org/2000/svg">
														<path
															d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M8 7.33398V10.6673"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</button>
											</div>
										</div>
										<b className="text-grey-dark">None</b>
									</div>
									<div className="items-center w-full">
										<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
											<p>Commitment</p>
											<div className="relative" data-headlessui-state="">
												<button
													className="px-1"
													id="headlessui-popover-button-:r5n:"
													type="button"
													aria-expanded="false"
													data-headlessui-state="">
													<svg
														width={16}
														height={16}
														viewBox="0 0 16 16"
														fill="none"
														xmlns="http://www.w3.org/2000/svg">
														<path
															d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M8 7.33398V10.6673"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
															stroke="#F6688C"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</button>
											</div>
										</div>
										<b className="text-grey-dark">ApeCoin</b>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="py-8 my-5 bg-white border rounded hidden border-grey-200 text-grey-light">
						<div className="flex flex-row items-center  xl:flex justify-between">
							<div className="w-full md:w-4/12 md:max-w-[311px] pl-6">
								<div className="flex flex-col xl:flex-row">
									<p className="flex my-5 text-xs uppercase md:hidden text-grey-light flex-inline">Available Pool</p>
									<div className="hidden xl:block">
										<Image
											alt="Ape Coin"
											src="/apecoin-pool-image.png"
											className="min-w-[172px] min-h-[172px] w-[172px] h-[172px]"
											height="172"
											width="172"
										/>
									</div>
									<div className="flex flex-col justify-center xl:px-5">
										<div className="my-auto">
											<h1 className="text-xl font-bold text-black uppercase">
												KANOICOIN
												<br className="hidden md:block" />
												($KANOI)
											</h1>
										</div>
									</div>
									<div className="block xl:hidden">
										<Image
											alt="Ape Coin"
											src="/apecoin-pool-image.png"
											className="min-w-[172px] min-h-[172px] w-[172px] h-[172px]"
											height="172"
											width="172"
										/>
									</div>
								</div>
							</div>
							<div className="w-full md:w-4/12 md:max-w-[230px]">
								<p className="flex my-5 text-xs uppercase md:hidden text-grey-light flex-inline">About</p>
								<p className="my-3 text-sm text-justify">
									As long as you have at least one $KANOI in your wallet, you can stake and start accruing rewards. No
									NFTs required.
								</p>
							</div>
							<div className="w-full md:w-1/12">
								<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
									<p>total staked</p>
									<div className="relative">
										<button className="px-1" id="headlessui-popover-button-:r1td:" type="button" aria-expanded="false">
											<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M8 7.33398V10.6673"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
											</svg>
										</button>
									</div>
								</div>
								<b className="text-grey-dark">89,276,977.69</b>
								<p className="text-xs uppercase">
									$KANOI <br />
								</p>
							</div>
							<div className="w-full md:w-1/12">
								<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
									<p>Possible Rewards</p>
									<div className="relative">
										<button className="px-1" id="headlessui-popover-button-:r1tg:" type="button" aria-expanded="false">
											<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M8 7.33398V10.6673"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
											</svg>
										</button>
									</div>
								</div>
								<b className="text-grey-dark">0.00045</b>
								<br />
								<p className="text-xs uppercase">
									$KANOI <br />
									(per 24H)
								</p>
							</div>
							<div className="w-full md:w-1/12">
								<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
									<p>Cap</p>
									<div className="relative">
										<button className="px-1" type="button" aria-expanded="false">
											<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M8 7.33398V10.6673"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
											</svg>
										</button>
									</div>
								</div>
								<b className="text-grey-dark">None</b>
							</div>
							<div className="w-full md:w-1/12 text-right pr-6">
								<div className="flex text-xs uppercase xl:hidden text-grey-light flex-inline">
									<p>Commitment</p>
									<div className="relative">
										<button className="px-1" type="button" aria-expanded="false">
											<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M8 7.33398V10.6673"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
												<path
													d="M7.9668 5.33398H8.03346V5.40065H7.9668V5.33398Z"
													stroke="#F6688C"
													strokeLinecap="round"
													strokeLinejoin="round"></path>
											</svg>
										</button>
									</div>
								</div>
								<b className="text-grey-dark">KanoiCoin</b>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
