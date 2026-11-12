
package com.intervai.backend.repository;

import com.intervai.backend.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    List<Evaluation> findByInterviewId(Long interviewId);
}
