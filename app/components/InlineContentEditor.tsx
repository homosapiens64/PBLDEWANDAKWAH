"use client";

import { useEffect, useState } from "react";
import type { PublicContentItem } from "../lib/content";
import KajianManager from "./KajianManager";
import NewsManager from "./NewsManager";
import ContentManager from "./ContentManager";
import AboutManager from "./AboutManager";

export type InlineEditorProps = {
  items: PublicContentItem[];
  module: "kajian" | "website" | "konsultasi" | "tentang-kami";
  section: string;
};

export default function InlineContentEditor({ items, module, section }: InlineEditorProps) {
  const [isSuper, setIsSuper] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => setIsSuper(data?.role === "super_admin"))
      .catch(() => setIsSuper(false));
  }, []);

  if (!isSuper) return null;

  const handleClose = () => {
    setShowEditor(false);
  };

  const renderManager = () => {
    switch (module) {
      case "kajian":
        return <KajianManager items={items} readOnly={false} section={section} />;
      case "website":
        return <NewsManager items={items} readOnly={false} section={section} />;
      case "konsultasi":
        return (
          <ContentManager
            items={items}
            module="konsultasi"
            readOnly={false}
            section={section}
            sectionLabel="Konsultasi Agama"
          />
        );
      case "tentang-kami":
        return (
          <AboutManager
            items={items}
            readOnly={false}
            section={section}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Edit Button */}
      <button
        onClick={() => setShowEditor(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#F9A826",
          border: "none",
          color: "#fff",
          fontSize: 24,
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 99,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Edit konten (Super Admin)"
      >
        ✎
      </button>

      {/* Editor Modal */}
      {showEditor && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={handleClose}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              maxWidth: 900,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              padding: 24,
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 32,
                height: 32,
                border: "none",
                background: "#f0f0f0",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: 18,
              }}
            >
              ✕
            </button>
            {renderManager()}
          </div>
        </div>
      )}
    </>
  );
}
