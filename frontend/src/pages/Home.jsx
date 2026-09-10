import Navbar from "../components/Navbar";
import WelcomeHero from "../components/WelcomeHero";
// import SignalShowcase from "../components/SignalShowcase";
import ModuleGrid from "../components/ModuleGrid";
import About from "../components/About";
import AudioInput from "../components/AudioInput/AudioInput";



function Home() {
    return (
        <>
            <Navbar />

            <main>
                <WelcomeHero />
                <ModuleGrid />
                <AudioInput />
                <About />
            </main>
        </>
    );
}

export default Home;