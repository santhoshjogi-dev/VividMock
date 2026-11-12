package com.intervai.backend.repository;

import com.intervai.backend.model.Response;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResponseRepository extends JpaRepository<Response, Long> {
}