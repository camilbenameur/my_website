import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    setVisible(window.pageYOffset > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-opacity ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  );
}

export default ScrollToTop;
