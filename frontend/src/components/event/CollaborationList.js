import React, { useState, useEffect } from 'react';
import { FaUserFriends, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import axios from '../util/axios';
import { toast } from 'react-toastify';

const CollaborationList = ({ event, isMainShelter, onCollaborationUpdated }) => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPendingRequests();
    }, [event]);

    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get('/api/collaborations/sent');
            const eventRequests = response.data.filter(request => request.event.id === event.id);
            setPendingRequests(eventRequests);
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }
    };

    const handleCancelInvitation = async (requestId) => {
        setLoading(true);
        try {
            await axios.delete(`/api/collaborations/${requestId}`);
            toast.success('Invitation cancelled successfully');
            fetchPendingRequests();
            onCollaborationUpdated();
        } catch (error) {
            console.error('Error cancelling invitation:', error);
            toast.error('Failed to cancel invitation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Event Collaborators</h3>

            <div className="space-y-4">
                {/* Main Shelter */}
                <div className="p-4 bg-primary-50 rounded-lg">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <FaUserFriends className="text-primary-600" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                                {event.mainShelterName}
                            </div>
                            <div className="text-sm text-gray-500">
                                Main Organizer
                            </div>
                        </div>
                    </div>
                </div>

                {/* Collaborating Shelters */}
                {event.collaboratorNames.map((name, index) => (
                    <div key={event.collaboratorIds[index]} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                    <FaUserFriends className="text-gray-600" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                    {name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Collaborating Shelter
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Pending Invitations */}
                {pendingRequests.map(request => (
                    <div key={request.id} className="p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <FaClock className="text-yellow-600" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {request.invitee.fullName}
                                    </div>
                                    <div className="text-sm text-yellow-600">
                                        Pending Invitation
                                    </div>
                                </div>
                            </div>
                            {isMainShelter && (
                                <button
                                    onClick={() => handleCancelInvitation(request.id)}
                                    disabled={loading}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {event.collaboratorNames.length === 0 && pendingRequests.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                        No collaborating shelters yet
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollaborationList;
