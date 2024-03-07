import { Button, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
	const [formData, setFormData] = useState({});
	const handleOnChangeInput = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleOnSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
		} catch (error) {}
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
						<Button gradientDuoTone="purpleToPink" type="submit">
							Sign Up
						</Button>
					</form>
					<div className="flex gap-2 text-sm mt-5">
						<span>Have an account?</span>
						<Link to="/signin" className="text-blue-500">
							Sign In
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
