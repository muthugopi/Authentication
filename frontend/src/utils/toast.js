let listeners = [];
let toasts = [];

export const toast = (message, type = "success", duration = 3000) => {
  const id = Date.now();

  toasts = [...toasts, { id, message, type }];
  listeners.forEach((l) => l([...toasts]));

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((l) => l([...toasts]));
  }, duration);
};

export const subscribeToast = (listener) => {
  listeners.push(listener);
  listener([...toasts]);

  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};
