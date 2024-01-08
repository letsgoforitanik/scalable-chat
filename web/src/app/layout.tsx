import { Inter } from "next/font/google";
import "./globals.css";

interface Props {
    children: React.ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: Props) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
