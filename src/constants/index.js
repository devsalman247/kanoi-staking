const STAKING_CONTRACT_ADDRESS = "0x850b653b368e54d6f23F10d6c20b93A4fc6f4612";
const KANOI_CONTRACT_ADDRESS = "0x6C3893c7196e993495BC3f52D5abBC83C431e69B";
const SAISEN_CONTRACT_ADDRESS = "0x1f9F2c83C172e7dB204A7577CCa5777Bc9b350B7";

const STAKING_CONTRACT_ABI = [
	{ inputs: [], stateMutability: "nonpayable", type: "constructor" },
	{ inputs: [{ internalType: "address", name: "target", type: "address" }], name: "AddressEmptyCode", type: "error" },
	{
		inputs: [{ internalType: "address", name: "account", type: "address" }],
		name: "AddressInsufficientBalance",
		type: "error",
	},
	{
		inputs: [{ internalType: "address", name: "implementation", type: "address" }],
		name: "ERC1967InvalidImplementation",
		type: "error",
	},
	{ inputs: [], name: "ERC1967NonPayable", type: "error" },
	{ inputs: [], name: "FailedInnerCall", type: "error" },
	{ inputs: [], name: "InvalidInitialization", type: "error" },
	{ inputs: [], name: "NotInitializing", type: "error" },
	{ inputs: [{ internalType: "address", name: "owner", type: "address" }], name: "OwnableInvalidOwner", type: "error" },
	{
		inputs: [{ internalType: "address", name: "account", type: "address" }],
		name: "OwnableUnauthorizedAccount",
		type: "error",
	},
	{
		inputs: [{ internalType: "address", name: "token", type: "address" }],
		name: "SafeERC20FailedOperation",
		type: "error",
	},
	{ inputs: [], name: "UUPSUnauthorizedCallContext", type: "error" },
	{
		inputs: [{ internalType: "bytes32", name: "slot", type: "bytes32" }],
		name: "UUPSUnsupportedProxiableUUID",
		type: "error",
	},
	{
		anonymous: false,
		inputs: [{ indexed: false, internalType: "uint64", name: "version", type: "uint64" }],
		name: "Initialized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "previousOwner", type: "address" },
			{ indexed: true, internalType: "address", name: "newOwner", type: "address" },
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [{ indexed: true, internalType: "address", name: "implementation", type: "address" }],
		name: "Upgraded",
		type: "event",
	},
	{
		inputs: [],
		name: "UPGRADE_INTERFACE_VERSION",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "contract IERC20", name: "_depositToken", type: "address" },
			{ internalType: "contract IERC20", name: "_rewardToken", type: "address" },
			{ internalType: "uint256", name: "_apy", type: "uint256" },
			{ internalType: "uint256", name: "_lockDays", type: "uint256" },
		],
		name: "add",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "_pid", type: "uint256" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
		],
		name: "deposit",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "", type: "address" }],
		name: "depositedTokens",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "_user", type: "address" }],
		name: "getRecordIds",
		outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "initialOwner", type: "address" }],
		name: "initialize",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "_pid", type: "uint256" },
			{ internalType: "uint256", name: "_apy", type: "uint256" },
		],
		name: "modifyPool",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "_pid", type: "uint256" },
			{ internalType: "address", name: "_user", type: "address" },
			{ internalType: "uint256", name: "_id", type: "uint256" },
		],
		name: "pendingReward",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		name: "poolInfo",
		outputs: [
			{ internalType: "contract IERC20", name: "depositToken", type: "address" },
			{ internalType: "contract IERC20", name: "rewardToken", type: "address" },
			{ internalType: "uint256", name: "depositedAmount", type: "uint256" },
			{ internalType: "uint256", name: "apy", type: "uint256" },
			{ internalType: "uint256", name: "lockDays", type: "uint256" },
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "proxiableUUID",
		outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
		stateMutability: "view",
		type: "function",
	},
	{ inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
	{
		inputs: [
			{ internalType: "address", name: "token", type: "address" },
			{ internalType: "uint256", name: "amount", type: "uint256" },
		],
		name: "sweep",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "newImplementation", type: "address" },
			{ internalType: "bytes", name: "data", type: "bytes" },
		],
		name: "upgradeToAndCall",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "", type: "uint256" },
			{ internalType: "address", name: "", type: "address" },
			{ internalType: "uint256", name: "", type: "uint256" },
		],
		name: "userInfo",
		outputs: [
			{ internalType: "uint256", name: "amount", type: "uint256" },
			{ internalType: "uint256", name: "lastRewardAt", type: "uint256" },
			{ internalType: "uint256", name: "lockUntil", type: "uint256" },
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "_pid", type: "uint256" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
			{ internalType: "uint256", name: "_id", type: "uint256" },
		],
		name: "withdraw",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];
