import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "../components/GoogleAuth.jsx";

const SignUp = () => {
	const [formData, setFormData] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const handleOnChangeInput = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
	};

	const handleOnSubmit = async (e) => {
		e.preventDefault();
		if (!formData.username || !formData.email || !formData.password) {
			return setErrorMessage("Please fill out all fields.");
		}
		try {
			setLoading(true);

			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				setLoading(false);
				setErrorMessage(data.message);
				return;
			}
			setLoading(false);
			setErrorMessage(null);
			navigate("/signin");
		} catch (error) {
			setErrorMessage(error.message);
			setLoading(false);
		}
	};
	console.log(formData);
	return (
		<div className="min-h-screen mt-20">
			<div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
				{/* left */}
				<div className="flex-1">
					<Link className="font-bold dark:text-white text-4xl" to="/">
						<span className="px-2 py-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 rounded-lg text-white">
							Kartikey
						</span>
						Blog
					</Link>
					<p className="text-sm mt-5">
						This is demo project . You can signup with your emailand
						password or with google
					</p>
				</div>
				{/* right */}
				<div className="flex-1">
					<form
						className="flex flex-col gap-4"
						onSubmit={handleOnSubmit}
					>
						<div className="">
							<Label value="Your username" />
							<TextInput
								type="text"
								placeholder="Username"
								id="username"
								onChange={handleOnChangeInput}
							/>
						</div>
						<div className="">
							<Label value="Your email" />
							<TextInput
								type="email"
								placeholder="name@company.com"
								id="email"
								onChange={handleOnChangeInput}
							/>
						</div>
						<div className="">
							<Label value="Your password" />
							<TextInput
								type="password"
								placeholder="password"
								id="password"
								onChange={handleOnChangeInput}
							/>
						</div>
						<Button
							gradientDuoTone="purpleToPink"
							type="submit"
							disabled={loading}
						>
							{loading ? (
								<>
									<Spinner size="sm" />
									<span className="pl-3">Loading...</span>
								</>
							) : (
								"Sign Up"
							)}
						</Button>
						<GoogleAuth />
					</form>
					<div className="flex gap-2 text-sm mt-5">
						<span>Have an account?</span>
						<Link to="/signin" className="text-blue-500">
							Sign In
						</Link>
					</div>
					{errorMessage && (
						<Alert className="mt-5" color="failure">
							{errorMessage}
						</Alert>
					)}
				</div>
			</div>
		</div>
	);
};

export default SignUp;
