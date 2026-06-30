'use client'

import Image from "next/image";

import Button from "./Button";

interface AdsBlockProps {
	title: string;
	subtitle: string;
	items: string[];
	icon: string;
}

export default function AdsBlock({ title, subtitle, items, icon }: AdsBlockProps) {
	const isCompactTimeline = items.length === 3;

	return (
		<div className="ads_block relative px-8 pb-9 pt-14">
			<div className="content_container">
				<div className="relative z-10">
					<div className="mb-7 flex items-center justify-center gap-[160px]">
						<Image
							src={icon}
							alt=""
							width={230}
							height={230}
							className="justify-self-center"
						/>
						<div className="max-w-[660px]">
							<h2 className="mb-3 text-center font-display text-6xx uppercase">{title}</h2>
							<p className="text-center text-2xl leading-[130%] text-white/70">{subtitle}</p>
						</div>
						<Image
							src={icon}
							alt=""
							width={230}
							height={230}
							className="justify-self-center -scale-x-100"
						/>
					</div>

					<div className={`relative mx-auto mb-11 ${isCompactTimeline ? "max-w-[1320px]" : "w-full"}`}>
						<div
							className="absolute top-[6px] h-px bg-[#fa8a16]/50"
							style={{
								left: `calc(100% / ${items.length * 2})`,
								right: `calc(100% / ${items.length * 2})`,
							}}
						/>
						<div
							className="relative grid"
							style={{
								gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
							}}
						>
							{items.map((item, index) => {
								return (
									<div key={`${item}-${index}`} className="flex min-w-0 flex-col items-center gap-2 text-center">
										<span className="relative z-10 size-3 rounded-full ads_circle" />
										<p className="max-w-[360px] text-xl">
											{item}
										</p>
									</div>
								);
							})}
						</div>
					</div>

					<Button title="See more" extra="block py-5 px-[28px] w-[400px] mx-auto" />
				</div>
			</div>
		</div>
	);
}
