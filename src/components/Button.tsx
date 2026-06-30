export default function Button({
	title,
	extra,
	onClick,
}: {
	title: string;
	extra?: string;
	onClick?: () => void;
}) {
	return (
		<button className={`btn ${extra}`} onClick={onClick}>{title}</button>
	);
}
