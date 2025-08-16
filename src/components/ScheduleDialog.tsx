//src/components/ScheduleDialog.tsx
import React, { useEffect, useState } from "react";

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (dateTime: string) => Promise<void>;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ open, onClose, onSubmit }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [minTime, setMinTime] = useState("");

  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    setDate(today);
    updateMinTime(today);
  }, []);

  const updateMinTime = (selectedDate: string) => {
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate === today) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setMinTime(`${hh}:${mm}`);
    } else {
      setMinTime("00:00");
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    updateMinTime(e.target.value);
  };

  const handleSchedule = async () => {
    if (!date || !time) return;
    const dateTime = `${date}T${time}`;
    setLoading(true);
    await onSubmit(dateTime);
    setLoading(false);
    onClose();
  };

  const handlePostNow = async () => {
    setLoading(true);
    await onSubmit(new Date().toISOString());
    setLoading(false);
    onClose();
  };

  if (!open) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Schedule a Post</h3>

        <label>
          Date:
          <input
            type="date"
            value={date}
            min={today}
            onChange={handleDateChange}
          />
        </label>

        <label>
          Time:
          <input
            type="time"
            value={time}
            min={minTime}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>

        <div className="modal-buttons">
          <button onClick={onClose} disabled={loading}>Cancel</button>
          <button onClick={handleSchedule} disabled={loading || !time}>
            {loading ? "Scheduling..." : "Schedule"}
          </button>
          <button onClick={handlePostNow} disabled={loading}>
            {loading ? "Posting..." : "Post Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
