
package com.intervai.backend.controller;

import com.intervai.backend.model.Candidate;
import com.intervai.backend.service.CandidateService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping
    public List<Candidate> getAllCandidates() {
        return candidateService.getAllCandidates();
    }

    @GetMapping("/{id}")
    public Candidate getCandidate(@PathVariable Long id) {
        return candidateService.getCandidateById(id);
    }

    @PostMapping
    public Candidate createCandidate(@RequestBody Candidate candidate) {
        return candidateService.createCandidate(candidate);
    }

    @PutMapping("/{id}")
    public Candidate updateCandidate(
            @PathVariable Long id,
            @RequestBody Candidate updatedCandidate) {
        return candidateService.updateCandidate(id, updatedCandidate);
    }

    @DeleteMapping("/{id}")
    public String deleteCandidate(@PathVariable Long id) {
        return candidateService.deleteCandidate(id);
    }
}
