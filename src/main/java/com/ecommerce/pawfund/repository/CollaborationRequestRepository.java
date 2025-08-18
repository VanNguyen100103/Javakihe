package com.ecommerce.pawfund.repository;

import com.ecommerce.pawfund.entity.CollaborationRequest;
import com.ecommerce.pawfund.entity.Event;
import com.ecommerce.pawfund.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollaborationRequestRepository extends JpaRepository<CollaborationRequest, Long> {
    List<CollaborationRequest> findByInviteeAndStatus(User invitee, CollaborationRequest.Status status);
    List<CollaborationRequest> findByRequesterAndStatus(User requester, CollaborationRequest.Status status);
    List<CollaborationRequest> findByEventAndStatus(Event event, CollaborationRequest.Status status);
    Optional<CollaborationRequest> findByEventAndInviteeAndStatus(Event event, User invitee, CollaborationRequest.Status status);
}
