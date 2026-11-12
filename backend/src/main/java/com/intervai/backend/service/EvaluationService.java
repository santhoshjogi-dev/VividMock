
package com.intervai.backend.service;

import com.intervai.backend.model.Evaluation;
import com.intervai.backend.repository.EvaluationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;

    public EvaluationService(EvaluationRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    // Get all evaluations
    public List<Evaluation> getAllEvaluations() {
        return evaluationRepository.findAll();
    }

    // Get evaluation by ID
    public Evaluation getEvaluationById(Long id) {
        return evaluationRepository.findById(id).orElse(null);
    }

    // Get evaluations by interview ID
    public List<Evaluation> getEvaluationsByInterviewId(Long interviewId) {
        return evaluationRepository.findByInterviewId(interviewId);
    }

    // Create evaluation
    public Evaluation createEvaluation(Evaluation evaluation) {
        return evaluationRepository.save(evaluation);
    }

    // Update evaluation
    public Evaluation updateEvaluation(Long id, Evaluation updatedEvaluation) {

        Evaluation existingEvaluation =
                evaluationRepository.findById(id).orElse(null);

        if (existingEvaluation == null) {
            return null;
        }

        existingEvaluation.setInterviewId(updatedEvaluation.getInterviewId());
        existingEvaluation.setQuestionId(updatedEvaluation.getQuestionId());
        existingEvaluation.setScore(updatedEvaluation.getScore());
        existingEvaluation.setFeedback(updatedEvaluation.getFeedback());
        existingEvaluation.setStrengths(updatedEvaluation.getStrengths());
        existingEvaluation.setImprovements(updatedEvaluation.getImprovements());

        return evaluationRepository.save(existingEvaluation);
    }

    // Delete evaluation
    public void deleteEvaluation(Long id) {
        evaluationRepository.deleteById(id);
    }
}
