export default function BurgerSvg() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={43}
			height={60}
			viewBox="20 0 72 100"
			style={{ overflow: "visible" }}
			fill="none"
			className="cursor-pointer"
		>
			<style>
				{`
					.burger-glow {
						filter: url(#a);
						opacity: 0;
						transition: opacity 180ms ease;
					}

					svg:hover .burger-glow {
						opacity: 1;
					}
				`}
			</style>
			<g className="burger-glow">
				<path
					fill="#FA8A16"
					d="M35.3 35.3h41.25v4.436H35.3V35.3Zm0 11.089h41.25v4.435H35.3V46.39Zm0 11.088h41.25v4.436H35.3v-4.436Z"
				/>
			</g>
			<g>
				<path
					fill="#FA8A16"
					d="M35.3 35.3h41.25v4.436H35.3V35.3Zm0 11.089h41.25v4.435H35.3V46.39Zm0 11.088h41.25v4.436H35.3v-4.436Z"
				/>
			</g>
			<defs>
				<filter
					id="a"
					width={111.85}
					height={97.213}
					x={0}
					y={0}
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
				>
					<feFlood floodOpacity={0} result="BackgroundImageFix" />
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feMorphology
						in="SourceAlpha"
						operator="dilate"
						radius={5}
						result="effect1_dropShadow_315_4286"
					/>
					<feOffset />
					<feGaussianBlur stdDeviation={15.15} />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix values="0 0 0 0 0.980392 0 0 0 0 0.541176 0 0 0 0 0.0862745 0 0 0 0.5 0" />
					<feBlend
						in2="BackgroundImageFix"
						result="effect1_dropShadow_315_4286"
					/>
					<feBlend
						in="SourceGraphic"
						in2="effect1_dropShadow_315_4286"
						result="shape"
					/>
				</filter>
			</defs>
		</svg>
	);
}
