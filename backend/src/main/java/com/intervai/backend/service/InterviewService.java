
package com.intervai.backend.service;

import com.intervai.backend.model.Interview;
import com.intervai.backend.repository.InterviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;

    public InterviewService(InterviewRepository interviewRepository) {
        this.interviewRepository = interviewRepository;
    }

    // Get all interviews
    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll();
    }

    // Get interview by ID
    public Interview getInterviewById(Long id) {
        return interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
    }

    // Create interview
    public Interview createInterview(Interview interview) {
        return interviewRepository.save(interview);
    }

    // Update interview
    public Interview updateInterview(Long id, Interview updatedInterview) {

        Interview interview = getInterviewById(id);

        interview.setCandidateId(updatedInterview.getCandidateId());
        interview.setRole(updatedInterview.getRole());
        interview.setDifficulty(updatedInterview.getDifficulty());
        interview.setStatus(updatedInterview.getStatus());

        return interviewRepository.save(interview);
    }

    // Delete interview
    public String deleteInterview(Long id) {

        if (!interviewRepository.existsById(id)) {
            throw new RuntimeException("Interview not found");
        }

        interviewRepository.deleteById(id);

        return "Interview deleted successfully";
    }
}
