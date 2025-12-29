"use client";

export default function AppPreview() {
  return (
    <div className="preview-container">
      <div className="preview-frame">
        <video
          src="/preview.webm"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="preview-video"
          aria-label="Dagbok application preview demonstration"
        />
      </div>
    </div>
  );
}
