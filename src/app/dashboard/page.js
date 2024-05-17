/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Collapse from "react-bootstrap/Collapse";
import ConnectButton from "@/components/ui/walletConnect";
import Custom from "@/components/ui/custom";
import { useAccount, useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
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
} from "../../constants";
import Decimal from "decimal.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const coinMap = {
	kanoi: {
		oneMonth: 0,
		twoMonth: 1,
		threeMonth: 2,
		sixMonth: 3,
		twelveMonth: 4,
	},
	saisen: {
		oneMonth: 5,
		twoMonth: 6,
		threeMonth: 7,
		sixMonth: 8,
		twelveMonth: 9,
	},
};

const durationMap = {
	0: 30 * 24 * 60 * 60,
	1: 60 * 24 * 60 * 60,
	2: 90 * 24 * 60 * 60,
	3: 180 * 24 * 60 * 60,
	4: 365 * 24 * 60 * 60,
	5: 30 * 24 * 60 * 60,
	6: 60 * 24 * 60 * 60,
	7: 90 * 24 * 60 * 60,
	8: 180 * 24 * 60 * 60,
	9: 365 * 24 * 60 * 60,
};

const monthMap = {
	1: "January",
	2: "February",
	3: "March",
	4: "April",
	5: "May",
	6: "June",
	7: "July",
	8: "August",
	9: "September",
	10: "October",
	11: "November",
	12: "December",
};

