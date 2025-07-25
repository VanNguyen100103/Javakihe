package com.ecommerce.pawfund.service.imple;

import com.ecommerce.pawfund.entity.Pet;
import com.ecommerce.pawfund.repository.PetRepository;
import com.ecommerce.pawfund.service.inter.IPetService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.Collections;

@Service
public class PetServiceImpl implements IPetService {
    @Autowired
    private PetRepository petRepository;

    @Override
    public Optional<Pet> findById(Long id) {
        return petRepository.findById(id);
    }

    @Override
    public List<Pet> findAll() {
        return petRepository.findAll();
    }

    @Override
    public Pet save(Pet pet) {
        return petRepository.save(pet);
    }

    @Override
    public void deleteById(Long id) {
        petRepository.deleteById(id);
    }

    @Override
    public List<Pet> findByBreed(String breed) {
        return petRepository.findByBreed(breed);
    }

    @Override
    public List<Pet> findByStatus(Pet.Status status) {
        return petRepository.findByStatus(status);
    }

    @Override
    public List<Pet> findByLocation(String location) {
        return petRepository.findByLocation(location);
    }

    @Override
    public Page<Pet> findByFilterAndSearch(String status, String breed, String search, Integer age, String location, Integer ageMin, Integer ageMax, Pageable pageable) {
        List<Pet> all = petRepository.findAll();
        Stream<Pet> stream = all.stream();

        if (status != null) {
            stream = stream.filter(p -> p.getStatus() != null && p.getStatus().name().equalsIgnoreCase(status));
        }
        if (breed != null) {
            stream = stream.filter(p -> p.getBreed() != null && p.getBreed().toLowerCase().contains(breed.toLowerCase()));
        }
        if (search != null) {
            stream = stream.filter(p ->
                (p.getName() != null && p.getName().toLowerCase().contains(search.toLowerCase())) ||
                (p.getDescription() != null && p.getDescription().toLowerCase().contains(search.toLowerCase()))
            );
        }
        if (age != null) {
            stream = stream.filter(p -> p.getAge() != null && p.getAge().equals(age));
        }
        if (location != null) {
            stream = stream.filter(p -> p.getLocation() != null && p.getLocation().toLowerCase().contains(location.toLowerCase()));
        }
        if (ageMin != null) {
            stream = stream.filter(p -> p.getAge() != null && p.getAge() >= ageMin);
        }
        if (ageMax != null) {
            stream = stream.filter(p -> p.getAge() != null && p.getAge() <= ageMax);
        }
        List<Pet> filtered = stream.collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());
        List<Pet> pageContent = start > end ? Collections.emptyList() : filtered.subList(start, end);

        return new PageImpl<>(pageContent, pageable, filtered.size());
    }
} 