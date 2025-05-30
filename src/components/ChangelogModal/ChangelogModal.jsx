import { useState, useEffect } from "react";
import { marked } from "marked";
import { useLatestRelease } from "/src//hooks/useLatestRelease";
import './ChangelogModal.css';

function ChangelogModal() {
  const { release, error } = useLatestRelease();
  const [showModal, setShowModal] = useState(false);
  const STORAGE_KEY = "lastSeenRelease";

  useEffect(() => {
    if (!release) return;

    const lastSeen = localStorage.getItem(STORAGE_KEY);
    if (release.tag_name !== lastSeen) {
      setShowModal(true);
    }
  }, [release]);

  if (error || !release || !showModal) return null;

  return (
    <div className="changelog-modal-wrapper">
      <div className="changelog-modal">
        <h2>{release.name || release.tag_name}</h2>
        <p className="changelog-date">
          Publicado el: {new Date(release.published_at).toLocaleDateString()}
        </p>
        <div
          className="changelog-content"
          dangerouslySetInnerHTML={{ __html: marked.parse(release.body || "") }}
        />
        <a
          className="changelog-link"
          href={release.html_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver en GitHub →
        </a>
      </div>
    </div>
  );
}

export default ChangelogModal;
