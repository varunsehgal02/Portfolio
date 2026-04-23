import "./globals.css";
import "@/components/PillNav/PillNav.css";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import DevToolsBlocker from "@/components/DevToolsBlocker";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import ClickSpark from "@/components/ClickSpark";
import PillNav from "@/components/PillNav/PillNav";

const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
];

export const metadata = {
    title: "Varun Sehgal — UI/UX & Graphic Designer",
    description:
        "Portfolio of Varun Sehgal — UI/UX Designer & Graphic Designer crafting user-centered digital experiences.",
    keywords: ["UI/UX Designer", "Graphic Designer", "Portfolio", "Varun Sehgal"],
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
                    sparkColor="#E6FF00"
                    sparkSize={10}
                    sparkRadius={15}
                    sparkCount={8}
                    duration={400}
                >
                    <DevToolsBlocker />
                    <AnalyticsTracker />
                    <LoadingScreen />
                    <PillNav
                        items={navItems}
                        baseColor="#151515"
                        pillColor="#222222"
                        hoveredPillTextColor="#E6FF00"
                        pillTextColor="#A1A1AA"
                        initialLoadAnimation={true}
                    />
                    <main className="min-h-screen">{children}</main>
                    <Footer />
                </ClickSpark>
            </body>
        </html>
    );
}