export default function Page() {
	const notify = (type, message) => (type === "error" ? toast.error(message) : toast.success(message));
	const [activeTab, setActiveTab] = useState("kanoi");
	const [show, setShow] = useState(false);
	const [stakeActiveTab, setStakeActiveTab] = useState({ coin: "kanoi", duration: "oneMonth" });
	const [stakeIsCollapse, setStakeIsCollapse] = useState(false);
	const handleClose = () => !isStaking && setShow(false);
	const handleShow = () => setShow(true);
	const { address, isConnected } = useAccount();
	const [stakingAmount, setStakingAmount] = useState("");
	const [isStaking, setIsStaking] = useState(false);
	const [stakingRecordsMap, setStakingRecordsMap] = useState([]);

	const getDepositedAmount = (amount) =>
		new Decimal(amount).div(1e18).greaterThanOrEqualTo(new Decimal("0.1"))
			? new Decimal(amount).div(1e18).toString()
			: "<0.1";

	const getUnlockedDate = (timestamp) => {
		const currentTime = Date.now();
		const unlockTime = Number(timestamp) * 1000;

		if (currentTime >= unlockTime) {
			return "Unlocked";
		} else {
			const timeLeft = unlockTime - currentTime;

			// Calculate days, hours, minutes, seconds from the time left
			const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
			const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

			// Format the time left string
			if (days > 0) {
				return `in ${days} days`;
			} else if (hours > 0) {
				return `in ${hours} hours`;
			} else if (minutes > 0) {
				return `in ${minutes} minutes`;
			} else {
				return `in ${seconds} seconds`;
			}
		}
	};

	const getStakedDate = (poolIndex, timestamp) => {
		const stakedDuration = durationMap[poolIndex] * 1000;
		const stakedTime = Number(timestamp) * 1000 - stakedDuration;

		const date = new Date(stakedTime);
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();

		return `${day} ${monthMap[month]} ${year}`;
	};

	const handleChange = (event) => {
		const value = event.target.value;
		// Allow numbers and dot but only if dot doesn't start the string
		if (value === "" || /^\d*\.?\d*$/.test(value)) {
			setStakingAmount(value);
		} else {
			// If input is invalid, revert to the last valid value
			event.target.value = value.slice(0, -1);
			setStakingAmount(value.slice(0, -1));
		}
	};

	const handleKeyDown = (event) => {
		// Prevent 'e', 'E', '+', '-', and multiple dots
		if (["e", "E", "+"].includes(event.key)) {
			event.preventDefault();
		} else if (event.key === "-") {
			event.preventDefault();
		} else if (event.key === "." && event.target.value.includes(".")) {
			event.preventDefault();
		}
	};

	const handlePaste = (event) => {
		const pasteData = event.clipboardData.getData("text").trim();
		if (!/^\d*\.?\d*$/.test(pasteData)) {
			event.preventDefault();
		}
	};

	const allowanceData = useReadContracts({
		contracts: [
			{
				...KANOI_CONTRACT_CONFIG,
				functionName: "allowance",
				args: [address, STAKING_CONTRACT_ADDRESS],
			},
			{
				...SAISEN_CONTRACT_CONFIG,
				functionName: "allowance",
				args: [address, STAKING_CONTRACT_ADDRESS],
			},
		],
	});

	const balanceData = useReadContracts({
		contracts: [
			{
				...KANOI_CONTRACT_CONFIG,
				functionName: "balanceOf",
				args: [address],
			},
			{
				...SAISEN_CONTRACT_CONFIG,
				functionName: "balanceOf",
				args: [address],
			},
		],
	});
	const { kanoiBalance, saisenBalance, kanoiBalFormatted, saisenBalFormatted } = useMemo(() => {
		if (!balanceData.data || balanceData.data?.length === 0 || !address)
			return { kanoiBalance: "0", saisenBalance: "0", kanoiBalFormatted: "0", saisenBalFormatted: "0" };
		const kanoiBalance = new Decimal(balanceData.data[0].result.toString()).div(1e18);
		const saisenBalance = new Decimal(balanceData.data[1].result.toString()).div(1e18);
		const factor = new Decimal(100);
		const kanoiBalFormatted = kanoiBalance.mul(factor).floor().div(factor);
		const saisenBalFormatted = saisenBalance.mul(factor).floor().div(factor);
		return { kanoiBalance, saisenBalance, kanoiBalFormatted, saisenBalFormatted };
	}, [balanceData.data]);

	const poolInfoData = useReadContracts({
		contracts: POOLS.map((pool) => ({
			...STAKING_CONTRACT_CONFIG,
			functionName: "poolInfo",
			args: [pool],
		})),
	});

	const estimatedAPY = useMemo(() => {
		if (!poolInfoData.data || poolInfoData.data?.length === 0 || !poolInfoData.data[0]?.result) return "--";
		const poolInfo = poolInfoData.data.map((pool) => {
			if (pool.error) return pool;
			const [depositToken, rewardToken, depositedAmount, apy, lockDays] = pool.result;
			return {
				depositToken,
				rewardToken,
				depositedAmount,
				apy,
				lockDays,
			};
		});

		switch (stakeActiveTab.duration) {
			case "oneMonth":
				return poolInfo[stakeActiveTab.coin === "kanoi" ? 0 : 5].apy;
			case "twoMonth":
				return poolInfo[stakeActiveTab.coin === "kanoi" ? 1 : 6].apy;
			case "threeMonth":
				return poolInfo[stakeActiveTab.coin === "kanoi" ? 2 : 7].apy;
			case "sixMonth":
				return poolInfo[stakeActiveTab.coin === "kanoi" ? 3 : 8].apy;
			case "twelveMonth":
				return poolInfo[stakeActiveTab.coin === "kanoi" ? 4 : 9].apy;
			default:
				return "--";
		}
	}, [stakeActiveTab, poolInfoData.data]);

	const formatNumber = (numStr) => {
		const num = parseFloat(numStr);

		if (isNaN(num)) {
			return numStr;
		}

		if (Number.isInteger(num)) {
			return num.toString();
		} else {
			if (numStr.includes("e")) {
				const exponent = numStr.split("e")[1];
				if (exponent < 0) {
					return "< 0.01";
				}
				return numStr;
			}
			let significantDigits = numStr.split("e")[0].match(/^-?\d*\.?0*\d{0,2}/)[0];
			return significantDigits;
		}
	};

	const pendingRewardsData = useReadContracts({
		contracts: stakingRecordsMap.map((record) => ({
			...STAKING_CONTRACT_CONFIG,
			functionName: "pendingReward",
			args: [record.poolId, address, record.recordId],
		})),
	});

	const getPendingReward = (poolIndex) => {
		if (!pendingRewardsData.data || pendingRewardsData.data?.length === 0 || !address) return "--";
		const pendingRewards = pendingRewardsData.data[poolIndex].result.toString();
		return formatNumber(new Decimal(pendingRewards).div(1e18).toString());
	};

	const totalPendingRewards = useMemo(() => {
		if (!pendingRewardsData.data || pendingRewardsData.data?.length === 0 || !address) return "0";
		const rewards = pendingRewardsData.data.filter((record) => record.result).map((record) => record.result);
		if (rewards.length === 0) return "0";

		let totalReward = rewards.reduce((acc, reward) => {
			const rewardAmount = new Decimal(reward.toString());
			return acc.add(rewardAmount);
		}, new Decimal(0));

		return formatNumber(totalReward.div(1e18).toString());
	}, [pendingRewardsData.data, activeTab]);

	const getDailyReward = (poolIndex, amountDeposited) => {
		if (!poolInfoData.data || poolInfoData.data?.length === 0 || !address) return "--";
		const apy = new Decimal(poolInfoData.data[poolIndex].result[3].toString());
		const depositedAmount = new Decimal(amountDeposited.toString()).div(1e18);
		const yearlyReward = apy.mul(depositedAmount).dividedBy(100);
		const dailyReward = yearlyReward.div(365);
		return formatNumber(dailyReward.toString());
	};

	const stakingRecordIds = useReadContract({
		...STAKING_CONTRACT_CONFIG,
		functionName: "getRecordIds",
		args: [address],
	});

	const stakingRecordsData = useReadContracts({
		contracts: stakingRecordsMap.map((record) => ({
			...STAKING_CONTRACT_CONFIG,
			functionName: "userInfo",
			args: [record.poolId, address, record.recordId],
		})),
	});

	// Pools Staked Data
	const { hasStakedInPool, poolsData, totalDeposited, totalDepositedFormatted } = useMemo(() => {
		let poolsData = [];
		let hasStakedInPool = false;
		let totalDeposited = new Decimal(0);
		let totalDepositedFormatted = new Decimal(0);

		if (!stakingRecordsData.data)
			return {
				hasStakedInPool,
				poolsData,
				totalDeposited: totalDeposited.toString(),
				totalDepositedFormatted: totalDepositedFormatted.toString(),
			};

		const userStakingRecords = stakingRecordsData.data.filter((record) => record.result).map((record) => record.result);

		// console.log("🚀 ~ Page ~ stakingRecordsData:", userStakingRecords, stakingRecordsData.data);
		if (userStakingRecords.length === 0)
			return {
				hasStakedInPool,
				poolsData,
				totalDeposited: totalDeposited.toString(),
				totalDepositedFormatted: totalDepositedFormatted.toString(),
			};

		userStakingRecords.forEach((record, index) => {
			const [amount, lastRewardAt, unlockTime] = record;
			const zeroDecimalAmount = new Decimal("0");
			const stakedDecimalAmount = new Decimal(amount.toString()).div(1e18);

			if (stakedDecimalAmount.greaterThan(zeroDecimalAmount)) {
				hasStakedInPool = true;
				const poolIndex = stakingRecordsMap[index].poolId;
				const poolInfo = poolInfoData.data[poolIndex].result;
				const [depositToken, rewardToken, depositedAmount, apy, lockDays] = poolInfo;
				const dailyReward = getDailyReward(poolIndex, amount);
				const pendingReward = getPendingReward(poolIndex);
				const depositedAmountFormatted = getDepositedAmount(amount.toString());
				const unlockDate = getUnlockedDate(unlockTime);
				const stakedDate = getStakedDate(poolIndex, unlockTime);

				totalDeposited = totalDeposited.add(new Decimal(amount.toString()));

				poolsData.push({
					depositToken,
					rewardToken,
					depositedAmount: depositedAmountFormatted,
					dailyReward,
					pendingReward,
					unlockDate,
					stakedDate,
					pool: poolIndex,
				});
			}
		});

		totalDepositedFormatted = formatNumber(totalDeposited.div(1e18).toString());
		totalDeposited = totalDeposited.toString();

		// console.log("🚀 ~ Page ~ poolsData:", {
		// 	hasStakedInPool,
		// 	poolsData,
		// 	totalDeposited,
		// 	totalDepositedFormatted,
		// });
		return {
			hasStakedInPool,
			poolsData,
			totalDeposited: totalDeposited.toString(),
			totalDepositedFormatted,
		};
	}, [stakingRecordsData.data]);

	useEffect(() => {
		if (stakingRecordIds.data) {
			const testPools = activeTab === "kanoi" ? POOLS.slice(0, 5) : POOLS.slice(5, 10);
			const recordIds = [];
			stakingRecordIds.data.forEach((record) =>
				testPools.forEach((poolId) => {
					recordIds.push({ recordId: Number(record), poolId });
				})
			);
			setStakingRecordsMap(recordIds);
		}
	}, [stakingRecordIds.data, activeTab]);

	// Write Functions
	const { data: stakingTx, writeContractAsync, error: stakingTxError } = useWriteContract({});
	const { data: stakingTxReceipt } = useWaitForTransactionReceipt({
		hash: stakingTx,
	});

	const stakingWriteTx = useWriteContract({});
	const stakingWriteTxReceipt = useWaitForTransactionReceipt({
		hash: stakingWriteTx.data,
	});

	const stake = async (coin) => {
		try {
			if (
				!stakingAmount ||
				stakingAmount === "0" ||
				Number.isNaN(Number(stakingAmount)) ||
				Number(stakingAmount) <= 0
			) {
				notify("error", "Please enter a valid amount to stake.");
				return;
			}
			const amount = new Decimal(stakingAmount).mul(1e18).toString();
			const contractConfig = coin === "kanoi" ? KANOI_CONTRACT_CONFIG : SAISEN_CONTRACT_CONFIG;
			const contractAddress = coin === "kanoi" ? KANOI_CONTRACT_ADDRESS : SAISEN_CONTRACT_ADDRESS;
			const contractAbi = coin === "kanoi" ? KANOI_CONTRACT_ABI : SAISEN_CONTRACT_ABI;

			const allowance = new Decimal(allowanceData.data[coin === "kanoi" ? 0 : 1].result.toString());
			const balance = new Decimal(balanceData.data[coin === "kanoi" ? 0 : 1].result.toString());
			const amountDec = new Decimal(amount);
			// console.log("🚀 ~ stake ~ amountDec:", amountDec.toString());
			// console.log(
			// 	"🚀 ~ stake ~ balance:",
			// 	allowance.lt(amountDec),
			// 	coin,
			// 	amountDec,
			// 	allowance,
			// 	amountDec.toFixed(18).split(".")[0]
			// );

			if (balance.lt(amountDec)) {
				notify("error", "Insufficient balance.");
				return;
			}

			setIsStaking(true);
			if (allowance.lt(amountDec)) {
				console.log("🚀 ~ stake ~ allowance is less than amount, approving now.", amountDec.toFixed(18).split(".")[0]);
				const result = await writeContractAsync?.({
					abi: contractAbi,
					address: contractAddress,
					functionName: "approve",
					args: [STAKING_CONTRACT_ADDRESS, BigInt(amountDec.toFixed(18).split(".")[0])],
				});
			} else {
				console.log("🚀 ~ stake ~ allowance is greater than amount, staking now.");

				await stakingWriteTx.writeContractAsync?.({
					abi: STAKING_CONTRACT_ABI,
					address: STAKING_CONTRACT_ADDRESS,
					functionName: "deposit",
					args: [coinMap[stakeActiveTab.coin][stakeActiveTab.duration], BigInt(amountDec.toFixed(18).split(".")[0])],
				});
			}
		} catch (error) {
			console.log("🚀 ~ stake ~ error:", error);
			setIsStaking(false);
		}
	};

	useEffect(() => {
		if (stakingTxReceipt) {
			allowanceData.refetch();
			setTimeout(() => {
				const amountDec = new Decimal(stakingAmount).mul(1e18);

				stakingWriteTx.writeContractAsync?.({
					abi: STAKING_CONTRACT_ABI,
					address: STAKING_CONTRACT_ADDRESS,
					functionName: "deposit",
					args: [coinMap[stakeActiveTab.coin][stakeActiveTab.duration], BigInt(amountDec.toFixed(18).split(".")[0])],
				});
			}, 3000);
		}
	}, [stakingTxReceipt]);

	useEffect(() => {
		if (stakingWriteTxReceipt.data) {
			notify("success", "Successfully staked!");
			setIsStaking(false);

			balanceData.refetch();
			stakingRecordIds.refetch();
			allowanceData.refetch();
		}
	}, [stakingWriteTxReceipt.data]);

	useEffect(() => {
		notify("error", stakingTxError?.details);
	}, [stakingTxError?.details]);

	return (
		<div className="flex-grow dashboard-bg pb-[100px] overflow-y-auto">
			{!isConnected && (
				<main>
					<div className="container py-5">
						<div className="flex flex-col px-5 py-5 mt-5 text-center text-black border rounded">
							<h1 className="mt-5 mb-2 text-4xl font-bold uppercase font-header">Connect your wallet</h1>
							<p className="my-5 text-xl text-grey-light">
								As you probably guessed, you will need to connect your wallet in order to start staking.
							</p>
							<div>
								{/* <button
									onClick={() => setIsConnected(true)}
									className="rounded border-2 uppercase px-5 py-2.5 mb-2 text-center font-bold text-xs disabled:cursor-not-allowed transition-colors bg-[#e8833a] text-white border-white-200 hover:bg-[#e8833a] focus:bg-[#e8833a] hover:border-[#e8833a] hover:border-[#e8833a] disabled:bg-grey"
									type="button">
									connect wallet
								</button> */}
								{/* <Custom /> */}
								<ConnectButton />
							</div>
						</div>
					</div>
				</main>
			)}
			{address && isConnected && (
				<>
					<div className="container py-5">
						<div className="hidden md:block">
							<div className="container py-5 mb-12 ">
								<div className="py-5 uppercase">
									<div className="flex flex-row ">
										<div className="w-full md:w-1/3 pr-6">
											<div className="pr-3 text-black">
												<h1 className="text-3xl font-bold uppercase font-header">Dashboard</h1>
												<p className="mt-3 text-base font-normal normal-case text-grey-light">
													Provided is an overview of all of your staked positions. Enter into new positions and manage
													existing positions by depositing, withdrawing, and claiming rewards.
												</p>
											</div>
										</div>
										<div className="w-full md:w-1/3 px-6">
											<div className="px-5 py-5 uppercase bg-white border rounded-lg border-grey-200">
												<div className="flex text-xs text-gray-400 flex-inline">
													<p className="text-grey-light">Total Deposited</p>
													<div className="relative">
														<button className="px-1" id="headlessui-popover-button-:r24b:" type="button">
															<svg
																width="16"
																height="16"
																viewBox="0 0 16 16"
																fill="none"
																xmlns="http://www.w3.org/2000/svg">
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
												<div className="flex mt-3 text-2xl font-bold uppercase text-bold">
													{totalDepositedFormatted} ${activeTab === "kanoi" ? "KANOI" : "SAISEN"}
												</div>
												<div className="flex text-sm text-gray-400">
													<p className="text-grey-light">$0.00</p>
												</div>
											</div>
										</div>
										<div className="w-full md:w-1/3 pl-6">
											<div className="px-5 py-5 uppercase bg-white border rounded-lg border-grey-200">
												<div className="flex text-xs text-gray-400 flex-inline">
													<p className="text-grey-light">Unclaimed Rewards</p>
													<div className="relative">
														<button className="px-1" id="headlessui-popover-button-:r24e:" type="button">
															<svg
																width="16"
																height="16"
																viewBox="0 0 16 16"
																fill="none"
																xmlns="http://www.w3.org/2000/svg">
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
												<div className="flex mt-3 text-2xl font-bold uppercase text-bold">
													{totalPendingRewards} ${activeTab === "kanoi" ? "KANOI" : "SAISEN"}
												</div>
												<div className="flex text-sm text-gray-400">
													<p className="text-grey-light">$0.00</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col justify-start my-6 md:flex-row md:items-center">
							<div className="w-auto">
								<h1 className="mt-1 md:mr-3 py-3 md:py-0 text-2xl font-bold uppercase text-grey-dark">Pools:</h1>
							</div>
							<div className="w-auto flex-grow">
								<div className="flex flex-row justify-start">
									<div className="md:pl-1 md:pr-1 pl-0 pr-2">
										<div>
											<button
												onClick={() => setActiveTab("kanoi")}
												className={`py-2 px-4 border-grey-light font-bold uppercase rounded-lg rounded-tab text-sm h-[36px] max-h-[36px] border ${
													activeTab === "kanoi" ? "bg-blue-100 text-[#e8833a]" : "bg-white text-slate-500"
												}`}
												aria-current="page">
												KANOI
											</button>
										</div>
									</div>
									<div className="md:pl-1 md:pr-1 pl-0 pr-2">
										<div>
											<button
												onClick={() => setActiveTab("saisen")}
												className={`py-2 px-4 border-grey-light font-bold uppercase rounded-lg rounded-tab text-sm h-[36px] max-h-[36px] border ${
													activeTab === "saisen" ? "bg-blue-100 text-[#e8833a]" : "bg-white text-slate-500"
												}`}
												aria-current="page">
												SAISEN
											</button>
										</div>
									</div>
								</div>
							</div>
							<div className="w-auto"></div>
							<div className="md:w-3/12 basis-[100%] md:basis-[auto] md:flex md:flex-row md:justify-end !md:mt-0 mt-4">
								<button
									onClick={handleShow}
									className="rounded border-2 uppercase px-5 py-2.5 mb-2 text-center font-bold text-xs disabled:cursor-not-allowed transition-colors bg-[#e8833a] text-white border-white-200 hover:bg-[#e8833a] focus:bg-[#e8833a] hover:border-[#e8833a] disabled:bg-grey w-full md:w-[150px]"
									type="button">
									<span className="flex items-center justify-center">
										<p className="mb-0">Stake</p>
									</span>
								</button>
							</div>
						</div>
						<div className="hidden md:block">
							<div className="px-4">
								<div className="flex flex-row flex-wrap md:flex-nowrap items-start md:items-center ">
									<div className="md:w-2/12 basis-[50%] md:basis-[auto] mb-6 md:mb-0 xl:mr-4">
										<div className="flex pb-2 text-xs uppercase text-grey-light">
											<p>Asset</p>
										</div>
									</div>
									<div className="md:w-2/12 basis-[50%] md:basis-[auto] mb-6 md:mb-0">
										<div className="flex pb-2 text-xs uppercase text-grey-light">
											<p>Rewards 24H</p>
											<div className="relative">
												<button className="px-1" type="button">
													<svg
														width="16"
														height="16"
														viewBox="0 0 16 16"
														fill="none"
														xmlns="http://www.w3.org/2000/svg">
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
									<div className="md:w-1/12 basis-[50%] md:basis-[auto] mb-6 md:mb-0">
										<div className="flex pb-2 text-xs uppercase text-grey-light">
											<p>Unclaimed</p>
											<div className="relative">
												<button className="px-1" type="button">
													<svg
														width="16"
														height="16"
														viewBox="0 0 16 16"
														fill="none"
														xmlns="http://www.w3.org/2000/svg">
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
									<div className="md:w-1/12 basis-[50%] md:basis-[auto] mb-6 md:mb-0">
										<div className="flex pb-2 text-xs uppercase text-grey-light">
											<p>Deposited</p>
											<div className="relative">
												<button className="px-1" type="button">
													<svg
														width="16"
														height="16"
														viewBox="0 0 16 16"
														fill="none"
														xmlns="http://www.w3.org/2000/svg">
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
									<div className="md:w-2/12 basis-[50%] md:basis-[auto] mb-6 md:mb-0">
										<div className="flex pb-2 text-xs uppercase text-grey-light">
											<p>Date Staked</p>
											<div className="relative">
												<button className="px-1" type="button">
													<svg
														width="16"
														height="16"
														viewBox="0 0 16 16"
														fill="none"
														xmlns="http://www.w3.org/2000/svg">
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
									<div className="md:w-2/12 basis-[50%] md:basis-[auto] mb-6 md:mb-0">
										<div className="flex pb-2 text-xs uppercase text-grey-light">
											<p>Unlocks In</p>
											<div className="relative">
												<button className="px-1" type="button">
													<svg
														width="16"
														height="16"
														viewBox="0 0 16 16"
														fill="none"
														xmlns="http://www.w3.org/2000/svg">
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
									<div className="md:w-2/12 basis-[100%] md:basis-[auto] md:flex md:flex-row md:justify-end"></div>
								</div>
							</div>
						</div>
						{hasStakedInPool && (
							<>
								{poolsData.map((pool, index) => (
									<div key={`pool-${index}`} className="p-4 mb-4 bg-white border rounded border-grey-200">
										<div className="flex flex-row flex-wrap !md:flex-nowrap items-start md:items-center">
											<div className="md:w-2/12 basis-[100%] md:basis-[auto] mb-6 md:mb-0 xl:mr-4">
												<div className="flex flex-col items-start xl:flex-row xl:items-center">
													<p className="text-xs uppercase md:hidden text-grey-light">asset</p>
													<div className="font-bold text-black uppercase text-xl xl:ml-3 xl:order-2">
														{activeTab === "kanoi" ? "KANOI" : "SAISEN"}
													</div>
													<span
														className="lazy-load-image-background lazy-load-image-loaded"
														style={{
															color: "transparent",
															display: "inline-block",
															height: "120px",
															width: "120px",
														}}>
														<Image
															src="/apecoin-pool-image.png"
															className="h-[120px] w-[120px] max-w-none xl:order-1 rounded-lg"
															alt="NFT Asset"
															height="120"
															width="120"
														/>
													</span>
												</div>
											</div>
											<div className="md:w-2/12 basis-[100%] md:basis-[auto] mb-6 md:mb-0">
												<div className="text-black text-sm font-bold">
													{/* {getDailyReward(activeTab === "kanoi" ? index : index + 5, pool[0])} */}
													{pool.dailyReward}
													{activeTab === "kanoi" ? "Kanoi" : "Saisen"}
												</div>
												<div className="text-slate-700 font-medium">$0.42</div>
											</div>
											<div className="md:w-1/12 basis-[100%] md:basis-[auto] mb-6 md:mb-0">
												<div className="text-black text-sm font-bold">
													{/* {getPendingReward(activeTab === "kanoi" ? index : index + 5)} */}
													{pool.pendingReward}
													{activeTab === "kanoi" ? "Kanoi" : "Saisen"}
												</div>
												<div className="text-slate-700 font-medium">$23.99</div>
											</div>
											<div className="md:w-1/12 basis-[100%] md:basis-[auto] mb-6 md:mb-0">
												<div className="text-black text-sm font-bold">
													{/* {getDepositedAmount(pool[0].toString())} */}
													{pool.depositedAmount}
													{activeTab === "kanoi" ? "Kanoi" : "Saisen"}
												</div>
												<div className="text-slate-700 font-medium">$215.99</div>
											</div>
											<div className="md:w-2/12 basis-[100%] md:basis-[auto] mb-6 md:mb-0">
												<div className="text-slate-700">
													{/* {getStakedDate(activeTab === "kanoi" ? index : index + 5, pool[2])} */}
													{pool.stakedDate}
												</div>
											</div>
											<div className="md:w-2/12 basis-[100%] md:basis-[auto] mb-6 md:mb-0">
												<div className="text-slate-700">
													{/* {getUnlockedDate(pool[2])} */}
													{pool.unlockDate}
												</div>
											</div>
											<div className="md:w-1/12 basis-[100%] md:basis-[auto] md:flex md:flex-row md:justify-end">
												<button
													onClick={handleShow}
													className="rounded border-2 uppercase px-5 py-2.5 mb-2 text-center font-bold text-xs disabled:cursor-not-allowed transition-colors bg-[#e8833a] text-white border-white-200 hover:bg-[#e8833a] focus:bg-[#e8833a] hover:border-[#e8833a] disabled:bg-grey w-full md:w-[150px]"
													type="button">
													<span className="flex items-center justify-center gap-2">
														<iconify-icon icon="ic:baseline-lock" width="14" height="14"></iconify-icon>
														<div>Locked</div>
													</span>
												</button>
											</div>
										</div>
									</div>
								))}
								<div className="p-4 mb-4 bg-white border rounded border-grey-200">
									<div className="flex flex-row flex-wrap !md:flex-nowrap items-start md:items-center">
										<div className="md:w-3/12 basis-[100%] md:basis-[auto] mb-6 md:mb-0 xl:mr-4">
											<div className="flex flex-col items-start xl:flex-row xl:items-center">
												<p className="text-xs uppercase md:hidden text-grey-light">asset</p>
												<div className="font-bold text-black uppercase text-xl xl:ml-3 xl:order-2">
													{activeTab === "kanoi" ? "KANOI" : "SAISEN"}
												</div>
												<span
													className="lazy-load-image-background lazy-load-image-loaded"
													style={{
														color: "transparent",
														display: "inline-block",
														height: "120px",
														width: "120px",
													}}>
													<Image
														src="/apecoin-pool-image.png"
														className="h-[120px] w-[120px] max-w-none xl:order-1 rounded-lg"
														alt="NFT Asset"
														height="120"
														width="120"
													/>
												</span>
											</div>
										</div>
										<div className="md:w-3/12 basis-[100%] md:basis-[auto] mb-6 md:mb-0">
											<div className="text-grey-light">
												Stake some ${activeTab === "kanoi" ? "KANOI" : "SAISEN"} to start earning rewards.
											</div>
										</div>
										<div className="md:w-3/12 basis-[100%] md:basis-[auto] md:flex md:flex-row md:justify-end">
											<button
												onClick={() => setStakeIsCollapse(!stakeIsCollapse)}
												className="rounded border-2 uppercase px-5 py-2.5 mb-2 text-center font-bold text-xs disabled:cursor-not-allowed transition-colors bg-[#e8833a] text-white border-white-200 hover:bg-[#e8833a] focus:bg-[#e8833a] hover:border-[#e8833a] disabled:bg-grey w-full md:w-[150px]"
												type="button">
												<div className="flex items-center justify-center gap-2">
													<div>MANAGE</div>
													{!stakeIsCollapse ? (
														<iconify-icon icon="vaadin:arrow-down" width="14" height="14"></iconify-icon>
													) : (
														<iconify-icon icon="vaadin:arrow-up" width="14" height="14"></iconify-icon>
													)}
												</div>
											</button>
										</div>
									</div>
									<Collapse in={stakeIsCollapse} className="mt-4">
										<div id="example-collapse-text" className="!visible">
											<div className="flex justify-end flex-col md:flex-row items-center gap-3">
												<div className="card flex flex-col justify-between !bg-blue-100 p-3 w-full md:w-3/12 min-h-56">
													<h6 className="mb-4">CLAIM REWARDS </h6>

													<div>
														<div className="mb-2 text-xs text-slate-500 font-medium">
															Unclaimed Balance: 10.87 Kanoi
														</div>

														<button className="rounded border-2 uppercase px-5 py-2.5 mb-2 text-center font-bold text-xs disabled:cursor-not-allowed transition-colors bg-[#e8833a] text-white border-white-200 hover:bg-[#e8833a] focus:bg-[#e8833a] hover:border-[#e8833a]  disabled:bg-grey w-full">
															CLAIM
														</button>
													</div>
												</div>
												<div className="card !bg-blue-100 p-3 w-full md:w-3/12 min-h-56">
													<h6 className="mb-4">WITHDRAW</h6>

													<div className="mb-2 text-xs text-slate-700 font-medium">Deposited Balance: 96 Kanoi</div>

													<div className="flex gap-2 mb-4">
														<input
															type="number"
															className="border-2 w-3/5 border-grey-200 focus:outline-none rounded-md p-2"
														/>
														<button className="rounded border-2 w-2/5 uppercase p-2 text-center font-bold text-xs disabled:cursor-not-allowed transition-colors bg-[#fff] text-[#e8833a] border-[#e8833a] hover:bg-[#e8833a] focus:bg-[#e8833a] hover:border-[#e8833a] hover:text-white  disabled:bg-grey">
															WITHDRAW
														</button>
													</div>
													<button className="rounded border-2 uppercase px-5 py-2.5 mb-2 text-center font-bold text-xs disabled:cursor-not-allowed transition-colors bg-[#e8833a] text-white border-white-200 hover:bg-[#e8833a] focus:bg-[#e8833a] hover:border-[#e8833a]  disabled:bg-grey w-full">
														WITHDRAW All
													</button>
												</div>
											</div>
										</div>
									</Collapse>
								</div>
							</>
						)}
					</div>
				</>
			)}

			{/* Modal  */}
			<Modal show={show} onHide={handleClose} size={"lg"} centered animation={true} backdrop="static">
				<Modal.Header className="border-0" closeButton>
					<Modal.Title></Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h4 className="text-center text-black font-bold">Stake</h4>

					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-1">
							<div className="pool-img rounded-full me-2">
								<Image src="/apecoin-pool-image.png" className="rounded-full" alt="NFT Asset" height="35" width="35" />
							</div>
							<div className="text-slate-700 font-medium">
								{stakeActiveTab.coin === "kanoi" ? " KANOI" : " SAISEN"} Pool
							</div>
						</div>
						<div className="text-slate-500 font-normal">
							EST. APY {estimatedAPY === "--" ? "--" : `${Number(estimatedAPY)}%`}
						</div>
					</div>

					<div className="flex flex-row justify-start mb-4">
						<div className="md:pl-1 md:pr-1 pl-0 pr-2">
							<div>
								<button
									onClick={() => setStakeActiveTab((prev) => ({ ...prev, coin: "kanoi" }))}
									className={`py-2 px-4 border-grey-light font-bold uppercase rounded-lg rounded-tab text-sm h-[36px] max-h-[36px] border ${
										stakeActiveTab.coin === "kanoi" ? "bg-blue-100 text-[#e8833a]" : "bg-white text-slate-500"
									}`}
									aria-current="page">
									KANOI
								</button>
							</div>
						</div>
						<div className="md:pl-1 md:pr-1 pl-0 pr-2">
							<div>
								<button
									onClick={() => setStakeActiveTab((prev) => ({ ...prev, coin: "saisen" }))}
									className={`py-2 px-4 border-grey-light font-bold uppercase rounded-lg rounded-tab text-sm h-[36px] max-h-[36px] border ${
										stakeActiveTab.coin === "saisen" ? "bg-blue-100 text-[#e8833a]" : "bg-white text-slate-500"
									}`}
									aria-current="page">
									SAISEN
								</button>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between mb-2">
						<div className="">Amount</div>
						<div className="flex items-center gap-1">
							<div className="font-bold text-black">Balance:</div>
							<div className="font-normal text-slate-600">
								{stakeActiveTab.coin === "kanoi" ? kanoiBalFormatted + " KANOI" : saisenBalFormatted + " SAISEN"}
							</div>
						</div>
					</div>

					<div className="stake-amount mb-4">
						<input
							type="number"
							value={stakingAmount}
							placeholder="Enter amount"
							className="w-full border-2 border-grey-200 focus:outline-none rounded-md p-2"
							onInput={handleChange}
							onKeyDown={handleKeyDown}
							onPaste={handlePaste}
						/>
					</div>

					<div className="text-black font-normal mb-2">Duration</div>

					<div className="flex flex-row justify-start flex-wrap gap-2 mb-4">
						<div className="md:pl-1 md:pr-1 pl-0 pr-2">
							<div>
								<button
									onClick={() => setStakeActiveTab((prev) => ({ ...prev, duration: "oneMonth" }))}
									className={`py-2  px-4 border-grey-light font-bold uppercase rounded-lg rounded-tab text-xs h-[36px] max-h-[36px] border ${
										stakeActiveTab.duration === "oneMonth" ? "bg-blue-100 text-[#e8833a]" : "bg-white text-slate-500"
									}`}
									aria-current="page">
									1 Month
								</button>
							</div>
						</div>
						<div className="md:pl-1 md:pr-1 pl-0 pr-2">
							<div>
								<button
									onClick={() => setStakeActiveTab((prev) => ({ ...prev, duration: "twoMonth" }))}
									className={`py-2  px-4 border-grey-light font-bold uppercase rounded-lg rounded-tab text-xs h-[36px] max-h-[36px] border ${
										stakeActiveTab.duration === "twoMonth" ? "bg-blue-100 text-[#e8833a]" : "bg-white text-slate-500"
									}`}
									aria-current="page">
									2 Month
								</button>
							</div>
						</div>
						<div className="md:pl-1 md:pr-1 pl-0 pr-2">
							<div>
								<button
									onClick={() => setStakeActiveTab((prev) => ({ ...prev, duration: "threeMonth" }))}
									className={`py-2  px-4 border-grey-light font-bold uppercase rounded-lg rounded-tab text-xs h-[36px] max-h-[36px] border ${
										stakeActiveTab.duration === "threeMonth" ? "bg-blue-100 text-[#e8833a]" : "bg-white text-slate-500"
									}`}
									aria-current="page">
									3 Month
								</button>
							</div>
						</div>
						<div className="md:pl-1 md:pr-1 pl-0 pr-2">
							<div>
								<button
									onClick={() => setStakeActiveTab((prev) => ({ ...prev, duration: "sixMonth" }))}
									className={`py-2  px-4 border-grey-light font-bold uppercase rounded-lg rounded-tab text-xs h-[36px] max-h-[36px] border ${
										stakeActiveTab.duration === "sixMonth" ? "bg-blue-100 text-[#e8833a]" : "bg-white text-slate-500"
									}`}
									aria-current="page">
									6 Month
								</button>
							</div>
						</div>
						<div className="md:pl-1 md:pr-1 pl-0 pr-2">
							<div>
								<button
									onClick={() => setStakeActiveTab((prev) => ({ ...prev, duration: "twelveMonth" }))}
									className={`py-2  px-4 border-grey-light font-bold uppercase rounded-lg rounded-tab text-xs h-[36px] max-h-[36px] border ${
										stakeActiveTab.duration === "twelveMonth" ? "bg-blue-100 text-[#e8833a]" : "bg-white text-slate-500"
									}`}
									aria-current="page">
									12 Month
								</button>
							</div>
						</div>
					</div>

					{isStaking ? (
						<button
							className="rounded border-2 uppercase px-5 py-2.5 mb-2 text-center font-bold text-xs disabled:cursor-not-allowed transition-colors bg-[#e8833a] text-white border-white-200 hover:bg-[#e8833a] focus:bg-[#e8833a] hover:border-[#e8833a]  disabled:bg-grey w-full"
							type="button">
							Staking ...
						</button>
					) : (
						<button
							onClick={() => stake(stakeActiveTab.coin)}
							className="rounded border-2 uppercase px-5 py-2.5 mb-2 text-center font-bold text-xs disabled:cursor-not-allowed transition-colors bg-[#e8833a] text-white border-white-200 hover:bg-[#e8833a] focus:bg-[#e8833a] hover:border-[#e8833a]  disabled:bg-grey w-full"
							type="button">
							Stake
						</button>
					)}
				</Modal.Body>
			</Modal>
			<ToastContainer position="bottom-center" draggable theme="light" limit={3} />
		</div>
	);
}
