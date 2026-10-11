const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
	const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
	menuToggle.setAttribute("aria-expanded", String(!isOpen));
	menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
	navLinks.classList.toggle("is-open", !isOpen);
});

navLinks?.addEventListener("click", (event) => {
	if (event.target.closest("a")) {
		navLinks.classList.remove("is-open");
		menuToggle?.setAttribute("aria-expanded", "false");
		menuToggle?.setAttribute("aria-label", "Open navigation");
	}
});

document.querySelectorAll("#year").forEach((year) => {
	year.textContent = new Date().getFullYear();
});

const revealObserver = new IntersectionObserver((entries, observer) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add("is-visible");
			observer.unobserve(entry.target);
		}
	});
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;
const messageField = document.querySelector("#message");
const wordCount = document.querySelector("#word-count");
messageField?.addEventListener("input", () => {
	const count = countWords(messageField.value);
	wordCount.textContent = count >= 15 ? `${count} words ✓` : `${count} of 15 words`;
	wordCount.classList.toggle("is-met", count >= 15);
});

document.querySelector("#booking-form")?.addEventListener("submit", (event) => {
	event.preventDefault();
	const form = event.currentTarget;
	const status = document.querySelector("#form-status");
	const contact = form.contact.value.trim();
	const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
	const isPhone = contact.replace(/\D/g, "").length >= 10;
	if (!isEmail && !isPhone) {
		status.textContent = "Please enter a valid email address or phone number.";
		form.contact.focus();
		return;
	}
	if (!form.querySelector('input[name="availability"]:checked')) {
		status.textContent = "Please tick at least one time that usually works for you.";
		return;
	}
	if (countWords(form.message.value) < 15) {
		status.textContent = "Please share at least 15 words about what feels most in the way.";
		form.message.focus();
		return;
	}
	const bookingEmail = "";
	if (!bookingEmail) {
		status.textContent = "Booking email is not configured yet. Please use the contact details provided directly by Demetri.";
		return;
	}
	const fields = new FormData(form);
	const subject = encodeURIComponent("23-minute spark request");
	const body = encodeURIComponent(`First name: ${fields.get("name")}\nEmail or phone: ${fields.get("contact")}\nAvailability: ${fields.getAll("availability").join(", ")}\n\nWhat feels most in the way right now?\n${fields.get("message")}`);
	window.location.href = `mailto:${bookingEmail}?subject=${subject}&body=${body}`;
	status.textContent = "Your email app should open with your request ready to send.";
});

const homeHeader = document.querySelector(".home-header");
if (homeHeader) {
	const updateHeader = () => {
		const y = window.scrollY;
		if (y > 120) homeHeader.classList.add("is-scrolled");
		else if (y < 4) homeHeader.classList.remove("is-scrolled");
	};
	updateHeader();
	window.addEventListener("scroll", updateHeader, { passive: true });
}

const heroWord = document.querySelector(".hero-word");
if (heroWord && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
	const words = ["tense", "down", "alone", "angry", "numb"];
	let index = 0;
	setInterval(() => {
		heroWord.classList.add("is-out");
		setTimeout(() => {
			index = (index + 1) % words.length;
			heroWord.textContent = words[index];
			heroWord.classList.remove("is-out");
		}, 350);
	}, 2600);
}
