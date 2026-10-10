import { useState } from "react";
import { contact } from "../data/content";

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
    if (!formState.name.trim()) tempErrors.name = "Enter your name.";
    if (!formState.email || !/\S+@\S+\.\S+/.test(formState.email))
      tempErrors.email = "Enter a valid email address.";
    if (!formState.message.trim()) tempErrors.message = "Enter a message.";

    setErrors(tempErrors);
    // Move focus to the first invalid field once its error is rendered, so
    // screen readers announce the field together with its message.
    const firstInvalid = ["name", "email", "message"].find((k) => tempErrors[k]);
    if (firstInvalid) {
      requestAnimationFrame(() => document.getElementById(firstInvalid)?.focus());
    }
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    });
    // A result message stays until the next edit.
    setSubmitStatus(null);
    setRateLimitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRateLimitError(null);
    setSubmitStatus(null);

    const now = Date.now();
    const recentSubmits = getRecentSubmits();
    if (recentSubmits.length >= maxPerHour) {
      setRateLimitError("Too many messages from this browser. Try again later.");
      return;
    }
    const lastSubmit = recentSubmits[recentSubmits.length - 1];
    if (lastSubmit && now - lastSubmit < cooldownMs) {
      setRateLimitError("Too many messages from this browser. Try again later.");
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
          headers: { Accept: "application/json" },
          body: formData,
        });

        // FormSubmit's AJAX endpoint answers 200 even when it did not forward the message
        // (for example while the form still needs activation), so read its verdict.
        const result = await response.json().catch(() => null);
        const accepted = result && (result.success === true || result.success === "true");
        if (!response.ok || !accepted) {
          throw new Error(
            `Form submission failed (${response.status}): ${result?.message ?? "no JSON body"}`,
          );
        }

        setSubmitStatus("success");
        setFormState({ name: "", email: "", message: "" });
        storeSubmitTimestamp(now);
      } catch (error) {
        console.error("Error sending message:", error);
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const failureMessage =
    rateLimitError ||
    (submitStatus === "error"
      ? "Not sent. Try again, or use the links in the footer."
      : null);

  return (
    <section className="sec" id="contact" aria-labelledby="contact-title">
      <div className="win">
        <div className="win__bar win__bar--tall" aria-hidden="true">
          <span className="dots">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span className="win__title">~/contact</span>
        </div>
        <div className="contact__body">
          <div>
            <h2 className="h2" id="contact-title">
              Contact
            </h2>
            <p>
              {contact.sentence}
              {contactEmail && (
                <>
                  {" "}
                  Or write to{" "}
                  <a className="link" href={`mailto:${contactEmail}`}>
                    {contactEmail}
                  </a>
                  .
                </>
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form" noValidate>
            {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
            <div className="hp" aria-hidden="true">
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" />
            </div>
            <input type="hidden" name="_captcha" value="true" />

            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                data-key-focus
                value={formState.name}
                onChange={handleChange}
                aria-invalid={errors.name ? "true" : undefined}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p className="err" id="name-error">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={formState.email}
                onChange={handleChange}
                aria-invalid={errors.email ? "true" : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p className="err" id="email-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formState.message}
                onChange={handleChange}
                aria-invalid={errors.message ? "true" : undefined}
                aria-describedby={errors.message ? "message-error" : undefined}
              ></textarea>
              {errors.message && (
                <p className="err" id="message-error">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="form__foot">
              <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send message"}
              </button>
              {/* The live region stays in the DOM so the result is announced when it appears. */}
              <p className="status-msg" role="status">
                {submitStatus === "success" ? "Sent." : null}
              </p>
              {failureMessage && (
                <p className="status-msg is-error" role="alert">
                  {failureMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
