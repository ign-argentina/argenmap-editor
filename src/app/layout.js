import { Inter } from "next/font/google";
import "./global.css";
import Navbar from './components/Navbar.js';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Argenmap Editor",
  description: "Editor de visores web",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
