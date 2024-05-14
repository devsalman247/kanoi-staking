export default function Layout({ children }) {
	return (
		<>
			<div className="flex flex-col md:overflow-x-hidden">{children}</div>
		</>
	);
}
