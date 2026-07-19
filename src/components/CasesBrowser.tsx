"use client";

import type { CaseType } from "@/data/cases";
import { casesItems } from "@/data/cases";
import { useMemo, useRef, useState } from "react";
import CasesCard from "./CasesCard";

const CASES_PER_PAGE = 9;
const caseTypes: CaseType[] = ["telegram", "google", "meta"];

function formatCaseType(type: CaseType) {
	return `${type[0].toUpperCase()}${type.slice(1)} ads`;
}

function SearchIcon() {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
			<g opacity="0.7">
				<path
					d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C2.99933 7.684 3.62867 6.14667 4.888 4.888C6.14733 3.62933 7.68467 3 9.5 3C11.3153 3 12.853 3.62933 14.113 4.888C15.373 6.14667 16.002 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5633 11.8133 14.0007 10.7507 14 9.5C13.9993 8.24933 13.562 7.187 12.688 6.313C11.814 5.439 10.7513 5.00133 9.5 5C8.24867 4.99867 7.18633 5.43633 6.313 6.313C5.43967 7.18967 5.002 8.252 5 9.5C4.998 10.748 5.43567 11.8107 6.313 12.688C7.19033 13.5653 8.25267 14.0027 9.5 14Z"
					fill="white"
				/>
				<path
					d="M9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C2.99933 7.684 3.62867 6.14667 4.888 4.888C6.14733 3.62933 7.68467 3 9.5 3C11.3153 3 12.853 3.62933 14.113 4.888C15.373 6.14667 16.002 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L20.3 18.9C20.4833 19.0833 20.575 19.3167 20.575 19.6C20.575 19.8833 20.4833 20.1167 20.3 20.3C20.1167 20.4833 19.8833 20.575 19.6 20.575C19.3167 20.575 19.0833 20.4833 18.9 20.3L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5633 11.8133 14.0007 10.7507 14 9.5C13.9993 8.24933 13.562 7.187 12.688 6.313C11.814 5.439 10.7513 5.00133 9.5 5C8.24867 4.99867 7.18633 5.43633 6.313 6.313C5.43967 7.18967 5.002 8.252 5 9.5C4.998 10.748 5.43567 11.8107 6.313 12.688C7.19033 13.5653 8.25267 14.0027 9.5 14Z"
					fill="white"
				/>
				<path
					d="M9.5391 15.23C7.94044 15.23 6.58544 14.6747 5.47411 13.564C4.36344 12.454 3.80811 11.0994 3.80811 9.50002C3.80811 7.90069 4.36344 6.54569 5.47411 5.43502C6.58477 4.32435 7.93977 3.76935 9.5391 3.77002C11.1384 3.77069 12.4931 4.32602 13.6031 5.43602C14.7131 6.54602 15.2684 7.90069 15.2691 9.50002C15.2691 10.1947 15.1461 10.867 14.9001 11.517C14.6541 12.167 14.3308 12.723 13.9301 13.185L19.8391 19.092C19.9324 19.1854 19.9824 19.3004 19.9891 19.437C19.9951 19.5724 19.9451 19.6934 19.8391 19.8C19.7324 19.9067 19.6144 19.96 19.4851 19.96C19.3558 19.96 19.2378 19.9067 19.1311 19.8L13.2231 13.892C12.7231 14.318 12.1481 14.6477 11.4981 14.881C10.8481 15.1144 10.1948 15.231 9.53811 15.231M9.53811 14.231C10.8648 14.231 11.9851 13.7744 12.8991 12.861C13.8124 11.9477 14.2691 10.8274 14.2691 9.50002C14.2691 8.17269 13.8128 7.05269 12.9001 6.14002C11.9874 5.22735 10.8674 4.77069 9.54011 4.77002C8.21277 4.77002 7.09244 5.22669 6.17911 6.14002C5.26577 7.05335 4.80877 8.17335 4.80811 9.50002C4.80744 10.8267 5.26411 11.9467 6.17811 12.86C7.09211 13.7734 8.21211 14.23 9.53811 14.23"
					fill="white"
				/>
				<path
					d="M13.245 13.245C15.585 10.905 15.585 7.105 13.245 4.755C10.905 2.415 7.105 2.415 4.755 4.755C2.415 7.095 2.415 10.895 4.755 13.245C7.095 15.585 10.895 15.585 13.245 13.245Z"
					stroke="white"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M13.5039 13.5049L21.0039 21.0049"
					stroke="white"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
		</svg>
	);
}

