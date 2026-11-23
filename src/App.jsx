
import { useEffect, useState } from "react";
import "./App.css";
import { API_URL } from "./api";
import CandidateRecords from "./CandidateRecords";

const getViewFromHash = () =>
  window.location.hash === "#/candidates" ? "candidates" : "history";

function App() {
  const [view, setView] = useState(getViewFromHash);
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [evaluations, setEvaluations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultsError, setResultsError] = useState("");

  // Fetch interview and candidate records
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError("");

        const [interviewResponse, candidateResponse] =
          await Promise.all([
            fetch(`${API_URL}/interviews`),
            fetch(`${API_URL}/candidates`),
          ]);

        if (!interviewResponse.ok || !candidateResponse.ok) {
          throw new Error("Unable to retrieve records from the server.");
        }

        const interviewData = await interviewResponse.json();
        const candidateData = await candidateResponse.json();

        setInterviews(interviewData);
        setCandidates(candidateData);
      } catch (err) {
        setError(
          "Could not connect to the backend. Make sure Spring Boot is running."
        );
      } finally {
        setLoading(false);
      }
    };

    if (view === "history") fetchRecords();
  }, [view]);

  useEffect(() => {
    const onHashChange = () => setView(getViewFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (next) => {
    window.location.hash = next === "candidates" ? "#/candidates" : "#/";
  };

  // Find candidate name using candidateId
  const getCandidateName = (candidateId) => {
    const candidate = candidates.find(
      (item) => item.id === candidateId
    );

    return candidate ? candidate.name : `Candidate #${candidateId}`;
  };

  // Fetch evaluations for the selected interview
  const handleViewResults = async (interview) => {
    setSelectedInterview(interview);
    setEvaluations([]);
    setResultsError("");
    setResultsLoading(true);

    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const response = await fetch(
        `${API_URL}/evaluations/interview/${interview.id}`
      );

      if (!response.ok) {
        throw new Error("Unable to retrieve interview evaluations.");
      }

      const data = await response.json();
      setEvaluations(data);
    } catch (err) {
      setResultsError("Could not load evaluation details.");
    } finally {
      setResultsLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return "";

    return status.toLowerCase() === "completed"
      ? "completed"
      : "other";
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">V</div>
          <span>
            Vivid<span className="brand-highlight">Mock</span>
          </span>
        </div>

        <nav className="nav-tabs" aria-label="Main navigation">
          <button
            type="button"
            className={view === "candidates" ? "nav-tab active" : "nav-tab"}
            onClick={() => navigate("candidates")}
          >
            Candidate Records
          </button>
          <button
            type="button"
            className={view === "history" ? "nav-tab active" : "nav-tab"}
            onClick={() => navigate("history")}
          >
            Interview History
          </button>
        </nav>

        <div className="topbar-right">
          <div className="avatar">S</div>
        </div>
      </header>

      <main className="main-container">
        {view === "candidates" ? (
          <CandidateRecords />
        ) : (
          <>
        <section className="page-heading">
          <div>
            <span className="eyebrow">YOUR RECORDS</span>
            <h1>Interview History</h1>
            <p>
              Review your previous interviews and performance records.
            </p>
          </div>

          <div className="interview-count">
            <span className="count-number">
              {interviews.length}
            </span>
            <span>Total Interviews</span>
          </div>
        </section>

        <section className="history-section">
          <div className="section-heading">
            <div>
              <h2>Previous Interviews</h2>
              <p>Your recorded interview sessions</p>
            </div>

            <span className="completed-label">
              ● {interviews.length} Records
            </span>
          </div>

          {loading && (
            <p className="feedback-card">
              Loading interview records...
            </p>
          )}

          {!loading && error && (
            <p className="feedback-card">{error}</p>
          )}

          {!loading && !error && interviews.length === 0 && (
            <p className="feedback-card">
              No interview records found. Your interviews will appear here
              once they are saved.
            </p>
          )}

          {!loading && !error && interviews.length > 0 && (
            <div className="interview-list">
              {interviews.map((interview) => (
                <article className="interview-card" key={interview.id}>
                  <div className="card-main">
                    <div className="interview-icon">
                      {interview.role
                        ? interview.role.substring(0, 2).toUpperCase()
                        : "IV"}
                    </div>

                    <div className="interview-info">
                      <h3>{interview.role || "Interview"}</h3>

                      <p>
                        {getCandidateName(interview.candidateId)}
                      </p>

                      <div className="interview-meta">
                        <span>
                          Difficulty: {interview.difficulty || "Not specified"}
                        </span>
                        <span>
                          Interview ID: {interview.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-score">
                    <span className="score-label">Difficulty</span>
                    <div className="score-value good">
                      {interview.difficulty || "N/A"}
                    </div>
                  </div>

                  <div className="card-status">
                    <span className="status-badge">
                      ● {interview.status || "Unknown"}
                    </span>
                  </div>

                  <button
                    className="view-button"
                    onClick={() => handleViewResults(interview)}
                  >
                    View Results <span>→</span>
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {selectedInterview && (
          <section className="result-section" id="result">
            <div className="result-heading">
              <div>
                <span className="eyebrow">INTERVIEW REPORT</span>
                <h2>Detailed Results</h2>
                <p>
                  {selectedInterview.role || "Interview"} ·{" "}
                  {getCandidateName(selectedInterview.candidateId)}
                </p>
              </div>

              <button
                className="close-button"
                onClick={() => {
                  setSelectedInterview(null);
                  setEvaluations([]);
                  setResultsError("");
                }}
              >
                ✕ Close
              </button>
            </div>

            <div className="result-grid">
              <div className="result-score-card">
                <span className="score-label">Interview ID</span>
                <div className="large-score good">
                  #{selectedInterview.id}
                </div>
                <span className="result-status">
                  {selectedInterview.status || "Status unavailable"}
                </span>
              </div>

              <div className="feedback-card">
                <h3>Interview Information</h3>
                <p>
                  <strong>Candidate:</strong>{" "}
                  {getCandidateName(selectedInterview.candidateId)}
                </p>
                <p>
                  <strong>Role:</strong>{" "}
                  {selectedInterview.role || "Not specified"}
                </p>
                <p>
                  <strong>Difficulty:</strong>{" "}
                  {selectedInterview.difficulty || "Not specified"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedInterview.status || "Not specified"}
                </p>
              </div>
            </div>

            <div className="section-heading">
              <div>
                <h2>Evaluation Details</h2>
                <p>Question-wise evaluation records</p>
              </div>
            </div>

            {resultsLoading && (
              <p className="feedback-card">
                Loading evaluation details...
              </p>
            )}

            {!resultsLoading && resultsError && (
              <p className="feedback-card">{resultsError}</p>
            )}

            {!resultsLoading &&
              !resultsError &&
              evaluations.length === 0 && (
                <p className="feedback-card">
                  No evaluation records are available for this interview yet.
                </p>
              )}

            {!resultsLoading &&
              !resultsError &&
              evaluations.length > 0 && (
                <div className="interview-list">
                  {evaluations.map((evaluation) => (
                    <div className="analysis-card" key={evaluation.id}>
                      <div className="analysis-title">
                        <h3>
                          Question #{evaluation.questionId}
                        </h3>
                        <span className="score-value good">
                          {evaluation.score ?? "N/A"}
                        </span>
                      </div>

                      <div className="analysis-item">
                        <strong>Feedback:</strong>{" "}
                        {evaluation.feedback || "No feedback available."}
                      </div>

                      <div className="analysis-item">
                        <strong>Strengths:</strong>{" "}
                        {evaluation.strengths || "Not provided."}
                      </div>

                      <div className="analysis-item">
                        <strong>Areas to Improve:</strong>{" "}
                        {evaluation.improvements || "Not provided."}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </section>
        )}

          </>
        )}

        <footer className="footer">
          <span>VividMock</span>
          <span>Candidate Records & Results</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
