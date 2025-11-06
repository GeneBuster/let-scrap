import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // --- Import useNavigate ---
import {
    User, Mail, Phone, MapPin, Star, Key, Edit, Save, X, ShieldCheck,
    Loader2, CheckCircle, Upload, Smile, LogOut // --- Added LogOut icon ---
} from 'lucide-react';

// Helper components (ProfileField, FormInput) remain the same...
// Helper component for styled profile fields
const ProfileField = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3">
        <span className="text-gray-500">{icon}</span>
        <div className="flex-1 min-w-0"> {/* Added min-w-0 */}
            <p className="text-xs font-medium text-gray-500 uppercase truncate">{label}</p> {/* Added truncate */}
            <p className="text-gray-800 break-words">{value || 'N/A'}</p>
        </div>
    </div>
);
// Helper component for styled form inputs
const FormInput = ({ icon, label, name, value, onChange, placeholder, type = 'text' }) => (
    <div className="flex items-center space-x-3">
        <span className="text-gray-500">{icon}</span>
        <div className="flex-1">
            <label htmlFor={name} className="text-xs font-medium text-gray-500 uppercase">{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    </div>
);

// Avatar Options remain the same...
const avatarOptions = [
    { value: 'email', label: 'Default (Email-based)' },
    { value: 'pixel-art', label: 'Pixel Art' },
    { value: 'bottts', label: 'Robots' },
    { value: 'adventurer', label: 'Adventurer' },
    { value: 'shapes', label: 'Abstract Shapes' },
    { value: 'fun-emoji', label: 'Fun Emoji' },
];
const defaultDiceBearStyle = 'identicon';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '',
        address: { street: '', city: '', state: '', zip: '' },
        avatarSeed: 'email',
    });

    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // --- New State for Image Upload ---
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    // ---------------------------------
    const fileInputRef = useRef(null);
    const navigate = useNavigate(); // --- Initialize useNavigate ---

    // Fetch user data
    useEffect(() => {
        // ... (fetch logic remains largely the same) ...
        const fetchUserData = async () => {
            setInitialLoading(true);
            setError(null); setUpdateSuccess('');
            const storedInfo = localStorage.getItem("userInfo");
            const token = storedInfo ? JSON.parse(storedInfo).token : null;
            if (!token) {
                setError("No authentication token found. Please log in.");
                setInitialLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, { headers: { Authorization: `Bearer ${token}` } });
                const userData = response.data;
                setUser(userData);
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: { street: userData.address?.street || '', city: userData.address?.city || '', state: userData.address?.state || '', zip: userData.address?.zip || '' },
                    avatarSeed: userData.avatarSeed || 'email',
                });
                // --- Reset image preview on initial load ---
                setSelectedFile(null);
                setPreviewUrl(null);
                // -------------------------------------------
            } catch (err) { /* ... handle fetch error ... */
                console.error('Failed to fetch user data:', err);
                setError(err.response?.data?.message || 'Failed to load profile data. Please try again.');
            } finally { setInitialLoading(false); }
        };
        fetchUserData();
    }, []);

    // Handle form changes
    const handleFormChange = (e) => { /* ... (no changes needed) ... */
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Handle profile update
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setError(null); setUpdateSuccess(''); setIsUpdatingProfile(true);
        const storedInfo = localStorage.getItem("userInfo");
        const token = storedInfo ? JSON.parse(storedInfo).token : null;


        // --- SDE Note: If selectedFile exists, upload it first (logic not implemented) ---
        if (selectedFile) {
            console.warn("Profile picture upload is not implemented on the backend yet.");
            // In a real app:
            // 1. Create FormData
            // 2. Append selectedFile to FormData
            // 3. Make a POST request to an upload endpoint (e.g., /api/users/upload-avatar)
            // 4. Get the URL of the uploaded image from the response
            // 5. Add that URL to the 'formData' object before the PUT request below
            // For now, we'll just proceed without uploading.
        }
        // --------------------------------------------------------------------------

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/users/profile`,
                formData, // Includes avatarSeed, potentially add uploaded image URL here
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedUserData = response.data.user;
            setUser(updatedUserData);
            setFormData({ // Re-sync form data
                name: updatedUserData.name || '', email: updatedUserData.email || '', phone: updatedUserData.phone || '',
                address: { street: updatedUserData.address?.street || '', city: updatedUserData.address?.city || '', state: updatedUserData.address?.state || '', zip: updatedUserData.address?.zip || '' },
                avatarSeed: updatedUserData.avatarSeed || 'email',
            });
            setIsEditing(false);
            setUpdateSuccess('Profile updated successfully!');
            // --- Clear preview after successful save ---
            setSelectedFile(null);
            setPreviewUrl(null);
            // ------------------------------------------
            setTimeout(() => setUpdateSuccess(''), 3000);
        } catch (err) { /* ... handle update error ... */
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally { setIsUpdatingProfile(false); }
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setIsEditing(false); setError(null);
        setFormData({ // Reset form
            name: user.name || '', email: user.email || '', phone: user.phone || '',
            address: { street: user.address?.street || '', city: user.address?.city || '', state: user.address?.state || '', zip: user.address?.zip || '' },
            avatarSeed: user?.avatarSeed || 'email',
        });
        // --- Clear image preview on cancel ---
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) { fileInputRef.current.value = ""; } // Reset file input
        // ------------------------------------
    };

    // Handle password change input
    const handlePasswordChange = (e) => { /* ... (no changes needed) ... */
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle password change submission
    const handleSubmitPasswordChange = async (e) => { /* ... (no changes needed) ... */
        e.preventDefault();
        setPasswordError(''); setPasswordSuccess('');
        if (passwordData.newPassword !== passwordData.confirmPassword) { setPasswordError('New passwords do not match.'); return; }
        setIsUpdatingPassword(true);
        try {
            const storedInfo = localStorage.getItem("userInfo");
            const token = storedInfo ? JSON.parse(storedInfo).token : null;
            if (!token) throw new Error('Authentication token not found.');
            await axios.put(`${process.env.REACT_APP_API_URL}/api/users/change-password`, { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }, { headers: { Authorization: `Bearer ${token}` } });
            setPasswordSuccess('Password updated successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setPasswordSuccess(''), 3000);
        } catch (err) {
            console.error('Error changing password:', err); setPasswordError(err.response?.data?.message || 'Failed to update password.');
        } finally { setIsUpdatingPassword(false); }
    };

    // Handle profile picture click
    const handleProfilePicClick = () => { fileInputRef.current.click(); };

    // --- Updated: Handle file input change ---
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file); // Store the file object
            // Create a temporary URL for preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
            console.log("Selected file:", file.name);
            // Note: Actual upload happens in handleUpdateSubmit (or could happen immediately here)
        } else {
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    };
    // -----------------------------------------

    // Determine Avatar URL
    const getAvatarUrl = () => {
        // --- If a preview URL exists, use it ---
        if (previewUrl) {
            return previewUrl;
        }
        // --- Otherwise, use DiceBear as before ---
        const selectedStyleOrSeed = isEditing ? formData.avatarSeed : (user?.avatarSeed || 'email');
        let style = defaultDiceBearStyle;
        let seed = user?.email || 'defaultUser';
        if (selectedStyleOrSeed !== 'email') { style = selectedStyleOrSeed; seed = user?.email || selectedStyleOrSeed; }
        return `https://api.dicebear.com/8.x/${style}/svg?seed=${encodeURIComponent(seed)}&radius=50&size=128`;
    };

    // --- New: Handle Logout ---
    const handleLogout = () => {
        localStorage.removeItem('userInfo'); // new storage key
        navigate('/login');
    };

    // --------------------------

    // --- Loading/Error/Empty States ---
    if (initialLoading) { /* ... loading spinner ... */
        return (<div className="flex items-center justify-center min-h-screen bg-gray-100"> <Loader2 className="animate-spin text-blue-600" size={48} /> </div>);
    }
    if (error && !user) { /* ... full page error ... */
        return (<div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans"> <div className="max-w-4xl mx-auto"> <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert"> <strong className="font-bold">Error: </strong> <span className="block sm:inline">{error}</span> </div> </div> </div>);
    }
    if (!user) { /* ... could not find user ... */
        return (<div className="flex items-center justify-center min-h-screen bg-gray-100"> <div className="text-lg font-medium text-gray-600">Could not find user data.</div> </div>);
    }
    // ------------------------------------

    // --- Success State ---
    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* --- Header with Logout Button --- */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150 transform hover:scale-105"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
                {/* ------------------------------------ */}


                {/* Update Success Message */}
                {updateSuccess && ( /* ... success message ... */
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 flex items-center space-x-2" role="alert"> <CheckCircle size={18} /> <span className="block sm:inline">{updateSuccess}</span> </div>
                )}
                {/* Display error during updates */}
                {error && ( /* ... error message ... */
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert"> <strong className="font-bold">Error: </strong> <span className="block sm:inline">{error}</span> </div>
                )}

                {/* --- Main Profile Card --- */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    <form onSubmit={handleUpdateSubmit}>
                        <div className="md:flex">
                            {/* Left Column (Avatar & Role) */}
                            <div className="relative md:w-1/3 bg-gradient-to-b from-blue-500 to-blue-600 p-8 text-white flex flex-col items-center justify-center">
                                {/* Profile Picture Interaction (uses previewUrl or getAvatarUrl) */}
                                <div className="relative group cursor-pointer" onClick={handleProfilePicClick}>
                                    <img
                                        src={previewUrl || getAvatarUrl()} // --- Show preview if available ---
                                        alt="Profile Avatar"
                                        className="rounded-full w-32 h-32 border-4 border-white shadow-lg mb-4 transition-opacity duration-300 group-hover:opacity-70 bg-gray-300 object-cover" // Added object-cover
                                        onError={(e) => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/8.x/initials/svg?seed=${user.name || '?'}&radius=50&size=128` }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"> <Upload size={32} className="text-white" /> </div>
                                </div>
                                {/* Hidden file input */}
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

                                {/* Name, Email, Role, Rating */}
                                <h2 className="text-2xl font-bold text-center">{user.name}</h2>
                                <p className="text-blue-100 text-sm break-all w-full text-center">{user.email}</p>
                                <span className="mt-4 px-3 py-1 bg-white text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">{user.role}</span>
                                {user.role === 'dealer' && (<div className="mt-4 flex items-center space-x-1 text-yellow-300"> <Star size={20} /> <span className="text-lg font-bold">{(user.averageRating || 0).toFixed(1)}</span> <span className="text-sm text-blue-100">({user.ratingCount || 0} reviews)</span> </div>)}

                                {/* Avatar Dropdown (only in edit mode) */}
                                {isEditing && (
                                    <div className="mt-6 w-full">
                                        <label htmlFor="avatarSeed" className="text-xs font-medium text-blue-100 uppercase flex items-center space-x-1 mb-1"> <Smile size={14} /> <span>Avatar Style</span> </label>
                                        <div className="relative">
                                            <select id="avatarSeed" name="avatarSeed" value={formData.avatarSeed} onChange={handleFormChange} className="w-full p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-blue-500 text-white appearance-none cursor-pointer">
                                                {avatarOptions.map(option => (<option key={option.value} value={option.value} className="bg-blue-600">{option.label}</option>))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-100"> <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg> </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column (Info & Form) */}
                            <div className="md:w-2/3 p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-800">Profile Information</h3>
                                    {/* Edit/Save/Cancel Buttons */}
                                    {!isEditing ? (<button type="button" onClick={() => setIsEditing(true)} className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition duration-150 transform hover:scale-105"> <Edit size={16} /> <span className="font-medium">Edit</span> </button>) : (<div className="flex space-x-2"> <button type="submit" disabled={isUpdatingProfile} className={`flex items-center space-x-1 px-3 py-1 rounded-md transition duration-150 transform hover:scale-105 ${isUpdatingProfile ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}> {isUpdatingProfile ? (<Loader2 className="animate-spin" size={16} />) : (<Save size={16} />)} <span className="font-medium"> {isUpdatingProfile ? 'Saving...' : 'Save'} </span> </button> <button type="button" onClick={handleCancelEdit} disabled={isUpdatingProfile} className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-150 transform hover:scale-105 disabled:opacity-50"> <X size={16} /> <span className="font-medium">Cancel</span> </button> </div>)}
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-6">
                                    {/* Personal Info Section */}
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Personal</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {isEditing ? <FormInput icon={<User size={20} />} label="Full Name" name="name" value={formData.name} onChange={handleFormChange} placeholder="Your full name" /> : <ProfileField icon={<User size={20} />} label="Full Name" value={user.name} />}
                                        {isEditing ? <FormInput icon={<Mail size={20} />} label="Email Address" name="email" value={formData.email} onChange={handleFormChange} placeholder="your@email.com" type="email" /> : <ProfileField icon={<Mail size={20} />} label="Email Address" value={user.email} />}
                                        {isEditing ? <FormInput icon={<Phone size={20} />} label="Phone Number" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Your phone number" /> : <ProfileField icon={<Phone size={20} />} label="Phone Number" value={user.phone} />}
                                    </div>
                                    {/* Address Section */}
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Address</h4>
                                    <div className="space-y-6">
                                        {isEditing ? <FormInput icon={<MapPin size={20} />} label="Street" name="address.street" value={formData.address.street} onChange={handleFormChange} placeholder="123 Main St" /> : <ProfileField icon={<MapPin size={20} />} label="Street" value={user.address?.street} />}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {isEditing ? (<> <FormInput icon={<span />} label="City" name="address.city" value={formData.address.city} onChange={handleFormChange} placeholder="Prayagraj" /> <FormInput icon={<span />} label="State" name="address.state" value={formData.address.state} onChange={handleFormChange} placeholder="Uttar Pradesh" /> <FormInput icon={<span />} label="ZIP Code" name="address.zip" value={formData.address.zip} onChange={handleFormChange} placeholder="211001" /> </>)
                                                : (<> <ProfileField icon={<span />} label="City" value={user.address?.city} /> <ProfileField icon={<span />} label="State" value={user.address?.state} /> <ProfileField icon={<span />} label="ZIP Code" value={user.address?.zip} /> </>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* --- Change Password Card --- */}
                <div className="mt-8 bg-white rounded-xl shadow-2xl overflow-hidden p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h3>
                    <form onSubmit={handleSubmitPasswordChange} className="space-y-4 max-w-md">
                        <FormInput icon={<Key size={20} />} label="Current Password" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" />
                        <FormInput icon={<Key size={20} />} label="New Password" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="••••••••" />
                        <FormInput icon={<Key size={20} />} label="Confirm New Password" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="••••••••" />
                        {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                        {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}
                        <button type="submit" disabled={isUpdatingPassword} className={`flex items-center justify-center space-x-2 w-full md:w-auto px-6 py-2 rounded-md transition duration-150 transform hover:scale-105 ${isUpdatingPassword ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                            {isUpdatingPassword ? (<Loader2 className="animate-spin" size={18} />) : (<ShieldCheck size={18} />)}
                            <span>{isUpdatingPassword ? 'Updating...' : 'Update Password'}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

