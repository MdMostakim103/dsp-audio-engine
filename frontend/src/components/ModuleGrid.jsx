import { modules } from "../data/modules";
import DSPModuleCard from "./DSPModuleCard";

function ModuleGrid({onModuleSelect}) {
    return (
        <section className="modules-section" id="modules">
            <div className="section-heading">
                <p className="section-label">EXPLORE DSP</p>

                <h2>
                    SIGNAL PROCESSING
                    <br />
                    <span>MODULES</span>
                </h2>

                <p className="section-description">
                    Explore different techniques for transforming,
                    analyzing, and understanding digital audio signals.
                </p>
            </div>

            <div className="modules-grid">
                {modules.map((module) => (
                    <DSPModuleCard
                        key={module.number}
                        module={module}
                        onSelect={onModuleSelect}
                    />
                ))}
            </div>
        </section>
    );
}

export default ModuleGrid;