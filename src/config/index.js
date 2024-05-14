import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { walletConnect, coinbaseWallet } from "wagmi/connectors";

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const NEXT_SEPOLIA_API_URL = process.env.NEXT_PUBLIC_SEPOLIA_API_URL;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
	name: "Web3Modal",
	description: "Web3Modal Example",
	url: "https://kanoi-staking.vercel.app", // origin must match your domain & subdomain
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmiConfig
const chains = [mainnet, sepolia];
export const config = createConfig({
	chains, // Use the defined chains here
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(NEXT_SEPOLIA_API_URL),
	},
	connectors: [
		walletConnect({ projectId, metadata, showQrModal: false }),
		coinbaseWallet({
			appName: metadata.name,
			appLogoUrl: metadata.icons[0],
		}),
	],
});
