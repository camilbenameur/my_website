import SectionBar from "./SectionBar";
import { stack } from "../data/content";

export default function StackSection() {
  return (
    <section className="sec" id="stack" aria-labelledby="h-stack">
      <SectionBar path="~/stack" />
      <h2 className="h2" id="h-stack">
        Stack
      </h2>
      <div className="rows">
        {stack.map((group) => (
          <div className="srow" key={group.label}>
            <h3 className="sg__label">{group.label}</h3>
            <div>
              <ul className="chips">
                {group.items.map((item) => (
                  <li className="chip" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
              {group.note && <p className="small">{group.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
