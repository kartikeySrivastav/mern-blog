import { Modal, Table, Button } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashPosts = () => {
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user);

	const [userPost, setUserPost] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModel] = useState(false);
	const [postIdToDelete, setPostIdToDelete] = useState("");

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await fetch(
					`/api/post/getposts?userId=${currentUser.user._id}`
				);

				if (!res.ok) {
					console.log(data.message);
					return;
				}

				const data = await res.json();
				setUserPost(data.posts);

				if (data.posts.length < 9) {
					setShowMore(false);
				}
			} catch (error) {
				console.error("Error fetching posts:", error.message);
			}
		};

		if (currentUser.user.isAdmin) {
			fetchPosts();
		}
	}, [currentUser]);

	const handleShowMore = async () => {
		const startIndex = userPost.length;
		try {
			const res = await fetch(
				`/api/post/getposts?userId=${currentUser.user._id}&startIndex=${startIndex}`
			);

			if (!res.ok) {
				throw new Error(`Server error: ${res.status}`);
			}

			const data = await res.json();
			setUserPost((prev) => [...prev, ...data.posts]);

			if (data.posts.length < 9) {
				setShowMore(false);
			}
		} catch (error) {
			console.error("Error fetching more posts:", error.message);
		}
	};

	const handleDeletePost = async () => {
		setShowModel(false);
		try {
			const res = await fetch(
				`/api/post/deletepost/${postIdToDelete}/${currentUser.user._id}`,
				{
					method: "DELETE",
				}
			);

			const data = await res.json();
			if (res.ok) {
				setUserPost((prev) =>
					prev.filter((post) => post._id !== postIdToDelete)
				);
			} else {
				console.log("Failed to delete post:", data.message);
			}
		} catch (error) {
			console.log("Error deleting post:", error.message);
		}
	};

	if (!currentUser && !currentUser.user.isAdmin) {
		return <p>Loading...</p>;
	}

	return (
		<div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
			{currentUser?.user?.isAdmin && userPost.length > 0 ? (
				<>
					<Table hoverable className="shadow-md">
						<Table.Head>
							<Table.HeadCell>Date updated</Table.HeadCell>
							<Table.HeadCell>Post image</Table.HeadCell>
							<Table.HeadCell>Post title</Table.HeadCell>
							<Table.HeadCell>Category</Table.HeadCell>
							<Table.HeadCell>Delete</Table.HeadCell>
							<Table.HeadCell>
								<span>Edit</span>
							</Table.HeadCell>
						</Table.Head>
						<Table.Body className="divide-y">
							{userPost.map((post) => (
								<Table.Row
									key={post._id}
									className="bg-white dark:border-gray-700 dark:bg-gray-800"
								>
									<Table.Cell>
										{new Date(
											post.updatedAt
										).toLocaleDateString()}
									</Table.Cell>
									<Table.Cell>
										<Link to={`/post/${post.slug}`}>
											<img
												src={post.image}
												alt={post.title}
												className="w-20 h-10 object-cover bg-gray-500"
											/>
										</Link>
									</Table.Cell>
									<Table.Cell>
										<Link
											className="font-medium text-gray-900 dark:text-white"
											to={`/post/${post.slug}`}
										>
											{post.title}
										</Link>
									</Table.Cell>
									<Table.Cell>{post.category}</Table.Cell>
									<Table.Cell>
										<span
											onClick={() => {
												setShowModel(true);
												setPostIdToDelete(post._id);
											}}
											className="font-medium text-red-500 hover:underline cursor-pointer"
										>
											Delete
										</span>
									</Table.Cell>
									<Table.Cell>
										<Link
											className="text-teal-500 hover:underline"
											to={`/update-post/${post._id}`}
										>
											<span>Edit</span>
										</Link>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
					{showMore && (
						<button
							onClick={handleShowMore}
							className="w-full text-teal-500 self-center text-sm  py-7"
						>
							Show More
						</button>
					)}
				</>
			) : (
				<p>You have no post yet.</p>
			)}
			<Modal
				show={showModal}
				onClose={() => setShowModel(false)}
				popup
				size="md"
			>
				<Modal.Header />
				<Modal.Body>
					<div className="text-center">
						<HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
						<h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
							Are you sure you want to delete this post?
						</h3>
						<div className="flex justify-center gap-4">
							<Button color="failure" onClick={handleDeletePost}>
								Yes, I'm sure
							</Button>
							<Button
								color="gray"
								onClick={() => setShowModal(false)}
							>
								No, cancel
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default DashPosts;
