const API_BASE = process.env.NEXT_PUBLIC_API_URL;
export const API = {
  SAVE_ANALYSIS: `${API_BASE}/api/v1/analysis`,
  SAVED_ANALYSES: `${API_BASE}/api/v1/analysis/saved`,
  PATENT_CHECK: `${API_BASE}/api/v1/analysis/check`,
};
