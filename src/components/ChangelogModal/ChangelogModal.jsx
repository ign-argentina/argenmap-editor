import { useState, useEffect } from "react";
import { marked } from "marked";
import { useLatestRelease } from "/src/hooks/useLatestRelease";
import './ChangelogModal.css';

function ChangelogModal() {
  const { release, error } = useLatestRelease();
  const [showModal, setShowModal] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const STORAGE_KEY = "lastSeenRelease";
  const MINIMIZED_KEY = "changelogMinimized";

  useEffect(() => {
    if (!release) return;

    const lastSeen = localStorage.getItem(STORAGE_KEY);
    const isMinimized = localStorage.getItem(MINIMIZED_KEY) === "true";

    setShowModal(true); // mostrar siempre que haya release
    setMinimized(isMinimized);

    if (release.tag_name !== lastSeen) {
      localStorage.setItem(STORAGE_KEY, release.tag_name);
      localStorage.setItem(MINIMIZED_KEY, "false");
      setMinimized(false);
    }
  }, [release]);

  if (error || !release || !showModal) return null;

  const handleMinimize = () => {
    const newValue = !minimized;
    setMinimized(newValue);
    localStorage.setItem(MINIMIZED_KEY, newValue);
  };

  return (
    <div className="changelog-modal-wrapper">
      <div className="changelog-modal">
        <button className="changelog-minimize-button" onClick={handleMinimize}>
          {minimized ? '▣' : '−'}
        </button>

        <h2 className="changelog-title">Novedades</h2>

        {!minimized && (
          <>
            <div className="changelog-header">
              <h2 className="changelog-version">
                {release.name || release.tag_name}
              </h2>
              <p className="changelog-date">
                Publicado el: {new Date(release.published_at).toLocaleDateString()}
              </p>
            </div>

            <div className="changelog-body">
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
          </>
        )}
      </div>
    </div>
  );
}

export default ChangelogModal;
