'use client'

import Image from "next/image";

import Button from "./Button";

interface ServicesBlockProps {
	title: string;
	subtitle: string;
	items: string[];
	icon: string;
}

export default function ServicesBlock({ title, subtitle, items, icon }: ServicesBlockProps) {
	const isCompactTimeline = items.length === 3;

	return (
		<section className="services_block">
			<div className="content_container">
				<div className="services_inner">
					<div className="services_header">
						<Image
							src={icon}
							alt=""
							width={230}
							height={230}
							className="services_icon"
						/>
						<div className="services_copy">
							<h2 className="services_title">{title}</h2>
							<p className="services_subtitle">{subtitle}</p>
						</div>
						<Image
							src={icon}
							alt=""
							width={230}
							height={230}
							className="services_icon services_icon-mirror"
						/>
					</div>

					<div className={`services_timeline ${isCompactTimeline ? "services_timeline-compact" : ""}`}>
						<div
							className="services_timeline-line"
							style={{
								left: `calc(100% / ${items.length * 2})`,
								right: `calc(100% / ${items.length * 2})`,
							}}
						/>
						<div
							className="services_items"
							style={{
								gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
							}}
						>
							{items.map((item, index) => {
								return (
									<div key={`${item}-${index}`} className="services_item">
										<span className="services_circle" />
										<p className="services_item-text">
											{item}
										</p>
									</div>
								);
							})}
						</div>
					</div>

					<Button title="See more" extra="services_btn" />
				</div>
			</div>
		</section>
	);
}
