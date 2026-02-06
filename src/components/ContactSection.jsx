import { useState } from "react";
import { motion } from "framer-motion";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { MdEmail, MdLocationOn } from "react-icons/md";

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
        
        // Send the form using a form submission service
        const response = await fetch(formSubmitUrl, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Form submission failed');
        
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

  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section
      id="contact"
      className="min-h-screen flex items-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-16"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold mb-2">Contact Me</h2>
          <div className="mx-auto w-24 h-1 bg-blue-600 mb-6 rounded-full"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
            Feel free to reach out for collaborations or just a friendly hello
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Information */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
          >
            <motion.h3 
              variants={fadeInUp}
              className="text-2xl font-semibold mb-6"
            >
              Let's Connect
            </motion.h3>
            
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="flex items-center mb-4">
                <MdEmail className="text-blue-600 mr-3" size={24} />
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Email</h4>
                  {contactEmail ? (
                    <a href={`mailto:${contactEmail}`} className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition">
                      {contactEmail}
                    </a>
                  ) : (
                    <span className="text-gray-600 dark:text-gray-300">Use the form below</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <MdLocationOn className="text-blue-600 mr-3" size={24} />
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Location</h4>
                  <p className="text-gray-800 dark:text-gray-200">Nice, France</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <h4 className="text-lg font-semibold mb-4">Find me on</h4>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/camilbenameur"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600 transition"
                >
                  <SiGithub size={22} className="text-gray-800 dark:text-gray-200" />
                </a>
                <a
                  href="https://www.linkedin.com/in/camil-benameur-14a762194/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600 transition"
                >
                  <SiLinkedin size={22} className="text-gray-800 dark:text-gray-200" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <form 
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
            >
              <input type="text" name="_honey" className="hidden" tabIndex="-1" autoComplete="off" />
              <input type="hidden" name="_captcha" value="true" />
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-50 dark:bg-gray-700 border ${
                    errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  placeholder="Your Name"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-50 dark:bg-gray-700 border ${
                    errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  placeholder="Your Email"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formState.message}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-50 dark:bg-gray-700 border ${
                    errors.message ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  placeholder="Your Message"
                  disabled={isSubmitting}
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-5 font-medium rounded-lg transition-all transform hover:scale-[1.02] ${
                  isSubmitting 
                    ? "bg-gray-400 text-white cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Message"
                )}
              </button>

              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center"
                >
                  Message sent successfully! I'll get back to you soon.
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-center"
                >
                  Failed to send message. Please try again.
                </motion.div>
              )}

              {rateLimitError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-amber-100 text-amber-800 rounded-lg text-center"
                >
                  {rateLimitError}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;