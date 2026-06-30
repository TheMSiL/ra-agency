import Image from "next/image";

export default function Talk() {
	return (
		<div>
			<div className="content_container">
				<h2 className="numbers_title text-center numbers_gradient-text mb-32">Are you ready to talk?</h2>
				<div className="relative flex items-center justify-center">
					<Image src='/radar.png' alt="radar" width={1420} height={670} />
					<a className="talk_btn" href="#" target="_blank">
						Message us on
						Telegram
					</a>
				</div>
			</div>
		</div >
	);
}