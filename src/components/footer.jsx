import Link from "next/link";
import React from "react";

const Footer = () => {
	return (
		<>
			<footer className="bg-[#000000] pt-8 pb-6">
				<div className="container lg:space-x-10 lg:flex lg:items-center">
					<Link href={"/"} className="text-white text-2xl font-bold text-decoration-none">
						Kanoi
					</Link>
					<div className="flex justify-between pt-6 pb-7 lg:flex-grow">
						<div className="space-x-6">
							<a href="/faq" className="text-slate-400 text-decoration-none">
								<span className="font-bold text-xs text-grey-light hover:text-white">F.A.Q.</span>
							</a>
						</div>
						<div className="flex space-x-5">
							<a href="#">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="SocialIcons_socialIconSvg__lfNnv">
									<path
										d="M12.0003 24C14.3737 23.9999 16.6937 23.2961 18.6671 21.9775C20.6404 20.6588 22.1785 18.7847 23.0866 16.592C23.9948 14.3992 24.2324 11.9865 23.7694 9.6587C23.3063 7.33095 22.1634 5.19279 20.4851 3.5146C18.8069 1.8364 16.6687 0.69355 14.3409 0.230556C12.0132 -0.232438 9.60041 0.00522276 7.40772 0.913484C5.21503 1.82175 3.34089 3.35982 2.02233 5.3332C0.703772 7.30658 2.89287e-09 9.62664 1.86727e-09 12C-2.77976e-05 13.5759 0.310348 15.1364 0.913417 16.5923C1.51649 18.0483 2.40043 19.3712 3.51478 20.4855C4.62912 21.5998 5.95205 22.4837 7.40801 23.0867C8.86397 23.6897 10.4245 24.0001 12.0003 24Z"
										fill="#353637"
										className="SocialIcons_fill__fkmQq"></path>
									<path
										d="M18.0205 8.8563C17.5705 9.0556 17.0931 9.18641 16.6043 9.24436C17.1194 8.93659 17.5048 8.45173 17.6884 7.88044C17.2043 8.16772 16.6745 8.3699 16.1221 8.47819C15.7501 8.08344 15.2585 7.82217 14.7232 7.73478C14.1879 7.64738 13.6387 7.73871 13.1605 7.99466C12.6823 8.25061 12.3017 8.65692 12.0775 9.15082C11.8533 9.64471 11.798 10.1987 11.9201 10.7272C10.9395 10.6781 9.98015 10.4234 9.1044 9.97941C8.22864 9.53545 7.45607 8.91224 6.83687 8.15025C6.52155 8.69339 6.42498 9.33625 6.5668 9.94807C6.70861 10.5599 7.07817 11.0947 7.60029 11.4437C7.20858 11.4313 6.82547 11.3257 6.48268 11.1357V11.1661C6.4826 11.7356 6.67965 12.2877 7.04037 12.7285C7.40109 13.1692 7.90323 13.4716 8.46155 13.5842C8.24983 13.6426 8.03111 13.6719 7.81146 13.671C7.65586 13.6712 7.50058 13.6566 7.34776 13.6273C7.50507 14.1173 7.81175 14.5458 8.2248 14.8528C8.63785 15.1597 9.13658 15.3298 9.65113 15.3391C8.61603 16.147 7.3041 16.5142 6 16.361C7.06006 17.0399 8.2833 17.421 9.54139 17.4644C10.7995 17.5077 12.0461 17.2117 13.1503 16.6073C14.2546 16.003 15.1759 15.1126 15.8175 14.0296C16.4591 12.9465 16.7975 11.7108 16.797 10.4519C16.797 10.3447 16.7949 10.238 16.7905 10.1329C17.2733 9.784 17.69 9.35163 18.0207 8.85616"
										fill="white"></path>
								</svg>
							</a>
							<a href="#">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="SocialIcons_socialIconSvg__lfNnv">
									<path
										d="M11.9999 24C14.3733 24 16.6934 23.2962 18.6668 21.9777C20.6402 20.6591 22.1782 18.785 23.0865 16.5923C23.9948 14.3996 24.2324 11.9868 23.7694 9.65904C23.3064 7.33127 22.1636 5.19307 20.4854 3.51482C18.8072 1.83658 16.669 0.693665 14.3412 0.230613C12.0135 -0.232439 9.60067 0.00516688 7.40795 0.913384C5.21523 1.8216 3.34109 3.35964 2.02248 5.333C0.703878 7.30636 4.18737e-05 9.62642 1.01645e-08 11.9998C-6.48508e-05 13.5757 0.310288 15.1361 0.913315 16.5921C1.51634 18.048 2.40022 19.3709 3.51453 20.4853C4.62883 21.5996 5.95172 22.4835 7.40765 23.0866C8.86358 23.6896 10.4241 24 11.9999 24"
										fill="#353637"
										className="SocialIcons_fill__fkmQq"></path>
									<path
										d="M8.64165 17.0186H6.30239V9.53317H8.64165V17.0186ZM7.41208 8.59676H7.39522C7.21684 8.61014 7.03762 8.58651 6.86881 8.52735C6.69999 8.4682 6.54524 8.3748 6.41423 8.25301C6.28322 8.13122 6.17878 7.98367 6.10748 7.81961C6.03619 7.65556 5.99957 7.47855 5.99991 7.29967C5.97405 7.01318 6.03549 6.72556 6.17615 6.47464C6.31681 6.22372 6.5301 6.02124 6.788 5.89381C7.04589 5.76638 7.33632 5.71997 7.62108 5.76069C7.90585 5.8014 8.17161 5.92733 8.38346 6.12192C8.59531 6.31651 8.74333 6.57065 8.80805 6.85093C8.87276 7.13121 8.85114 7.42452 8.74604 7.69229C8.64093 7.96006 8.45728 8.18976 8.21919 8.35119C7.98111 8.51262 7.69973 8.59823 7.41208 8.59676V8.59676ZM17.9998 17.0186H15.3475V13.1451C15.3475 12.1312 14.9331 11.4394 14.0204 11.4394C13.7399 11.4405 13.4668 11.5296 13.2396 11.6941C13.0123 11.8587 12.8425 12.0904 12.754 12.3567C12.6985 12.5555 12.6791 12.7628 12.6968 12.9685V17.0189H10.0693C10.0693 17.0189 10.1034 10.1573 10.0693 9.53345H12.6968V10.7082C12.9208 10.2942 13.2617 9.95518 13.6769 9.73349C14.0922 9.51179 14.5635 9.41717 15.0322 9.46142C16.6941 9.46142 18.0001 10.5384 18.0001 12.8565L17.9998 17.0186Z"
										fill="white"></path>
								</svg>
							</a>
						</div>
					</div>
				</div>
				<div className="container">
					<div className="flex flex-row items-stretch justify-between pt-5 border-t border-t-grey-light">
						<div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-y-0">
							<div className="font-medium text-[10px] leading-3 text-grey-light flex items-center flex-row">
								<div className="font-medium text-[10px] leading-3 text-grey-light text-slate-400">©2024 Kanoi</div>
								<p className="uppercase text-slate-400 sm:ml-4 mb-0">Contract Address:&nbsp;</p>
								<a target="_blank" rel="noopener noreferrer" className="flex flex-row items-center" href="#">
									<p className="mx-2 text-white text-[12px] mb-0">0x5954...Fbb9</p>
									<div>
										<svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path fill="none" stroke="#fff" strokeWidth="2" d="M19,13 L19,23 L1,23 L1,5 L1,5 L11,5 M14,1 L23,1 L23,10 M10,14 L22.9999998,1 L10,14 Z"></path>
										</svg>
									</div>
								</a>
							</div>
						</div>
						<div className="flex flex-col items-end space-y-2 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0">
							<div className="font-medium text-[10px] leading-3">
								<a href="#" className="text-slate-400 hover:text-white text-decoration-none">
									TERMS OF SERVICE
								</a>
							</div>
							<div className="font-medium text-[10px] leading-3">
								<a href="#" className="text-slate-400 hover:text-white text-decoration-none">
									PRIVACY POLICY
								</a>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
};

export default Footer;
