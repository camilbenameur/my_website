import { useState } from "react";
import { motion } from "framer-motion";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { profile, socials } from "../data/content";
import SectionHeading from "./SectionHeading";

const socialIcons = {
  github: SiGithub,
  linkedin: SiLinkedin,
};

const inputClasses = (hasError) =>
  `w-full border bg-ink p-3 text-slate-200 placeholder:text-faint/60 transition-colors focus:outline-none focus:border-accent ${
    hasError ? "border-red-500/70" : "border-line"
  }`;

function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [rateLimitError, setRateLimitError] = useState(null);
  const formSubmitUrl = import.meta.env.VITE_FORMSUBMIT_URL;
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
  const rateLimitKey = "contactSubmitTimestamps";
  const maxPerHour = 3;
  const cooldownMs = 60 * 1000;

  const getRecentSubmits = () => {
    try {
      const raw = localStorage.getItem(rateLimitKey);
      const parsed = raw ? JSON.parse(raw) : [];
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      return parsed.filter((timestamp) => timestamp > oneHourAgo);
    } catch {
      return [];
    }
  };

  const storeSubmitTimestamp = (timestamp) => {
    try {
      const recent = getRecentSubmits();
      recent.push(timestamp);
      localStorage.setItem(rateLimitKey, JSON.stringify(recent));
    } catch {
      // Ignore localStorage failures (private mode, disabled, etc.).
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formState.name) tempErrors.name = "Name is required";
    if (!formState.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formState.email))
      tempErrors.email = "Email is invalid";
    if (!formState.message) tempErrors.message = "Message is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRateLimitError(null);

    const now = Date.now();
    const recentSubmits = getRecentSubmits();
    if (recentSubmits.length >= maxPerHour) {
      setRateLimitError("Too many messages. Please try again in about an hour.");
      return;
    }
    const lastSubmit = recentSubmits[recentSubmits.length - 1];
    if (lastSubmit && now - lastSubmit < cooldownMs) {
      setRateLimitError("Please wait a minute before sending another message.");
      return;
    }

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        if (!formSubmitUrl) {
          throw new Error("FormSubmit URL is not configured");
        }

        const formData = new FormData(e.currentTarget);
        const honeypotValue = formData.get("_honey");
        if (honeypotValue) {
          setSubmitStatus("success");
          setFormState({ name: "", email: "", message: "" });
          setIsSubmitting(false);
          return;
        }

        const response = await fetch(formSubmitUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Form submission failed");

        setSubmitStatus("success");
        setFormState({ name: "", email: "", message: "" });
        storeSubmitTimestamp(now);
      } catch (error) {
        console.error("Error sending message:", error);
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    }
  };

  return (
    <section id="contact" className="border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          num="04"
          label="Contact"
          title="Open a channel."
          intro="Collaboration, interesting problems, or just a friendly hello — the inbox is open."
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Channel info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8 lg:col-span-5"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-accent">
                <MdEmail size={20} />
              </span>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-faint">
                  Email
                </p>
                {contactEmail ? (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-slate-200 transition-colors hover:text-accent"
                  >
                    {contactEmail}
                  </a>
                ) : (
                  <span className="text-slate-200">Use the form — it lands in my inbox</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-accent">
                <MdLocationOn size={20} />
              </span>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-faint">
                  Location
                </p>
                <p className="text-slate-200">
                  {profile.location}{" "}
                  <span className="font-mono text-xs text-faint">
                    ({profile.coordinates})
                  </span>
                </p>
              </div>
            </div>

            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-faint">
                Elsewhere
              </p>
              <div className="flex gap-3">
                {socials.map((social) => {
                  const Icon = socialIcons[social.id];
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-12 w-12 items-center justify-center border border-line text-slate-300 transition-colors hover:border-accent hover:text-accent"
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Terminal form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="corner-ticks border border-line bg-panel">
              {/* Terminal header */}
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-signal/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
                </div>
                <span className="font-mono text-xs text-faint">message — send</span>
              </div>

              <form onSubmit={handleSubmit} className="p-5 sm:p-8" noValidate>
                <input
                  type="text"
                  name="_honey"
                  className="hidden"
                  tabIndex="-1"
                  autoComplete="off"
                />
                <input type="hidden" name="_captcha" value="true" />

                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="mb-2 block font-mono text-xs uppercase tracking-widest text-faint"
                  >
                    <span className="text-accent">$</span> name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className={inputClasses(errors.name)}
                    placeholder="Your name"
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="mt-1 font-mono text-xs text-red-400">{errors.name}</p>
                  )}
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="mb-2 block font-mono text-xs uppercase tracking-widest text-faint"
                  >
                    <span className="text-accent">$</span> email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className={inputClasses(errors.email)}
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="mt-1 font-mono text-xs text-red-400">{errors.email}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="mb-2 block font-mono text-xs uppercase tracking-widest text-faint"
                  >
                    <span className="text-accent">$</span> message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formState.message}
                    onChange={handleChange}
                    className={inputClasses(errors.message)}
                    placeholder="What are we building?"
                    disabled={isSubmitting}
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 font-mono text-xs text-red-400">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex min-h-12 w-full items-center justify-center font-mono text-sm font-semibold uppercase tracking-widest transition-colors ${
                    isSubmitting
                      ? "cursor-not-allowed bg-panel-2 text-faint"
                      : "bg-accent text-ink hover:bg-white"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-faint border-t-transparent" />
                      Transmitting…
                    </span>
                  ) : (
                    "Send message →"
                  )}
                </button>

                {submitStatus === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 border border-accent/40 bg-accent-dim p-3 text-center font-mono text-xs text-accent"
                  >
                    [OK] Message sent. I&apos;ll get back to you soon.
                  </motion.p>
                )}

                {submitStatus === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 border border-red-500/40 bg-red-500/10 p-3 text-center font-mono text-xs text-red-400"
                  >
                    [ERR] Failed to send. Please try again.
                  </motion.p>
                )}

                {rateLimitError && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 border border-signal/40 bg-signal/10 p-3 text-center font-mono text-xs text-signal"
                  >
                    [RATE] {rateLimitError}
                  </motion.p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
