import { useCallback, useEffect, useState } from "react";
import { API_URL } from "./api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+()\-\s\d]{7,20}$/;
const EMPTY_FORM = { name: "", email: "", phone: "" };

const normalize = (value) => (value || "").trim().toLowerCase();

function validate(form, candidates, editingId) {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();

  if (!name) errors.name = "Name is required.";
  else if (name.length < 2) errors.name = "Name must be at least 2 characters.";

  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(email))
    errors.email = "Enter a valid email address.";
  else if (
    candidates.some(
      (c) => c.id !== editingId && normalize(c.email) === normalize(email)
    )
  )
    errors.email = "A candidate with this email already exists.";

  if (phone && !PHONE_PATTERN.test(phone))
    errors.phone = "Enter a valid phone number (7-20 digits, + - ( ) allowed).";

  return errors;
}

function CandidateRecords() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [notice, setNotice] = useState(null); // { type, text }
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");
      const response = await fetch(`${API_URL}/candidates`);
      if (!response.ok) throw new Error("Request failed");
      setCandidates(await response.json());
    } catch {
      setLoadError(
        "Could not load candidate records. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  useEffect(() => {
    if (!notice || notice.type !== "success") return undefined;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
  };

  const startEdit = (candidate) => {
    setEditingId(candidate.id);
    setForm({
      name: candidate.name || "",
      email: candidate.email || "",
      phone: candidate.phone || "",
    });
    setErrors({});
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice(null);

    const found = validate(form, candidates, editingId);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };
    const isEdit = editingId !== null;

    try {
      setSaving(true);
      const response = await fetch(
        isEdit ? `${API_URL}/candidates/${editingId}` : `${API_URL}/candidates`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        // The backend does not return a specific error for duplicate emails,
        // so re-check against the latest records to give a precise message.
        const latest = await fetch(`${API_URL}/candidates`)
          .then((r) => (r.ok ? r.json() : candidates))
          .catch(() => candidates);
        setCandidates(latest);

        const duplicate = latest.some(
          (c) =>
            c.id !== editingId && normalize(c.email) === normalize(payload.email)
        );
        if (duplicate || response.status === 409) {
          setErrors({ email: "A candidate with this email already exists." });
        } else {
          setNotice({
            type: "error",
            text: isEdit
              ? "Could not update the candidate. Please try again."
              : "Could not add the candidate. Please try again.",
          });
        }
        return;
      }

      await loadCandidates();
      setNotice({
        type: "success",
        text: isEdit
          ? `${payload.name} was updated successfully.`
          : `${payload.name} was added successfully.`,
      });
      resetForm();
    } catch {
      setNotice({
        type: "error",
        text: "Could not reach the server. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      const response = await fetch(`${API_URL}/candidates/${toDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");

      if (editingId === toDelete.id) resetForm();
      setNotice({
        type: "success",
        text: `${toDelete.name} was deleted.`,
      });
      setToDelete(null);
      await loadCandidates();
    } catch {
      setNotice({
        type: "error",
        text: `Could not delete ${toDelete.name}. They may be linked to other records.`,
      });
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const isEditing = editingId !== null;

  return (
    <div className="candidate-records">
      <section className="page-heading">
        <div>
          <span className="eyebrow">CANDIDATES</span>
          <h1>Candidate Records</h1>
          <p>Add, update and manage candidate details.</p>
        </div>

        <div className="interview-count">
          <span className="count-number">{candidates.length}</span>
          <span>Total Candidates</span>
        </div>
      </section>

      {notice && (
        <div
          className={`notice notice-${notice.type}`}
          role={notice.type === "error" ? "alert" : "status"}
        >
          <span>{notice.text}</span>
          <button
            type="button"
            className="notice-close"
            aria-label="Dismiss message"
            onClick={() => setNotice(null)}
          >
            ✕
          </button>
        </div>
      )}

      <section className="candidate-form-card">
        <div className="section-heading">
          <div>
            <h2>{isEditing ? "Edit Candidate" : "Add Candidate"}</h2>
            <p>
              {isEditing
                ? "Update the details and save your changes."
                : "Enter the candidate's details below."}
            </p>
          </div>
        </div>

        <form className="candidate-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="cand-name">Name *</label>
            <input
              id="cand-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              autoComplete="off"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="cand-email">Email *</label>
            <input
              id="cand-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              autoComplete="off"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="cand-phone">Phone</label>
            <input
              id="cand-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 555 000 1234"
              autoComplete="off"
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone && (
              <span className="field-error">{errors.phone}</span>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Add Candidate"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="history-section">
        <div className="section-heading">
          <div>
            <h2>All Candidates</h2>
            <p>Records stored in the VividMock database</p>
          </div>
          <span className="completed-label">● {candidates.length} Records</span>
        </div>

        {loading && candidates.length === 0 && (
          <p className="feedback-card">Loading candidate records...</p>
        )}

        {!loading && loadError && (
          <div className="feedback-card">
            <p>{loadError}</p>
            <button
              type="button"
              className="secondary-button retry-button"
              onClick={loadCandidates}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !loadError && candidates.length === 0 && (
          <p className="feedback-card">
            No candidates yet. Use the form above to add the first one.
          </p>
        )}

        {!loadError && candidates.length > 0 && (
          <div className="table-wrap">
            <table className="candidate-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className={candidate.id === editingId ? "row-editing" : ""}
                  >
                    <td data-label="ID">#{candidate.id}</td>
                    <td data-label="Name">{candidate.name}</td>
                    <td data-label="Email">{candidate.email}</td>
                    <td data-label="Phone">{candidate.phone || "—"}</td>
                    <td className="actions-col">
                      <button
                        type="button"
                        className="table-button"
                        onClick={() => startEdit(candidate)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="table-button danger"
                        onClick={() => setToDelete(candidate)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {toDelete && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => !deleting && setToDelete(null)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="delete-title">Delete candidate?</h3>
            <p>
              <strong>{toDelete.name}</strong> ({toDelete.email}) will be
              permanently removed. This cannot be undone.
            </p>
            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-button danger-fill"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CandidateRecords;
