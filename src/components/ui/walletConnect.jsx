"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import Dropdown from "react-bootstrap/Dropdown";

export default function ConnectButton() {
	// 4. Use modal hook
	const { open, close } = useWeb3Modal();
	const { disconnect } = useDisconnect();
	const { address, isConnecting, isDisconnected } = useAccount();
	return (
		<>
			{address ? (
				<Dropdown>
					<Dropdown.Toggle
						variant="success"
						id="dropdown-basic"
						className="rounded wallet-dropdown border-2 uppercase px-5 py-2.5 mb-2 text-center font-bold text-xs disabled:cursor-not-allowed transition-colors !bg-[#e8833a] text-white border-white-200 !hover:bg-[#e8833a] !focus:bg-[#e8833a] !hover:border-[#e8833a] !border-[#e8833a] disabled:bg-grey">
						{address.slice(0, 6)}...{address.slice(-4)}
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item className="cursor-pointer" onClick={() => disconnect()}>
							Disconnect
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			) : (
				<button
					onClick={() => open()}
					className="rounded border-2 uppercase px-5 py-2.5 mb-2 text-center font-bold text-xs disabled:cursor-not-allowed transition-colors bg-[#e8833a] text-white border-white-200 hover:bg-[#e8833a] focus:bg-[#e8833a] hover:border-[#e8833a] hover:border-[#e8833a] disabled:bg-grey"
					type="button">
					connect wallet
				</button>
			)}
		</>
	);
}
