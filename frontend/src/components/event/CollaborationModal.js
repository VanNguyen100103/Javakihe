import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from '../util/axios';
import { toast } from 'react-toastify';

const CollaborationModal = ({ event, onClose, onCollaborationUpdated }) => {
    const [shelters, setShelters] = useState([]);
    const [selectedShelterId, setSelectedShelterId] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchShelters = async () => {
            try {
                const response = await axios.get('/api/users/shelters');
                // Filter out the main shelter and existing collaborators
                const availableShelters = response.data.filter(shelter => 
                    shelter.id !== event.mainShelterId && 
                    !event.collaboratorIds.includes(shelter.id)
                );
                setShelters(availableShelters);
            } catch (error) {
                console.error('Error fetching shelters:', error);
                toast.error('Failed to load available shelters');
            }
        };

        fetchShelters();
    }, [event]);

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!selectedShelterId) {
            toast.error('Please select a shelter to invite');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`/api/collaborations/invite/${event.id}/${selectedShelterId}`, {
                message: message
            });
            toast.success('Collaboration invitation sent successfully');
            onCollaborationUpdated();
            onClose();
        } catch (error) {
            console.error('Error sending invitation:', error);
            toast.error('Failed to send collaboration invitation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Invite Shelter to Collaborate</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleInvite}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Shelter
                        </label>
                        <select
                            value={selectedShelterId}
                            onChange={(e) => setSelectedShelterId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            required
                        >
                            <option value="">Select a shelter...</option>
                            {shelters.map(shelter => (
                                <option key={shelter.id} value={shelter.id}>
                                    {shelter.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message (Optional)
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            rows="3"
                            placeholder="Add a message to the invitation..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg ${
                                loading 
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-primary-700'
                            }`}
                        >
                            {loading ? 'Sending...' : 'Send Invitation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CollaborationModal;
