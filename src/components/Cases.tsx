'use client';

import { useState } from "react";

import Button from "./Button";
import CaseCard from "./CaseCard";

const casesData = [
	{
		id: 'case-1',
		title: 'company name',
		budget: '$400k',
		new_users: '221,837',
		geo: 'mix',
		cpu: '1,8$'
	},
	{
		id: 'case-2',
		title: 'company name',
		budget: '$400k',
		new_users: '221,837',
		geo: 'mix',
		cpu: '1,8$'
	},
	{
		id: 'case-3',
		title: 'company name',
		budget: '$400k',
		new_users: '221,837',
		geo: 'mix',
		cpu: '1,8$'
	},
	{
		id: 'case-4',
		title: 'company name',
		budget: '$400k',
		new_users: '221,837',
		geo: 'mix',
		cpu: '1,8$'
	},
	{
		id: 'case-5',
		title: 'company name',
		budget: '$400k',
		new_users: '221,837',
		geo: 'mix',
		cpu: '1,8$'
	},
	{
		id: 'case-6',
		title: 'company name',
		budget: '$400k',
		new_users: '221,837',
		geo: 'mix',
		cpu: '1,8$'
	},
]

export type CaseItem = (typeof casesData)[number];

export default function Cases() {
	const [isExpanded, setIsExpanded] = useState(false);
	const leftCases = isExpanded ? casesData.slice(0, 3) : casesData.slice(1, 3);
	const rightCases = isExpanded ? casesData.slice(3, 6) : casesData.slice(0, 1);

	return (
		<div className="cases pt-44 pb-16">
			<div className="content_container">
				<div className={`cases_layout ${isExpanded ? 'cases_layout-expanded' : ''}`}>
					<div className="cases_side">
						{leftCases.map((caseItem) => (
							<CaseCard key={caseItem.id} caseItem={caseItem} />
						))}
					</div>
					<div className="cases_main">
						<div className="cases_intro">
							<h2 className="cases_title">
								Case Studies and
								<span className="numbers_gradient-text">Success Stories</span>
							</h2>
							<p className="cases_intro-text">Examples of advertising campaigns we launched and scaled for our clients</p>
						</div>
						{rightCases.map((caseItem) => (
							<CaseCard key={caseItem.id} caseItem={caseItem} />
						))}
					</div>
				</div>
				<Button
					title={isExpanded ? "Less cases" : "More cases"}
					extra="block py-5 px-[28px] w-[400px] mx-auto"
					onClick={() => setIsExpanded((current) => !current)}
				/>
			</div>
		</div>
	);
}
