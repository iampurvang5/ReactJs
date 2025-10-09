import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; //npm install react-router-dom
import Swal from "sweetalert2"; //npm install sweetalert2
import { AuthContext } from "../context/AuthContext";
import { useSelector } from 'react-redux';

export default function Registration() {
	const theme = useSelector((state) => state.theme.mode);
	const baseUrl = "http://192.168.1.5:3000/api";
	const [formData, setFormData] = useState({
	firstName: "",
	lastName: "",
	email: "",
	alternateEmail: "",
	password: "",
	birthDate: "",
	address: "",
	mobileNumber: "",
	profilePictureUrl: "",
	portfolioUrl: "",
	twitterUrl: "",
	instagramUrl: "",
	linkedinUrl: "",
	githubUrl: "",
	username: "",
	about: ""
	});

	const [errors, setErrors] = useState({});
	const { setUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const validateField = (name, value) => {
	switch (name) {
		case "firstName":
		case "lastName":
		if (!value.trim()) return "This field is required";
		if (value.length < 2) return "Minimum 2 characters required";
		return "";
		case "email":
		case "alternateEmail":
		if (!value.trim()) return "This field is required";
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) return "Please enter a valid email";
		return "";
		case "password":
		if (!value.trim()) return "This field is required";
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		if (!passwordRegex.test(value)) return "Password must be at least 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 special character";
		return "";
		case "birthDate":
		if (!value) return "Please select a birth date";
		const today = new Date();
		const birth = new Date(value);
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
			age--;
		}
		if (age < 13) return "You must be at least 13 years old";
		return "";
		case "address":
		if (!value.trim()) return "This field is required";
		if (value.length < 10) return "Address must be at least 10 characters";
		return "";
		case "mobileNumber":
		if (!value.trim()) return "This field is required";
		const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
		if (!phoneRegex.test(value.replace(/\s/g, ""))) return "Please enter a valid mobile number";
		return "";
		case "profilePictureUrl":
		if (!value.trim()) return "This field is required";
		const imageUrlRegex = /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp|bmp)(\?.*)?$/i;
		if (!imageUrlRegex.test(value)) return "Please enter a valid image URL";
		return "";
		case "portfolioUrl":
		if (value && !/^https?:\/\/.*/.test(value)) return "Please enter a valid URL";
		return "";
		case "twitterUrl":
		case "instagramUrl":
		case "linkedinUrl":
		case "githubUrl":
		if (value && !/^https?:\/\/.*/.test(value)) return "Please enter a valid URL";
		return "";
		case "username":
		if (!value.trim()) return "This field is required";
		if (value.length < 3) return "Username must be at least 3 characters";
		if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Username can only contain letters, numbers, and underscores";
		return "";
		case "about":
		if (!value.trim()) return "This field is required";
		if (value.length < 20) return "Description must be at least 20 characters";
		if (value.length > 500) return "Description must not exceed 500 characters";
		return "";
		default:
		return "";
	}
	};

	const handleChange = (e) => {
	const { name, value } = e.target;
	setFormData({ ...formData, [name]: value });

	// Validate field on change
	const error = validateField(name, value);
	setErrors(prev => ({
		...prev,
		[name]: error
	}));
	};

	const handleSubmit = async (e) => {
	e.preventDefault();

	// Validate all fields
	const newErrors = {};
	Object.keys(formData).forEach(key => {
		const error = validateField(key, formData[key]);
		if (error) newErrors[key] = error;
	});

	setErrors(newErrors);

	if (Object.keys(newErrors).length === 0) {
		// Construct payload
		const payload = {
		firstName: formData.firstName,
		lastName: formData.lastName,
		username: formData.username,
		email: formData.email,
		alternateEmail: formData.alternateEmail || undefined,
		password: formData.password,
		birthDate: formData.birthDate,
		address: formData.address,
		mobileNumber: formData.mobileNumber,
		profilePictureUrl: formData.profilePictureUrl,
		portfolioUrl: formData.portfolioUrl || undefined,
		socialLinks: {
			twitter: formData.twitterUrl || undefined,
			instagram: formData.instagramUrl || undefined,
			linkedin: formData.linkedinUrl || undefined,
			github: formData.githubUrl || undefined
		},
		about: formData.about
		};

		// Remove undefined fields from socialLinks
		Object.keys(payload.socialLinks).forEach(key => {
		if (payload.socialLinks[key] === undefined) {
			delete payload.socialLinks[key];
		}
		});

		// Remove undefined fields from payload
		Object.keys(payload).forEach(key => {
		if (payload[key] === undefined) {
			delete payload[key];
		}
		});

		try {
		// Show loading alert
		Swal.fire({
			title: "Registering...",
			text: "Please wait while we create your account.",
			allowOutsideClick: false,
			didOpen: () => {
			Swal.showLoading();
			}
		});

		const response = await fetch(baseUrl+"/auth/register", {
			method: "POST",
			headers: {
			"Content-Type": "application/json"
			},
			body: JSON.stringify(payload)
		});

		if (response.ok) {
			const userData = await response.json();
			// Set user in context (adjust based on API response)
			setUser({ id: userData._id, email: userData.email, name: `${userData.firstName} ${userData.lastName}` });
			Swal.fire({
			icon: "success",
			title: "Registration Successful!",
			text: "Your account has been created.",
			timer: 2000,
			showConfirmButton: false
			});
			// Redirect to home page
			navigate("/");
			// Reset form
			setFormData({
			firstName: "",
			lastName: "",
			email: "",
			alternateEmail: "",
			password: "",
			birthDate: "",
			address: "",
			mobileNumber: "",
			profilePictureUrl: "",
			portfolioUrl: "",
			twitterUrl: "",
			instagramUrl: "",
			linkedinUrl: "",
			githubUrl: "",
			username: "",
			about: ""
			});
			setErrors({});
		} else {
			// Error
			const errorData = await response.json();
			Swal.fire({
			icon: "error",
			title: "Registration Failed",
			text: errorData.message || "Something went wrong. Please try again.",
			});
		}
		} catch (error) {
		Swal.fire({
			icon: "error",
			title: "Error",
			text: "Failed to connect to the server. Please check your network and try again.",
		});
		}
	}
	};

	return (
	<div className="flex items-center justify-center p-6">
		<div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-6xl">
		<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
			Create Account
		</h2>
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Personal Information */}
			<div>
			<h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					First Name *
				</label>
				<input
					type="text"
					name="firstName"
					value={formData.firstName}
					onChange={handleChange}
					className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 ${
					errors.firstName ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder="Enter your first name"
				/>
				{errors.firstName && (
					<p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
				)}
				</div>
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Last Name *
				</label>
				<input
					type="text"
					name="lastName"
					value={formData.lastName}
					onChange={handleChange}
					className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 ${
					errors.lastName ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder="Enter your last name"
				/>
				{errors.lastName && (
					<p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
				)}
				</div>
			</div>
			</div>

			{/* Contact Information */}
			<div>
			<h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Email *
				</label>
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 ${
					errors.email ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder="Enter your email"
				/>
				{errors.email && (
					<p className="mt-1 text-sm text-red-600">{errors.email}</p>
				)}
				</div>
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Alternate Email
				</label>
				<input
					type="email"
					name="alternateEmail"
					value={formData.alternateEmail}
					onChange={handleChange}
					className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 ${
					errors.alternateEmail ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder="Enter alternate email (optional)"
				/>
				{errors.alternateEmail && (
					<p className="mt-1 text-sm text-red-600">{errors.alternateEmail}</p>
				)}
				</div>
			</div>
			</div>

			{/* Account Credentials */}
			<div>
			<h3 className="text-lg font-semibold text-gray-800 mb-4">Account Credentials</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Username *
				</label>
				<input
					type="text"
					name="username"
					value={formData.username}
					onChange={handleChange}
					className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 ${
					errors.username ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder="Enter a unique username"
				/>
				{errors.username && (
					<p className="mt-1 text-sm text-red-600">{errors.username}</p>
				)}
				</div>
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Password *
				</label>
				<input
					type="password"
					name="password"
					value={formData.password}
					onChange={handleChange}
					className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 ${
					errors.password ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder="Enter your password"
				/>
				{errors.password && (
					<p className="mt-1 text-sm text-red-600">{errors.password}</p>
				)}
				</div>
			</div>
			</div>

			{/* Additional Information */}
			<div>
			<h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Birth Date *
				</label>
				<input
					type="date"
					name="birthDate"
					value={formData.birthDate}
					onChange={handleChange}
					className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${
					errors.birthDate ? 'border-red-500' : 'border-gray-300'
					}`}
					max={new Date().toISOString().split('T')[0]}
				/>
				{errors.birthDate && (
					<p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
				)}
				</div>
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Mobile Number *
				</label>
				<input
					type="tel"
					name="mobileNumber"
					value={formData.mobileNumber}
					onChange={handleChange}
					className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 ${
					errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder="+1 234 567 8900"
				/>
				{errors.mobileNumber && (
					<p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
				)}
				</div>
			</div>
			</div>

			{/* Address */}
			<div>
			<h3 className="text-lg font-semibold text-gray-800 mb-4">Address</h3>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
				Address *
				</label>
				<textarea
				name="address"
				value={formData.address}
				onChange={handleChange}
				rows="3"
				className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 resize-y ${
					errors.address ? 'border-red-500' : 'border-gray-300'
				}`}
				placeholder="Enter your full address"
				/>
				{errors.address && (
				<p className="mt-1 text-sm text-red-600">{errors.address}</p>
				)}
			</div>
			</div>

			{/* Online Presence */}
			<div>
			<h3 className="text-lg font-semibold text-gray-800 mb-4">Online Presence</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Profile Picture URL *
				</label>
				<input
					type="url"
					name="profilePictureUrl"
					value={formData.profilePictureUrl}
					onChange={handleChange}
					className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 ${
					errors.profilePictureUrl ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder="https://example.com/profile.jpg"
				/>
				{errors.profilePictureUrl && (
					<p className="mt-1 text-sm text-red-600">{errors.profilePictureUrl}</p>
				)}
				</div>
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Portfolio URL
				</label>
				<input
					type="url"
					name="portfolioUrl"
					value={formData.portfolioUrl}
					onChange={handleChange}
					className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 ${
					errors.portfolioUrl ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder="https://example.com/portfolio"
				/>
				{errors.portfolioUrl && (
					<p className="mt-1 text-sm text-red-600">{errors.portfolioUrl}</p>
				)}
				</div>
			</div>
			</div>

			{/* Social Media Links */}
			<div>
			<h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media Links</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Twitter URL
				</label>
				<input
					type="url"
					name="twitterUrl"
					value={formData.twitterUrl}
					onChange={handleChange}
					className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 ${
					errors.twitterUrl ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder="https://twitter.com/username"
				/>
				{errors.twitterUrl && (
					<p className="mt-1 text-sm text-red-600">{errors.twitterUrl}</p>
				)}
				</div>
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Instagram URL
				</label>
				<input
					type="url"
					name="instagramUrl"
					value={formData.instagramUrl}
					onChange={handleChange}
					className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 ${
					errors.instagramUrl ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder="https://instagram.com/username"
				/>
				{errors.instagramUrl && (
					<p className="mt-1 text-sm text-red-600">{errors.instagramUrl}</p>
				)}
				</div>
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					LinkedIn URL
				</label>
				<input
					type="url"
					name="linkedinUrl"
					value={formData.linkedinUrl}
					onChange={handleChange}
					className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 ${
					errors.linkedinUrl ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder="https://linkedin.com/in/username"
				/>
				{errors.linkedinUrl && (
					<p className="mt-1 text-sm text-red-600">{errors.linkedinUrl}</p>
				)}
				</div>
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					GitHub URL
				</label>
				<input
					type="url"
					name="githubUrl"
					value={formData.githubUrl}
					onChange={handleChange}
					className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 ${
					errors.githubUrl ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder="https://github.com/username"
				/>
				{errors.githubUrl && (
					<p className="mt-1 text-sm text-red-600">{errors.githubUrl}</p>
				)}
				</div>
			</div>
			</div>

			{/* About/Description */}
			<div>
			<h3 className="text-lg font-semibold text-gray-800 mb-4">About</h3>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
				About/Description *
				</label>
				<textarea
				name="about"
				value={formData.about}
				onChange={handleChange}
				rows="4"
				className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 resize-y ${
					errors.about ? 'border-red-500' : 'border-gray-300'
				}`}
				placeholder="Tell us about yourself (20-500 characters)"
				/>
				<p className="text-xs text-gray-500 mt-1">
				{formData.about.length}/500 characters
				</p>
				{errors.about && (
				<p className="mt-1 text-sm text-red-600">{errors.about}</p>
				)}
			</div>
			</div>

			{/* Submit Button */}
			<div className="flex justify-end gap-4 pt-4">
			<button
				type="button"
				onClick={() => navigate("/login")}
				className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
			>
				Cancel
			</button>
			<button
				type="submit"
				className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={Object.keys(errors).length > 0 && Object.values(errors).some(err => err)}
			>
				Create Account
			</button>
			</div>
		</form>
		</div>
	</div>
	);
}