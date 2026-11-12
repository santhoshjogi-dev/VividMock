
package com.intervai.backend.controller;

import com.intervai.backend.model.Response;
import com.intervai.backend.service.ResponseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/responses")
@CrossOrigin
public class ResponseController {

    private final ResponseService responseService;

    public ResponseController(ResponseService responseService) {
        this.responseService = responseService;
    }

    @GetMapping
    public List<Response> getAllResponses() {
        return responseService.getAllResponses();
    }

    @GetMapping("/{id}")
    public Response getResponseById(@PathVariable Long id) {
        return responseService.getResponseById(id);
    }

    @PostMapping
    public Response createResponse(@RequestBody Response response) {
        return responseService.createResponse(response);
    }

    @PutMapping("/{id}")
    public Response updateResponse(
            @PathVariable Long id,
            @RequestBody Response response) {
        return responseService.updateResponse(id, response);
    }

    @DeleteMapping("/{id}")
    public void deleteResponse(@PathVariable Long id) {
        responseService.deleteResponse(id);
    }
}
