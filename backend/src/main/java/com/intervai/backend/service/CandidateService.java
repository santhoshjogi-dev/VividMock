
package com.intervai.backend.service;

import com.intervai.backend.model.Candidate;
import com.intervai.backend.repository.CandidateRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;

    public CandidateService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public Candidate getCandidateById(Long id) {
        return candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
    }

    public Candidate createCandidate(Candidate candidate) {
        return candidateRepository.save(candidate);
    }

    public Candidate updateCandidate(Long id, Candidate updatedCandidate) {
        Candidate candidate = getCandidateById(id);

        candidate.setName(updatedCandidate.getName());
        candidate.setEmail(updatedCandidate.getEmail());
        candidate.setPhone(updatedCandidate.getPhone());

        return candidateRepository.save(candidate);
    }

    public String deleteCandidate(Long id) {
        if (!candidateRepository.existsById(id)) {
            throw new RuntimeException("Candidate not found");
        }

        candidateRepository.deleteById(id);
        return "Candidate deleted successfully";
    }
}

