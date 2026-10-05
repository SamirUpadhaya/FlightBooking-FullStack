export const unwrap = (response) => response?.data?.data ?? response?.data;

export const errorMessage = (error) => {
  const data = error?.response?.data;
  return data?.message || data?.error || error?.message || 'Something went wrong.';
};

export const formatDateTime = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

export const money = (value) => `₹${Number(value ?? 0).toLocaleString('en-IN')}`;
