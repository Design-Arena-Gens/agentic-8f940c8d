import { useEffect } from "react";

type ToastProps = {
  message: string;
  duration?: number;
  onClose: () => void;
};

export function Toast({ message, duration = 2400, onClose }: ToastProps) {
  useEffect(() => {
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [duration, onClose]);

  return <div className="toast">{message}</div>;
}
