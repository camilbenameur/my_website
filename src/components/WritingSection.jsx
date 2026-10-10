import SectionBar from "./SectionBar";
import Ext from "./Ext";
import { writing, writingIndex } from "../data/content";

export default function WritingSection() {
  return (
    <section className="sec" id="writing" aria-labelledby="h-writing">
      <SectionBar path="~/writing" />
      <h2 className="h2" id="h-writing">
        Writing
      </h2>
      <ol className="rows">
        {writing.map((post) => (
          <li className="row" key={post.href}>
            <time className="row__date" dateTime={post.date.iso}>
              {post.date.label}
            </time>
            <div>
              <div className="row__top">
                <h3 className="row__title">
                  <a href={post.href}>
                    {post.title}
                    <Ext />
                  </a>
                </h3>
                {post.corrected && (
                  <span className="badge">
                    corrected <time dateTime={post.corrected.iso}>{post.corrected.label}</time>
                  </span>
                )}
              </div>
              <p className="row__line small">{post.line}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="more">
        <a className="link" href={writingIndex.href}>
          {writingIndex.label}
          <Ext />
        </a>
      </p>
    </section>
  );
}
