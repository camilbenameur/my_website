// The slim window chrome above every section: three dots, a path, a hairline, an optional caption.
// Without a caption the whole bar is decoration; with one, the caption is real text.
export default function SectionBar({ path, caption }) {
  return (
    <div className="secbar" aria-hidden={caption ? undefined : "true"}>
      <span className="dots" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
      </span>
      <span aria-hidden="true">{path}</span>
      <span className="secbar__rule" aria-hidden="true"></span>
      {caption && <span>{caption}</span>}
    </div>
  );
}
