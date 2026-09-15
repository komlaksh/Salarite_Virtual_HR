import "./globals.css";
import Navbar from "./components/navbar.js";

export const metadata = {
  title: "Salarite Virtual HR",
  description: "Virtual HR and ATS dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#f4f7f6]">
        <Navbar />

        <div className="lg:pl-64">
          {children}
        </div>
      </body>
    </html>
  );
}