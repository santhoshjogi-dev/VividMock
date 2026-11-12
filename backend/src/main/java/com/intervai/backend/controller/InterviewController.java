
package com.intervai.backend.controller;

import com.intervai.backend.model.Interview;
import com.intervai.backend.service.InterviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    // Get all interviews
    @GetMapping
    public List<Interview> getAllInterviews() {
        return interviewService.getAllInterviews();
    }

    // Get interview by ID
    @GetMapping("/{id}")
    public Interview getInterview(@PathVariable Long id) {
        return interviewService.getInterviewById(id);
    }

    // Create interview
    @PostMapping
    public Interview createInterview(@RequestBody Interview interview) {
        return interviewService.createInterview(interview);
    }

    // Update interview
    @PutMapping("/{id}")
    public Interview updateInterview(
            @PathVariable Long id,
            @RequestBody Interview updatedInterview) {
        return interviewService.updateInterview(id, updatedInterview);
    }

    // Delete interview
    @DeleteMapping("/{id}")
    public String deleteInterview(@PathVariable Long id) {
        return interviewService.deleteInterview(id);
    }
}
