import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Search = () => {
	const [sidebarData, setSidebarData] = useState({
		searchTerm: "",
		sort: "desc",
		category: "uncategorized",
	});

	console.log(sidebarData);
	const location = useLocation();

	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showMore, setShowMore] = useState(false);

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		const sortFromUrl = urlParams.get("sort");
		const categoryFromUrl = urlParams.get("category");
		if (searchTermFromUrl || categoryFromUrl || sortFromUrl) {
			setSidebarData({
				...sidebarData,
				searchTerm: searchTermFromUrl,
				sort: sortFromUrl,
				category: categoryFromUrl,
			});
		}
	}, [location.search]);

	return (
		<div>
			<div className="">
				<form>
					<div className="">
						<label>Search term:</label>
					</div>
				</form>
			</div>
		</div>
	);
};
