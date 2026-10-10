import SectionBar from "./SectionBar";
import { experience } from "../data/content";

export default function ExperienceSection() {
  return (
    <section className="sec" id="experience" aria-labelledby="h-experience">
      <SectionBar path="~/experience" />
      <h2 className="h2" id="h-experience">
        Experience
      </h2>
      <ol className="rows">
        {experience.map((job) => (
          <li className="xrow" key={job.from.iso}>
            <span className="xrow__date">
              <time dateTime={job.from.iso}>{job.from.label}</time>
              {" – "}
              {job.to ? <time dateTime={job.to.iso}>{job.to.label}</time> : "present"}
            </span>
            <span>
              <span className="xrow__role">{job.role}</span> · <span className="xrow__org">{job.org}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
