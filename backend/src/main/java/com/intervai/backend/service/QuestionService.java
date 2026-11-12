
package com.intervai.backend.service;

import com.intervai.backend.model.Question;
import com.intervai.backend.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    // Get all questions
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    // Get question by ID
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id).orElse(null);
    }

    // Create question
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    // Update question
    public Question updateQuestion(Long id, Question question) {

        Question existingQuestion =
                questionRepository.findById(id).orElse(null);

        if (existingQuestion == null) {
            return null;
        }

        existingQuestion.setQuestionText(question.getQuestionText());
        existingQuestion.setCategory(question.getCategory());
        existingQuestion.setDifficulty(question.getDifficulty());

        return questionRepository.save(existingQuestion);
    }

    // Delete question
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}
