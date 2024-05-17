import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export const AdminPrivateRoute = () => {
	const { currentUser } = useSelector((state) => state.user);
	console.log("admin private routes", currentUser.user.isAdmin);

	return currentUser.user && currentUser.user.isAdmin ? (
		<Outlet />
	) : (
		<Navigate to="/signin" />
	);
};
