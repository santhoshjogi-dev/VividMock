
package com.intervai.backend.controller;

import com.intervai.backend.model.Evaluation;
import com.intervai.backend.service.EvaluationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
@CrossOrigin
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    // Get all evaluations
    @GetMapping
    public List<Evaluation> getAllEvaluations() {
        return evaluationService.getAllEvaluations();
    }

    // Get evaluation by ID
    @GetMapping("/{id}")
    public Evaluation getEvaluationById(@PathVariable Long id) {
        return evaluationService.getEvaluationById(id);
    }

    // Get evaluations by interview ID
    @GetMapping("/interview/{interviewId}")
    public List<Evaluation> getEvaluationsByInterviewId(
            @PathVariable Long interviewId) {
        return evaluationService.getEvaluationsByInterviewId(interviewId);
    }

    // Create evaluation
    @PostMapping
    public Evaluation createEvaluation(@RequestBody Evaluation evaluation) {
        return evaluationService.createEvaluation(evaluation);
    }

    // Update evaluation
    @PutMapping("/{id}")
    public Evaluation updateEvaluation(
            @PathVariable Long id,
            @RequestBody Evaluation evaluation) {
        return evaluationService.updateEvaluation(id, evaluation);
    }

    // Delete evaluation
    @DeleteMapping("/{id}")
    public void deleteEvaluation(@PathVariable Long id) {
        evaluationService.deleteEvaluation(id);
    }
}
