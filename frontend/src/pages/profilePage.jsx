import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Key,
  Edit,
  Save,
  X,
  ShieldCheck,
} from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
    },
  });

  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          'https://let-scrap.vercel.app/api/users/profile',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userData = response.data;
        setUser(userData);
        // Pre-fill the form data with user's current info
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: {
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            state: userData.address?.state || '',
            zip: userData.address?.zip || '',
          },
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle changes in the main profile form
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // Handle nested address object
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]; // 'street', 'city', 'state', or 'zip'
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      // Handle top-level fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle profile update submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        'https://let-scrap.vercel.app/api/users/profile',
        formData, // Send the entire formData state
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data.user); // Update user with the fresh data from the server
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  };

  // Handle canceling the edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
    // Reset form data back to the original user data
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zip: user.address?.zip || '',
      },
    });
  };

  // Handle password change input
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password change submission
  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    
    // ---
    // SDE Note: In a real app, you would make an API call here.
    // await axios.put('/api/users/change-password', passwordData, ...);
    // For now, we just simulate a success.
    // ---
    
    console.log('Simulating password change with:', passwordData);
    setPasswordSuccess('Password change functionality is not yet implemented.');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  // Helper component for styled profile fields
  const ProfileField = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3">
      <span className="text-gray-500">{icon}</span>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase">
          {label}
        </p>
        <p className="text-gray-800">{value || 'N/A'}</p>
      </div>
    </div>
  );

  // Helper component for styled form inputs
  const FormInput = ({
    icon,
    label,
    name,
    value,
    onChange,
    placeholder,
    type = 'text',
  }) => (
    <div className="flex items-center space-x-3">
      <span className="text-gray-500">{icon}</span>
      <div className="flex-1">
        <label
          htmlFor={name}
          className="text-xs font-medium text-gray-500 uppercase"
        >
          {label}
        </label>
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

  // Conditional Rendering
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* --- Main Profile Card --- */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <form onSubmit={handleUpdateSubmit}>
            <div className="md:flex">
              {/* Left Column (Avatar & Role) */}
              <div className="md:w-1/3 bg-gradient-to-b from-blue-500 to-blue-600 p-8 text-white flex flex-col items-center justify-center">
                <img
                  src={`https://avatar.vercel.app/${user.email}.svg?s=200`}
                  alt="Profile"
                  className="rounded-full w-32 h-32 border-4 border-white shadow-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-center">{user.name}</h2>
                <p className="text-blue-100 text-sm">{user.email}</p>
                <span className="mt-4 px-3 py-1 bg-white text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                  {user.role}
                </span>

                {/* Dealer-specific rating */}
                {user.role === 'dealer' && (
                  <div className="mt-4 flex items-center space-x-1 text-yellow-300">
                    <Star size={20} />
                    <span className="text-lg font-bold">
                      {(user.averageRating || 0).toFixed(1)}
                    </span>
                    <span className="text-sm text-blue-100">
                      ({user.ratingCount || 0} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column (Info & Form) */}
              <div className="md:w-2/3 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Profile Information
                  </h3>
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition duration-150"
                    >
                      <Edit size={16} />
                      <span className="font-medium">Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-150"
                      >
                        <Save size={16} />
                        <span className="font-medium">Save</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-150"
                      >
                        <X size={16} />
                        <span className="font-medium">Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  {/* --- Personal Info Section --- */}
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Personal
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    {isEditing ? (
                      <FormInput
                        icon={<User size={20} />}
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="Your full name"
                      />
                    ) : (
                      <ProfileField
                        icon={<User size={20} />}
                        label="Full Name"
                        value={user.name}
                      />
                    )}

                    {/* Email */}
                    {isEditing ? (
                      <FormInput
                        icon={<Mail size={20} />}
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="your@email.com"
                        type="email"
                      />
                    ) : (
                      <ProfileField
                        icon={<Mail size={20} />}
                        label="Email Address"
                        value={user.email}
                      />
                    )}

                    {/* Phone */}
                    {isEditing ? (
                      <FormInput
                        icon={<Phone size={20} />}
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="Your phone number"
                      />
                    ) : (
                      <ProfileField
                        icon={<Phone size={20} />}
                        label="Phone Number"
                        value={user.phone}
                      />
                    )}
                  </div>

                  {/* --- Address Section --- */}
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Address
                  </h4>
                  <div className="space-y-6">
                    {/* Street */}
                    {isEditing ? (
                      <FormInput
                        icon={<MapPin size={20} />}
                        label="Street"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleFormChange}
                        placeholder="123 Main St"
                      />
                    ) : (
                      <ProfileField
                        icon={<MapPin size={20} />}
                        label="Street"
                        value={user.address?.street}
                      />
                    )}

                    {/* City, State, Zip */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {isEditing ? (
                        <>
                          <FormInput
                            icon={<span />}
                            label="City"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleFormChange}
                            placeholder="Prayagraj"
                          />
                          <FormInput
                            icon={<span />}
                            label="State"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleFormChange}
                            placeholder="Uttar Pradesh"
                          />
                          <FormInput
                            icon={<span />}
                            label="ZIP Code"
                            name="address.zip"
                            value={formData.address.zip}
                            onChange={handleFormChange}
                            placeholder="211001"
                          />
                        </>
                      ) : (
                        <>
                          <ProfileField
                            icon={<span />}
                            label="City"
                            value={user.address?.city}
                          />
                          <ProfileField
                            icon={<span />}
                            label="State"
                            value={user.address?.state}
                          />
                          <ProfileField
                            icon={<span />}
                            label="ZIP Code"
                            value={user.address?.zip}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* --- Change Password Card --- */}
        <div className="mt-8 bg-white rounded-xl shadow-2xl overflow-hidden p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Change Password
          </h3>
          <form
            onSubmit={handleSubmitPasswordChange}
            className="space-y-4 max-w-md"
          >
            <FormInput
              icon={<Key size={20} />}
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
            />
            <FormInput
              icon={<Key size={20} />}
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
            />
            <FormInput
              icon={<Key size={20} />}
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
            />
            
            {/* Password Error/Success Messages */}
            {passwordError && (
              <p className="text-sm text-red-600">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-sm text-green-600">{passwordSuccess}</p>
            )}
            
            <button
              type="submit"
              className="flex items-center justify-center space-x-2 w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
            >
              <ShieldCheck size={18} />
              <span>Update Password</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
