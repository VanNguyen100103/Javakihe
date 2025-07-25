package com.ecommerce.pawfund.service.imple;

import com.ecommerce.pawfund.entity.Event;
import com.ecommerce.pawfund.repository.EventRepository;
import com.ecommerce.pawfund.service.inter.IEventService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EventServiceImpl implements IEventService {
    @Autowired
    private EventRepository eventRepository;

    @Override
    public Optional<Event> findById(Long id) {
        return eventRepository.findById(id);
    }

    @Override
    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    @Override
    public Event save(Event event) {
        return eventRepository.save(event);
    }

    @Override
    public void deleteById(Long id) {
        eventRepository.deleteById(id);
    }

    @Override
    public List<Event> findByShelterId(Long shelterId) {
        return eventRepository.findByShelterId(shelterId);
    }
} 