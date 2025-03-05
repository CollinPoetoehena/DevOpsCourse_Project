const title = "Rent a Car";

// Set URLs from the .env file (next.js has build in support for .env files: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
// Environment variables have to include the prefix NEXT_PUBLIC_ to be available for the browser, otherwise it shows undefined
const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
const racUrl = process.env.NEXT_PUBLIC_BACKEND_FULL_URL;
// const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
// const racUrl = process.env.BACKEND_FULL_URL || 'http://localhost:4001/api/v1';

// Log variables for debugging purposes
console.log("FRONTEND_URL:", baseUrl);
console.log("BACKEND_FULL_URL:", racUrl);

const config = {
    title,
    titleWithSeparator: ` | ${title}`,
    role: "user",
    baseUrl,
    user: `${racUrl}/users`,
    car: `${racUrl}/cars`,
    garage: `${racUrl}/garages`,
    reservation: `${racUrl}/reservations`,
    vehicle: `${racUrl}/vehicles`,
};

export default config;