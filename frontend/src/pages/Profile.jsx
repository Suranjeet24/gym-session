import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/user/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data);
            setFormData(response.data);
        } catch (err) {
            console.error('Failed to fetch profile', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/user/profile', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(formData);
            setEditing(false);
        } catch (err) {
            console.error('Failed to update profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
                    <button onClick={handleLogout} className="btn-secondary"> Logout </button>
                </div>
                {profile && (
                    <div className="card">
                        {!editing ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-600">Email</p>
                                    <p className="text-xl font-semibold text-gray-800">{profile.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Name</p>
                                    <p className="text-xl font-semibold text-gray-800">{profile.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Age</p>
                                    <p className="text-xl font-semibold text-gray-800">{profile.age}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Height (cm)</p>
                                    <p className="text-xl font-semibold text-gray-800">{profile.height}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Weight (kg)</p>
                                    <p className="text-xl font-semibold text-gray-800">{profile.weight}</p>
                                </div>
                                <button onClick={() => setEditing(true)} className="btn-primary w-full"> Edit Profile </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Name</label>
                                    <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="input-field" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Age</label>
                                    <input type="number" name="age" value={formData.age || ''} onChange={handleInputChange} className="input-field" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Height (cm)</label>
                                    <input type="number" name="height" value={formData.height || ''} onChange={handleInputChange} className="input-field" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Weight (kg)</label>
                                    <input type="number" name="weight" value={formData.weight || ''} onChange={handleInputChange} className="input-field" />
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" disabled={loading} className="btn-primary flex-1"> {loading ? 'Saving...' : 'Save'} </button>
                                    <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1"> Cancel </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;