import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { eventAPI } from '../../api/event';

const ShelterEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadMyEvents();
    }, []);

    const loadMyEvents = async () => {
        setIsLoading(true);
        try {
            const response = await eventAPI.getEvents({ shelterId: 'current' });
            console.log('Shelter events response:', response);
            console.log('Response type:', typeof response);
            console.log('Response length:', Array.isArray(response) ? response.length : 'Not an array');
            
            // Axios interceptor trả về response.data trực tiếp
            if (Array.isArray(response)) {
                console.log('Events array:', response);
                setEvents(response);
            } else {
                console.error('Response is not an array:', response);
                setEvents([]);
            }
        } catch (error) {
            console.error('Error loading events:', error);
            toast.error('Lỗi khi tải danh sách sự kiện');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'UPCOMING':
                return 'bg-blue-100 text-blue-800';
            case 'ONGOING':
                return 'bg-green-100 text-green-800';
            case 'COMPLETED':
                return 'bg-gray-100 text-gray-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'UPCOMING':
                return 'Sắp diễn ra';
            case 'ONGOING':
                return 'Đang diễn ra';
            case 'COMPLETED':
                return 'Đã hoàn thành';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    const getCategoryText = (category) => {
        switch (category) {
            case 'ADOPTION':
                return 'Nhận nuôi';
            case 'FUNDRAISING':
                return 'Gây quỹ';
            case 'AWARENESS':
                return 'Nâng cao nhận thức';
            case 'TRAINING':
                return 'Đào tạo';
            default:
                return 'Khác';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Debug render
    console.log('=== ShelterEventsPage render ===');
    console.log('events state:', events);
    console.log('events length:', events.length);
    console.log('isLoading:', isLoading);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Sự kiện của tôi</h1>
                    <p className="mt-2 text-gray-600">Danh sách sự kiện bạn được phân công phụ trách</p>
                </div>

                {/* Events List */}
                <div className="bg-white rounded-lg shadow">
                    {events.length === 0 ? (
                        <div className="p-8 text-center">
                            <FaCalendar className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có sự kiện</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Bạn chưa được phân công phụ trách sự kiện nào.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {events.map((event) => (
                                <div key={event.id} className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {event.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {event.description}
                                            </p>
                                            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <FaCalendar className="mr-2" />
                                                    {formatDate(event.date)}
                                                </div>
                                                <div className="flex items-center">
                                                    <FaMapMarkerAlt className="mr-2" />
                                                    {event.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <FaClock className="mr-2" />
                                                    {event.startTime} - {event.endTime}
                                                </div>
                                                <div className="flex items-center">
                                                    <FaUsers className="mr-2" />
                                                    {event.maxParticipants} người
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center space-x-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                                    {getStatusText(event.status)}
                                                </span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {getCategoryText(event.category)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShelterEventsPage;