import SectionBar from "./SectionBar";
import { now } from "../data/content";

export default function NowSection() {
  return (
    <section className="sec now" id="now" aria-labelledby="h-now">
      <SectionBar path="~/now" caption={now.caption} />
      <h2 className="h2" id="h-now">
        Now
      </h2>
      <p>{now.text}</p>
    </section>
  );
}
