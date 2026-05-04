import { useState } from "react";

export const useDownload = () => {
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const startDownload = (url: string) => {
    setIsDownloading(true);
    setProgress(0);

    // We point this to your Node server on port 4000
    // Note: Use your PC's actual IP (e.g. 192.168.1.5) if testing on your Galaxy
    const eventSource = new EventSource(
      `http://localhost:4000/download?url=${encodeURIComponent(url)}`,
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.status === "downloading") {
        setProgress(parseFloat(data.percent));
      }

      if (data.status === "finished") {
        setProgress(100);
        setIsDownloading(false);
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      console.error("The My Melody Engine disconnected.");
      setIsDownloading(false);
      eventSource.close();
    };
  };

  return { startDownload, progress, isDownloading };
};
