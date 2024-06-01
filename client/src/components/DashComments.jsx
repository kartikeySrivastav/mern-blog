import React, { useState, useEffect } from "react";
import { Modal, Table, Button } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export const DashComments = () => {
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user);
	const [comments, setComments] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModel] = useState(false);
	const [commentIdToDelete, setCommentIdToDelete] = useState("");

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const res = await fetch(`/api/comment/getcomments`);

				if (!res.ok) {
					console.log(data.message);
					return;
				}

				const data = await res.json();
				setComments(data.comments);

				if (data.comments.length < 9) {
					setShowMore(false);
				}
			} catch (error) {
				console.error("Error fetching posts:", error.message);
			}
		};

		if (currentUser.user.isAdmin) {
			fetchComments();
		}
	}, [currentUser.user._id]);

	const handleShowMore = async () => {
		const startIndex = comments.length;
		try {
			const res = await fetch(
				`/api/user/getcomments?startIndex=${startIndex}`
			);

			if (!res.ok) {
				throw new Error(`Server error: ${res.status}`);
			}

			const data = await res.json();
			setComments((prev) => [...prev, ...data.comments]);

			if (data.comments.length < 9) {
				setShowMore(false);
			}
		} catch (error) {
			console.error("Error fetching more posts:", error.message);
		}
	};

	const handleDeleteComment = async () => {
		setShowModel(false);
		try {
			const res = await fetch(
				`/api/comment/deleteComment/${commentIdToDelete}`,
				{
					method: "DELETE",
				}
			);

			const data = await res.json();
			if (res.ok) {
				setComments((prev) =>
					prev.filter((comment) => comment._id !== commentIdToDelete)
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
			{currentUser?.user?.isAdmin && comments.length > 0 ? (
				<>
					<Table hoverable className="shadow-md">
						<Table.Head>
							<Table.HeadCell>Date Updated</Table.HeadCell>
							<Table.HeadCell>Comment Content</Table.HeadCell>
							<Table.HeadCell>Number of likes</Table.HeadCell>
							<Table.HeadCell>PostId</Table.HeadCell>
							<Table.HeadCell>UserId</Table.HeadCell>
							<Table.HeadCell>Delete</Table.HeadCell>
						</Table.Head>
						<Table.Body className="divide-y">
							{comments.map((comment) => (
								<Table.Row
									key={comment._id}
									className="bg-white dark:border-gray-700 dark:bg-gray-800"
								>
									<Table.Cell>
										{new Date(
											comment.updatedAt
										).toLocaleDateString()}
									</Table.Cell>
									<Table.Cell>{comment.content}</Table.Cell>
									<Table.Cell>
										{comment.numberOfLikes}
									</Table.Cell>
									<Table.Cell>{comment.postId}</Table.Cell>
									<Table.Cell>{comment.userId}</Table.Cell>
									<Table.Cell>
										<span
											onClick={() => {
												setShowModel(true);
												setCommentIdToDelete(
													comment._id
												);
											}}
											className="font-medium text-red-500 hover:underline cursor-pointer"
										>
											Delete
										</span>
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
				<p>You have no comments yet.</p>
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
							Are you sure you want to delete this comment?
						</h3>
						<div className="flex justify-center gap-4">
							<Button
								color="failure"
								onClick={handleDeleteComment}
							>
								Yes, I'm sure
							</Button>
							<Button
								color="gray"
								onClick={() => setShowModel(false)}
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
