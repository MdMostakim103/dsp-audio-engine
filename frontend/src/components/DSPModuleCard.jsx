function DSPModuleCard({ module, onSelect }) {
    return (
        <article className="module-card" onClick={()=>onSelect(module)}>
            <div className="module-number">
                {module.number}
            </div>

            <div className="module-content">
                <h3>{module.title}</h3>

                <p>{module.description}</p>
            </div>

            <div className="module-arrow">
                ↗
            </div>
        </article>
    );
}

export default DSPModuleCard;