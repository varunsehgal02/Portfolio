import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import DevToolsBlocker from "@/components/DevToolsBlocker";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import ClickSpark from "@/components/ClickSpark";

export const metadata = {
    title: "Varun Sehgal — UI/UX & Motion Designer",
    description:
        "Portfolio of Varun Sehgal — UI/UX Designer, Graphic Designer & Motion Graphics Artist crafting user-centered digital experiences.",
    keywords: ["UI/UX Designer", "Graphic Designer", "Motion Graphics", "Portfolio", "Varun Sehgal"],
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="bg-background text-text-primary antialiased" suppressHydrationWarning>
                <ClickSpark
                    sparkColor="#3B6DE0"
                    sparkSize={10}
                    sparkRadius={15}
                    sparkCount={8}
                    duration={400}
                >
                    <DevToolsBlocker />
                    <AnalyticsTracker />
                    <LoadingScreen />
                    <Navbar />
                    <main className="min-h-screen">{children}</main>
                    <Footer />
                </ClickSpark>
            </body>
        </html>
    );
}
