import { Modal, Table, Button } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashUsers = () => {
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user);
	const [users, setUsers] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModel] = useState(false);
	const [userIdToDelete, setUserIdToDelete] = useState("");

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await fetch(`/api/user/getusers`);

				if (!res.ok) {
					console.log(data.message);
					return;
				}

				const data = await res.json();
				setUsers(data.users);

				if (data.users.length < 9) {
					setShowMore(false);
				}
			} catch (error) {
				console.error("Error fetching posts:", error.message);
			}
		};

		if (currentUser.user.isAdmin) {
			fetchUsers();
		}
	}, [currentUser]);

	const handleShowMore = async () => {
		const startIndex = users.length;
		try {
			const res = await fetch(
				`/api/user/getusers?startIndex=${startIndex}`
			);

			if (!res.ok) {
				throw new Error(`Server error: ${res.status}`);
			}

			const data = await res.json();
			setUsers((prev) => [...prev, ...data.users]);

			if (data.users.length < 9) {
				setShowMore(false);
			}
		} catch (error) {
			console.error("Error fetching more posts:", error.message);
		}
	};

	const handleDeleteUser = async () => {
		setShowModel(false);
		try {
			const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
				method: "DELETE",
			});

			const data = await res.json();
			if (res.ok) {
				setUsers((prev) =>
					prev.filter((user) => user._id !== userIdToDelete)
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
			{currentUser?.user?.isAdmin && users.length > 0 ? (
				<>
					<Table hoverable className="shadow-md">
						<Table.Head>
							<Table.HeadCell>Date created</Table.HeadCell>
							<Table.HeadCell>User image</Table.HeadCell>
							<Table.HeadCell>Username</Table.HeadCell>
							<Table.HeadCell>Email</Table.HeadCell>
							<Table.HeadCell>Admin</Table.HeadCell>
							<Table.HeadCell>Delete</Table.HeadCell>
						</Table.Head>
						<Table.Body className="divide-y">
							{users.map((user) => (
								<Table.Row
									key={user._id}
									className="bg-white dark:border-gray-700 dark:bg-gray-800"
								>
									<Table.Cell>
										{new Date(
											user.createdAt
										).toLocaleDateString()}
									</Table.Cell>
									<Table.Cell>
										<img
											src={user.profilePicture}
											alt={user.username}
											className="w-10 h-10 object-cover bg-gray-500 rounded-full"
										/>
									</Table.Cell>
									<Table.Cell>{user.username}</Table.Cell>
									<Table.Cell>{user.email}</Table.Cell>
									<Table.Cell>
										{user.isAdmin ? (
											<FaCheck className="text-green-500" />
										) : (
											<FaTimes className="text-red-500" />
										)}
									</Table.Cell>
									<Table.Cell>
										<span
											onClick={() => {
												setShowModel(true);
												setUserIdToDelete(user._id);
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
							<Button color="failure" onClick={handleDeleteUser}>
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

export default DashUsers;
