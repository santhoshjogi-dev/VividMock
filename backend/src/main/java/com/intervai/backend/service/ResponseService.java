
package com.intervai.backend.service;

import com.intervai.backend.model.Response;
import com.intervai.backend.repository.ResponseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResponseService {

    private final ResponseRepository responseRepository;

    public ResponseService(ResponseRepository responseRepository) {
        this.responseRepository = responseRepository;
    }

    // Get all responses
    public List<Response> getAllResponses() {
        return responseRepository.findAll();
    }

    // Get response by ID
    public Response getResponseById(Long id) {
        return responseRepository.findById(id).orElse(null);
    }

    // Create response
    public Response createResponse(Response response) {
        return responseRepository.save(response);
    }

    // Update response
    public Response updateResponse(Long id, Response response) {

        Response existingResponse =
                responseRepository.findById(id).orElse(null);

        if (existingResponse == null) {
            return null;
        }

        existingResponse.setInterviewId(response.getInterviewId());
        existingResponse.setQuestionId(response.getQuestionId());
        existingResponse.setAnswer(response.getAnswer());

        return responseRepository.save(existingResponse);
    }

    // Delete response
    public void deleteResponse(Long id) {
        responseRepository.deleteById(id);
    }
}
