import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import Header from "./components/Header.jsx";
import FooterCom from "./components/FooterCom.jsx";
import { PrivateRoute } from "./components/PrivateRoute.jsx";
import { AdminPrivateRoute } from "./components/AdminPrivateRoute.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import UpdatePost from "./pages/UpdatePost.jsx";
import PostPage from "./pages/PostPage.jsx";
import { ScrollToTop } from "./components/ScrollToTop.jsx";
import { Search } from "./pages/Search.jsx";

const App = () => {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Header />
			<Routes>
				<Route path="/signin" element={<SignIn />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/search" element={<Search />} />
				<Route element={<PrivateRoute />}>
					<Route path="/dashboard" element={<Dashboard />} />
				</Route>
				<Route element={<AdminPrivateRoute />}>
					<Route path="/create-post" element={<CreatePost />} />
					<Route
						path="/update-post/:postId"
						element={<UpdatePost />}
					/>
				</Route>

				<Route path="/projects" element={<Projects />} />
				<Route path="/post/:postSlug" element={<PostPage />} />
			</Routes>
			<FooterCom />
		</BrowserRouter>
	);
};

export default App;
