import './globals.css';

export const metadata = {
  title: 'Placement & Internship Tracker',
  description: 'A lightweight personal spreadsheet-style web application to track placement and internship opportunities for MSc Physics students.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
