
import { useState } from "react";
import "./App.css";

function App() {
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Sample data for frontend development
  const interviews = [
    {
      id: 1,
      type: "Technical Interview",
      role: "Software Developer",
      date: "05 Oct 2026",
      score: 82,
      status: "Completed",
      duration: "35 minutes",
      strengths: ["Problem Solving", "Java Fundamentals", "Communication"],
      improvements: ["System Design", "Time Complexity"],
      feedback:
        "Good understanding of programming fundamentals. You demonstrated strong problem-solving skills but need improvement in system design.",
    },
    {
      id: 2,
      type: "HR Interview",
      role: "Software Developer",
      date: "28 Sep 2026",
      score: 76,
      status: "Completed",
      duration: "25 minutes",
      strengths: ["Confidence", "Communication", "Teamwork"],
      improvements: ["Answer Structure", "Leadership Examples"],
      feedback:
        "You communicated confidently and demonstrated good teamwork. Try structuring your answers with more specific examples.",
    },
    {
      id: 3,
      type: "Technical Interview",
      role: "Frontend Developer",
      date: "20 Sep 2026",
      score: 88,
      status: "Completed",
      duration: "40 minutes",
      strengths: ["React", "JavaScript", "Problem Solving"],
      improvements: ["Performance Optimization"],
      feedback:
        "Excellent technical performance. You showed strong frontend development knowledge and handled most questions confidently.",
    },
  ];

  const getScoreClass = (score) => {
    if (score >= 85) return "excellent";
    if (score >= 70) return "good";
    return "average";
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">I</div>
          <span>Interv<span className="brand-highlight">AI</span></span>
        </div>

        <div className="topbar-right">
          <span className="module-label">Candidate Records</span>
          <div className="avatar">S</div>
        </div>
      </header>

      <main className="main-container">
        <section className="page-heading">
          <div>
            <span className="eyebrow">YOUR RECORDS</span>
            <h1>Interview History</h1>
            <p>Review your previous interviews, results and performance.</p>
          </div>

          <div className="interview-count">
            <span className="count-number">{interviews.length}</span>
            <span>Total Interviews</span>
          </div>
        </section>

        <section className="history-section">
          <div className="section-heading">
            <div>
              <h2>Previous Interviews</h2>
              <p>Your completed interview sessions</p>
            </div>
            <span className="completed-label">● All completed</span>
          </div>

          <div className="interview-list">
            {interviews.map((interview) => (
              <article className="interview-card" key={interview.id}>
                <div className="card-main">
                  <div className="interview-icon">
                    {interview.type === "HR Interview" ? "HR" : "TC"}
                  </div>

                  <div className="interview-info">
                    <h3>{interview.type}</h3>
                    <p>{interview.role}</p>
                    <div className="interview-meta">
                      <span>◷ {interview.date}</span>
                      <span>◴ {interview.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="card-score">
                  <span className="score-label">Overall score</span>
                  <div className={`score-value ${getScoreClass(interview.score)}`}>
                    {interview.score}
                    <span>/100</span>
                  </div>
                </div>

                <div className="card-status">
                  <span className="status-badge">
                    <span>●</span> {interview.status}
                  </span>
                </div>

                <button
                  className="view-button"
                  onClick={() => {
                    setSelectedInterview(interview);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  View Results <span>→</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        {selectedInterview && (
          <section className="result-section" id="result">
            <div className="result-heading">
              <div>
                <span className="eyebrow">INTERVIEW REPORT</span>
                <h2>Detailed Results</h2>
                <p>
                  {selectedInterview.type} · {selectedInterview.role}
                </p>
              </div>

              <button
                className="close-button"
                onClick={() => setSelectedInterview(null)}
              >
                ✕ Close
              </button>
            </div>

            <div className="result-grid">
              <div className="result-score-card">
                <span className="score-label">Overall score</span>
                <div className={`large-score ${getScoreClass(selectedInterview.score)}`}>
                  {selectedInterview.score}
                  <span>/100</span>
                </div>
                <span className="result-status">Interview completed</span>
              </div>

              <div className="feedback-card">
                <h3>AI Feedback</h3>
                <p>{selectedInterview.feedback}</p>
              </div>
            </div>

            <div className="analysis-grid">
              <div className="analysis-card">
                <div className="analysis-title">
                  <span className="analysis-icon strength-icon">✓</span>
                  <h3>Strengths</h3>
                </div>

                {selectedInterview.strengths.map((item, index) => (
                  <div className="analysis-item" key={index}>
                    <span>✓</span> {item}
                  </div>
                ))}
              </div>

              <div className="analysis-card">
                <div className="analysis-title">
                  <span className="analysis-icon improvement-icon">↗</span>
                  <h3>Areas to Improve</h3>
                </div>

                {selectedInterview.improvements.map((item, index) => (
                  <div className="analysis-item" key={index}>
                    <span>↗</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <footer className="footer">
          <span>IntervAI</span>
          <span>Candidate Records & Results</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