const KANOI_CONTRACT_ABI = [
	{
		inputs: [
			{ internalType: "string", name: "name", type: "string" },
			{ internalType: "string", name: "symbol", type: "string" },
			{ internalType: "uint8", name: "decimals", type: "uint8" },
			{ internalType: "uint256", name: "totalSupply", type: "uint256" },
			{ internalType: "address payable", name: "feeReceiver", type: "address" },
			{ internalType: "address", name: "tokenOwnerAddress", type: "address" },
		],
		stateMutability: "payable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "owner", type: "address" },
			{ indexed: true, internalType: "address", name: "spender", type: "address" },
			{ indexed: false, internalType: "uint256", name: "value", type: "uint256" },
		],
		name: "Approval",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: true, internalType: "address", name: "to", type: "address" },
			{ indexed: false, internalType: "uint256", name: "value", type: "uint256" },
		],
		name: "Transfer",
		type: "event",
	},
	{
		inputs: [
			{ internalType: "address", name: "owner", type: "address" },
			{ internalType: "address", name: "spender", type: "address" },
		],
		name: "allowance",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "spender", type: "address" },
			{ internalType: "uint256", name: "value", type: "uint256" },
		],
		name: "approve",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "account", type: "address" }],
		name: "balanceOf",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
		name: "burn",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "decimals",
		outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "spender", type: "address" },
			{ internalType: "uint256", name: "subtractedValue", type: "uint256" },
		],
		name: "decreaseAllowance",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "spender", type: "address" },
			{ internalType: "uint256", name: "addedValue", type: "uint256" },
		],
		name: "increaseAllowance",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "name",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "symbol",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "totalSupply",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "recipient", type: "address" },
			{ internalType: "uint256", name: "amount", type: "uint256" },
		],
		name: "transfer",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "sender", type: "address" },
			{ internalType: "address", name: "recipient", type: "address" },
			{ internalType: "uint256", name: "amount", type: "uint256" },
		],
		name: "transferFrom",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
];
const SAISEN_CONTRACT_ABI = [
	{
		inputs: [
			{ internalType: "string", name: "name", type: "string" },
			{ internalType: "string", name: "symbol", type: "string" },
			{ internalType: "uint8", name: "decimals", type: "uint8" },
			{ internalType: "uint256", name: "totalSupply", type: "uint256" },
			{ internalType: "address payable", name: "feeReceiver", type: "address" },
			{ internalType: "address", name: "tokenOwnerAddress", type: "address" },
		],
		stateMutability: "payable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "owner", type: "address" },
			{ indexed: true, internalType: "address", name: "spender", type: "address" },
			{ indexed: false, internalType: "uint256", name: "value", type: "uint256" },
		],
		name: "Approval",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: true, internalType: "address", name: "to", type: "address" },
			{ indexed: false, internalType: "uint256", name: "value", type: "uint256" },
		],
		name: "Transfer",
		type: "event",
	},
	{
		inputs: [
			{ internalType: "address", name: "owner", type: "address" },
			{ internalType: "address", name: "spender", type: "address" },
		],
		name: "allowance",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "spender", type: "address" },
			{ internalType: "uint256", name: "value", type: "uint256" },
		],
		name: "approve",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "account", type: "address" }],
		name: "balanceOf",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
		name: "burn",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "decimals",
		outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "spender", type: "address" },
			{ internalType: "uint256", name: "subtractedValue", type: "uint256" },
		],
		name: "decreaseAllowance",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "spender", type: "address" },
			{ internalType: "uint256", name: "addedValue", type: "uint256" },
		],
		name: "increaseAllowance",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "name",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "symbol",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "totalSupply",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "recipient", type: "address" },
			{ internalType: "uint256", name: "amount", type: "uint256" },
		],
		name: "transfer",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "sender", type: "address" },
			{ internalType: "address", name: "recipient", type: "address" },
			{ internalType: "uint256", name: "amount", type: "uint256" },
		],
		name: "transferFrom",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
];

const STAKING_CONTRACT_CONFIG = {
	abi: STAKING_CONTRACT_ABI,
	address: STAKING_CONTRACT_ADDRESS,
};
const KANOI_CONTRACT_CONFIG = {
	abi: KANOI_CONTRACT_ABI,
	address: KANOI_CONTRACT_ADDRESS,
};
const SAISEN_CONTRACT_CONFIG = {
	abi: SAISEN_CONTRACT_ABI,
	address: SAISEN_CONTRACT_ADDRESS,
};
const POOLS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export {
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
};
