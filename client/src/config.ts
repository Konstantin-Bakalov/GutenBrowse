const apiURL = import.meta.env.VITE_API_URL;

if (!apiURL) {
  throw new Error('VITE_API_URL must be set');
}

export const config = {
  apiURL,
};
