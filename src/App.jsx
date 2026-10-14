import { intro, links, projects, experience } from "./data";
import PhysicsToday from "./components/PhysicsToday";
import ReadARepo from "./components/ReadARepo";

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>

      <header className="nav">
        <div className="wrap nav-inner">
          <a className="brand" href="#top">Anna Fatsevych</a>
          <nav aria-label="Main">
            <a href="#work">Work</a>
            <a href="#experience">Experience</a>
            <a href={links.cv}>CV</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero wrap" id="top">
          <div>
            <p className="eyebrow">{intro.eyebrow}</p>
            <h1>{intro.heading}</h1>
            <p className="lede">{intro.lede}</p>
            <div className="actions">
              <a className="btn primary" href="#work">See my work</a>
              <a className="btn" href={links.cv}>View full CV</a>
            </div>
          </div>
          <div className="hero-side">
            <PhysicsToday />
            <ReadARepo />
          </div>
        </section>

        <section className="wrap section" id="work">
          <h2>Selected work</h2>
          <div className="grid">
            {projects.map((p) => (
              <article className="card" key={p.name}>
                <img
                  src={p.image}
                  width={p.width}
                  height={p.height}
                  alt={p.alt}
                  loading="lazy"
                  style={p.imagePosition ? { objectPosition: p.imagePosition } : undefined}
                />
                <div className="card-body">
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <p className="stack">{p.stack}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap section" id="experience">
          <h2>Experience</h2>
          <ol className="timeline">
            {experience.map((job) => (
              <li key={job.company}>
                <p className="when">{job.when}</p>
                <div>
                  <h3>
                    {job.role} <span>{job.company}</span>
                  </h3>
                  <p>{job.summary}</p>
                </div>
              </li>
            ))}
          </ol>
          <a className="more" href={links.cv}>Full experience and skills on my CV →</a>
        </section>

        <section className="wrap section contact" id="contact">
          <h2>Get in touch</h2>
          <p>The best way to reach me is by email.</p>
          <a className="btn primary" href={`mailto:${links.email}`}>{links.email}</a>
          <ul className="links">
            <li><a href={links.github}>GitHub</a></li>
            <li><a href={links.linkedin}>LinkedIn</a></li>
            <li><a href={links.cv}>CV</a></li>
            <li><a href={links.blog}>Blog</a></li>
          </ul>
        </section>
      </main>

      <footer className="wrap footer">
        {/* The year was baked in at build time; let the browser update it without a warning. */}
        <p suppressHydrationWarning>© {new Date().getFullYear()} Anna Fatsevych</p>
      </footer>
    </>
  );
}