function FilterIcon() {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
			<g opacity="0.7">
				<path
					d="M5 4H19L14 10.5V20L10 16V10.5L5 4Z"
					stroke="white"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
		</svg>
	);
}

function PaginationArrow({ direction }: { direction: "prev" | "next" }) {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
			<path
				d={direction === "prev" ? "M14.5 5L7.5 12L14.5 19" : "M9.5 5L16.5 12L9.5 19"}
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default function CasesBrowser() {
	const casesTopRef = useRef<HTMLDivElement>(null);
	const [search, setSearch] = useState("");
	const [selectedTypes, setSelectedTypes] = useState<CaseType[]>([]);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [page, setPage] = useState(1);

	const filteredCases = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();

		return casesItems.filter((caseItem) => {
			const matchesType =
				selectedTypes.length === 0 || selectedTypes.includes(caseItem.type);
			const searchableText = [
				caseItem.company_name,
				caseItem.case_title,
				caseItem.problem,
				caseItem.fix,
				caseItem.work,
				caseItem.triumph,
				caseItem.type,
			]
				.join(" ")
				.toLowerCase();

			return matchesType && searchableText.includes(normalizedSearch);
		});
	}, [search, selectedTypes]);

	const pageCount = Math.max(1, Math.ceil(filteredCases.length / CASES_PER_PAGE));
	const safePage = Math.min(page, pageCount);
	const currentCases = filteredCases.slice(
		(safePage - 1) * CASES_PER_PAGE,
		safePage * CASES_PER_PAGE
	);

	function updateSearch(value: string) {
		setSearch(value);
		setPage(1);
	}

	function toggleType(type: CaseType) {
		setSelectedTypes((currentTypes) =>
			currentTypes.includes(type)
				? currentTypes.filter((currentType) => currentType !== type)
				: [...currentTypes, type]
		);
		setPage(1);
	}

	function goToPage(pageNumber: number) {
		setPage(pageNumber);
		window.requestAnimationFrame(() => {
			casesTopRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		});
	}

	return (
		<main className="cases_page-main">
			<div className="content_container cases_page-container" ref={casesTopRef}>
				<h1 className="cases_page-title">Our Cases</h1>

				<div className="cases_page-controls">
					<label className="cases_search">
						<SearchIcon />
						<input
							type="search"
							value={search}
							placeholder="Search..."
							onChange={(event) => updateSearch(event.target.value)}
						/>
					</label>

					<div className="cases_filter">
						<button
							type="button"
							className={`cases_filter-button ${isFilterOpen ? "active" : ""}`}
							aria-expanded={isFilterOpen}
							onClick={() => setIsFilterOpen((current) => !current)}
						>
							<FilterIcon />
							Filters
						</button>

						{isFilterOpen ? (
							<div className="cases_filter-menu">
								{caseTypes.map((type) => (
									<label className="cases_filter-option" key={type}>
										<input
											type="checkbox"
											checked={selectedTypes.includes(type)}
											onChange={() => toggleType(type)}
										/>
										<span>{formatCaseType(type)}</span>
									</label>
								))}
							</div>
						) : null}
					</div>
				</div>

				{currentCases.length > 0 ? (
					<div className="cases_page-grid">
						{currentCases.map((caseItem) => (
							<CasesCard key={caseItem.id} {...caseItem} />
						))}
					</div>
				) : (
					<div className="cases_empty cases_block">No cases found</div>
				)}

				<div className="cases_pagination cases_catalog-pagination" aria-label="Cases pagination">
					<button
						type="button"
						className="cases_pagination-arrow cases_pagination-arrow--prev"
						aria-label="Previous page"
						disabled={safePage === 1}
						onClick={() => goToPage(safePage - 1)}
					>
						<PaginationArrow direction="prev" />
					</button>

					<div className="cases_pagination-dots">
						{Array.from({ length: pageCount }, (_, index) => {
							const pageNumber = index + 1;

							return (
								<button
									key={pageNumber}
									type="button"
									className={`cases_pagination-dot ${pageNumber === safePage ? "active" : ""
										}`}
									aria-label={`Page ${pageNumber}`}
									aria-current={pageNumber === safePage ? "page" : undefined}
									onClick={() => goToPage(pageNumber)}
								/>
							);
						})}
					</div>

					<button
						type="button"
						className="cases_pagination-arrow cases_pagination-arrow--next"
						aria-label="Next page"
						disabled={safePage === pageCount}
						onClick={() => goToPage(safePage + 1)}
					>
						<PaginationArrow direction="next" />
					</button>
				</div>
			</div>
		</main>
	);
}
