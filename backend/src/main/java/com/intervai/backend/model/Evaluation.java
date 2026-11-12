
package com.intervai.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "evaluations")
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long interviewId;

    private Long questionId;

    private Double score;

    @Column(length = 2000)
    private String feedback;

    @Column(length = 2000)
    private String strengths;

    @Column(length = 2000)
    private String improvements;

    public Evaluation() {
    }

    public Evaluation(Long interviewId, Long questionId,
                      Double score, String feedback,
                      String strengths, String improvements) {
        this.interviewId = interviewId;
        this.questionId = questionId;
        this.score = score;
        this.feedback = feedback;
        this.strengths = strengths;
        this.improvements = improvements;
    }

    public Long getId() {
        return id;
    }

    public Long getInterviewId() {
        return interviewId;
    }

    public void setInterviewId(Long interviewId) {
        this.interviewId = interviewId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public String getStrengths() {
        return strengths;
    }

    public void setStrengths(String strengths) {
        this.strengths = strengths;
    }

    public String getImprovements() {
        return improvements;
    }

    public void setImprovements(String improvements) {
        this.improvements = improvements;
    }
}
