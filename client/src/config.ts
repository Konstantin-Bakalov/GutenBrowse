const apiURL = import.meta.env.VITE_APP_API_URL;

if (!apiURL) {
  throw new Error('VITE_APP_API_URL must be set');
}

export const config = {
  apiURL,
};
