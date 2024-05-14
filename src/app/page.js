/* eslint-disable react/no-unescaped-entities */
import Footer from "@/components/footer";
import Navbar from "@/components/nav";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	const stakeWays = [
		{
			id: "01",
			title: "$KANOI POOL",
			description:
				"Rewards vary based on the amount of tokens locked and the lockup duration. When $KANOI tokens are locked in the $SAISEN staking, the reward amount in $SAISEN is calculated by converting $KANOI to the prevailing market value of $SAISEN. Staking incentives may encompass exclusive NFTs and game items.",
			img: "/apeCoin.png",
		},
		{
			id: "02",
			title: "$SAISEN POOL",
			description:
				"Locking $SAISEN tokens in the $SAISEN staking pool enables users to earn additional $SAISEN rewards. The amount of rewards received in contigent upon the quantity of tokens locked and the duration of the lockup period. Staking incentives may encompass exclusive NFTs, in game items, and other perks.",
			img: "/apeCoin.png",
		},
		// {
		// 	id: "03",
		// 	title: "MUTANT (MAYC) POOL",
		// 	description: "The MAYC pool lets you stake up to 2,042 $Kanoi for each MAYC you own. The total staking pool for Mutants tops out at 19,060,000 $Kanoi for Year 1.",
		// 	img: "/apeCoin.png",
		// },
		// {
		// 	id: "04",
		// 	title: "PAIRED (BAKC) POOL",
		// 	description:
		// 		"The Paired pool works differently. A Dog (BAKC) cannot be staked alone and must be paired with a Bored Kanoi or a Mutant. The total staking pool for a BAKC pairing is 3,835,000 $Kanoi for Year 1.",
		// 	img: "/apeCoin.png",
		// },
	];
	const faqs = [
		{
			question: "WHAT IS KANOI?",
			answer: `KANOI is the official staking protocol for KANOI established by the KANOI DAO (kANOIDAO) and was created as a way for $Kanoi, BAYC, MAYC, and BAKC holders to earn rewards through staking. $Kanoi can be staked by itself or in conjunction with a BAYC, MAYC, or BAKC in one of the four staking pools, with each pool offering different levels of rewards.
      The KanoiStake.io protocol was proposed in AIPs 21 and 22 and subsequently approved by the community on May 4, 2022. Following approval, the Kanoi Foundation enlisted Horizen Labs to provide a platform for the staking protocol according to the specifications set forth in the AIPs.

      To help clarify terminology, the AIPs provided definitions for some important terms:

      Staking Pools: The total KANOI pools that participants can earn from.

      Staking Pool Type: The pool is specifically assigned to a digital asset class; there are four in total.

      Staking Period: Each period is 12 months.

      Staking Pool Allocations: The total amount of KANOI allocated to each Staking Pool Type per period.

      Total Staking Period: A total of three (3) years.

      Initial Staking Period: The first 12-month period of staking.

      Pool Distribution: The spread of the staking allocation assigned across the period.

      Incentive Distribution Curve: The schedule of KANOI allocated for incentives per quarter.`,
		},
		{
			question: "WHAT BROWSERS AND DEVICES SUPPORT KANOI?",
			answer: `KANOI is the official staking protocol for KANOI established by the KANOI DAO (kANOIDAO) and was created as a way for $Kanoi, BAYC, MAYC, and BAKC holders to earn rewards through staking. $Kanoi can be staked by itself or in conjunction with a BAYC, MAYC, or BAKC in one of the four staking pools, with each pool offering different levels of rewards.`,
		},
		{
			question: "WHAT BROWSERS AND DEVICES SUPPORT KANOI?",
			answer: `KANOI is the official staking protocol for KANOI established by the KANOI DAO (kANOIDAO) and was created as a way for $Kanoi, BAYC, MAYC, and BAKC holders to earn rewards through staking. $Kanoi can be staked by itself or in conjunction with a BAYC, MAYC, or BAKC in one of the four staking pools, with each pool offering different levels of rewards.`,
		},
		{
			question: "WHAT BROWSERS AND DEVICES SUPPORT KANOI?",
			answer: `KANOI is the official staking protocol for KANOI established by the KANOI DAO (kANOIDAO) and was created as a way for $Kanoi, BAYC, MAYC, and BAKC holders to earn rewards through staking. $Kanoi can be staked by itself or in conjunction with a BAYC, MAYC, or BAKC in one of the four staking pools, with each pool offering different levels of rewards.`,
		},
		{
			question: "WHAT BROWSERS AND DEVICES SUPPORT KANOI?",
			answer: `KanoiStake.io is the official staking protocol for KANOI established by the KANOI DAO (kANOIDAO) and was created as a way for $Kanoi, BAYC, MAYC, and BAKC holders to earn rewards through staking. $Kanoi can be staked by itself or in conjunction with a BAYC, MAYC, or BAKC in one of the four staking pools, with each pool offering different levels of rewards.`,
		},
	];
	return (
		<>
			{/* Banner */}
			<section className="banner-section">
				<div className="container min-h-screen">
					<div className="row !items-center">
						<div className="col-md-6">
							<div className="banner-image">
								<Image src="/ape-banner.png" alt="Banner" width={500} height={500} />
							</div>
						</div>
						<div className="col-md-5">
							<div className="banner-text">
								<h1 className="text-black lg:text-5xl sm:text-2xl font-bold">
									STAKE YOUR $KANOI/$SAISEN AND EARN REWARDS
								</h1>
								<p className="lg:max-w-[488px] text-[#293740]">
									Do you have $KANOI or $SAISEN circulating in the KANOI TCG ecosystem? Don't dawdle; earn rewards by
									staking your assets.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* Stake */}
			<section className="stake pb-[100px]">
				<div className="container">
					<h1 className="text-black text-3xl font-bold mb-5">STAKE IN FOUR DIFFERENT WAYS</h1>
					<div className="row mb-12">
						{stakeWays.map((way) => (
							<div className="col-md-6 mt-4 pb-5" key={way.id}>
								<div className="stake-card">
									<div className="flex items-center gap-2">
										<h4 className="text-[#f6688c] font-header font-bold text-xl mr-2 lg:leading-8">{way.id}</h4>
										<h3 className="text-black font-bold">{way.title}</h3>
									</div>
									<p className="mb-8 text-grey-light text-base leading-5 w-75">{way.description}</p>
									<div>
										<div className="inline-block rounded-full">
											<picture>
												<Image
													src={way.img}
													className="rounded-full border-2"
													alt="Coin/NFT icon"
													width="60"
													height="60"
												/>
											</picture>
										</div>
										<div className="inline-block rounded-full -translate-x-[1.5rem]">
											<picture>
												<Image
													src={way.img}
													className="rounded-full border-2"
													alt="Coin/NFT icon"
													width="60"
													height="60"
												/>
											</picture>
										</div>
										<div className="inline-block rounded-full -translate-x-[3rem]">
											<picture>
												<Image
													src={way.img}
													className="rounded-full border-2"
													alt="Coin/NFT icon"
													width="60"
													height="60"
												/>
											</picture>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="text-center">
						<Link href="/dashboard" className="btn btn-primary text-uppercase !bg-[#e8833a] !font-bold !px-7 py-2">
							Start Staking
						</Link>
					</div>
				</div>
			</section>
			{/* Faq's */}
			<section className="faqs pb-[100px]">
				<div className="container">
					<h1 className="text-black text-3xl font-bold mb-5">FREQUENTLY ASKED QUESTIONS</h1>
					<div className="accordion accordion-flush" id="accordionFlushExample">
						{faqs.map((faq, index) => (
							<div className="accordion-item" key={index}>
								<h2 className="accordion-header" id={`flush-heading-${index}`}>
									<button
										className="accordion-button collapsed"
										type="button"
										data-bs-toggle="collapse"
										data-bs-target={`#flush-collapse-${index}`}
										aria-expanded="false"
										aria-controls={`flush-collapse-${index}`}>
										{faq.question}
										<i className="bi bi-chevron-down"></i>
									</button>
								</h2>
								<div
									id={`flush-collapse-${index}`}
									className="accordion-collapse collapse !visible"
									aria-labelledby={`flush-heading-${index}`}
									data-bs-parent="#accordionFlushExample">
									<div className="accordion-body">{faq.answer}</div>
								</div>
							</div>
						))}
					</div>
					<div className="text-center mt-8">
						<button className="btn btn-primary text-uppercase !bg-[#e8833a] !font-bold !px-7 py-2">See All</button>
					</div>
				</div>
			</section>
		</>
	);
}
