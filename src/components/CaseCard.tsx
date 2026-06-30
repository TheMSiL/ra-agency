import Image from "next/image";

import casesCardBg from "../../public/cases-card-bg.png";
import type { CaseItem } from "./Cases";

export default function CaseCard({ caseItem }: { caseItem: CaseItem }) {
	return (
		<div className="cases_card">
			<div className="cases_card-top">
				<h4 className="cases_card-title">
					{caseItem.title}
				</h4>
				<div className="cases_stats">
					<div className="cases_stat">
						<p className="cases_stat-label">Budget</p>
						<span className="cases_stat-value">{caseItem.budget}</span>
					</div>
					<div className="cases_stat">
						<p className="cases_stat-label">New users</p>
						<span className="cases_stat-value">{caseItem.new_users}</span>
					</div>
					<div className="cases_stat">
						<p className="cases_stat-label">geo</p>
						<span className="cases_stat-value">{caseItem.geo}</span>
					</div>
				</div>
			</div>
			<div className="cpu_text">
				<p>
					CPU
				</p>
				<span>{caseItem.cpu}</span>
			</div>
			<Image className="cases_card-bg" src={casesCardBg} alt="cases-card-bg" />
			<span className="cases_card-circle"></span>
		</div>
	);
}
