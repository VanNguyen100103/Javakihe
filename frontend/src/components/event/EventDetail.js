import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaUsers, FaEdit } from 'react-icons/fa';
import axios from '../util/axios';
import CollaborationModal from './CollaborationModal';
import CollaborationList from './CollaborationList';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCollaborationModal, setShowCollaborationModal] = useState(false);

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const response = await axios.get(`/api/events/${id}`);
            setEvent(response.data);
        } catch (error) {
            console.error('Error fetching event details:', error);
            toast.error('Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    const isMainShelter = user?.id === event?.mainShelterId;
    const isCollaborator = event?.collaboratorIds.includes(user?.id);
    const canManageCollaborations = isMainShelter;

    if (loading) return <LoadingSpinner />;
    if (!event) return <div>Event not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Event Header */}
            <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                {canManageCollaborations && (
                    <button
                        onClick={() => setShowCollaborationModal(true)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                        Invite Shelter
                    </button>
                )}
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <FaCalendar className="text-primary-600 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                        <FaClock className="text-primary-600 mr-2" />
                        <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center">
                        <FaMapMarkerAlt className="text-primary-600 mr-2" />
                        <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                        <FaUsers className="text-primary-600 mr-2" />
                        <span>Max Participants: {event.maxParticipants}</span>
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700">{event.description}</p>
                </div>

                {/* Status and Category Tags */}
                <div className="mt-4 flex gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'UPCOMING' ? 'bg-yellow-100 text-yellow-800' :
                        event.status === 'ONGOING' ? 'bg-green-100 text-green-800' :
                        event.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {event.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {event.category}
                    </span>
                </div>
            </div>

            {/* Collaborations Section */}
            <CollaborationList
                event={event}
                isMainShelter={isMainShelter}
                onCollaborationUpdated={fetchEventDetails}
            />

            {/* Collaboration Modal */}
            {showCollaborationModal && (
                <CollaborationModal
                    event={event}
                    onClose={() => setShowCollaborationModal(false)}
                    onCollaborationUpdated={fetchEventDetails}
                />
            )}
        </div>
    );
};

export default EventDetail;
