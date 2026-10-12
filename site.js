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
document.querySelectorAll(".footer-roots").forEach((item) => revealObserver.observe(item));

const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;
const wordFields = document.querySelectorAll("textarea[data-min-words]");
const updateWordCount = (field) => {
	const min = Number(field.dataset.minWords);
	const count = countWords(field.value);
	const output = document.querySelector(`.word-count[data-for="${field.id}"]`);
	output.textContent = count >= min ? `${count} words ✓` : `${count} of ${min} words`;
	output.classList.toggle("is-met", count >= min);
};
wordFields.forEach((field) => field.addEventListener("input", () => updateWordCount(field)));

document.querySelector("#booking-form")?.addEventListener("submit", async (event) => {
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
	if (countWords(form.tried.value) < 10) {
		status.textContent = "Please share at least 10 words about therapy or self-help you’ve tried, or why you haven’t.";
		form.tried.focus();
		return;
	}
	if (countWords(form.quality.value) < 20) {
		status.textContent = "Please share at least 20 words about your worst quality and an example of it in action.";
		form.quality.focus();
		return;
	}
	const fields = new FormData(form);
	const name = fields.get("name").trim();
	const payload = {
		access_key: "4f2765c3-d3f1-4fb9-b952-4385557aee73",
		subject: `23-minute spark request from ${name}`,
		from_name: "Juniper Wayfinding website",
		botcheck: fields.get("botcheck") ? true : "",
		"Preferred name": name,
		"Email or phone": contact,
		"Availability": fields.getAll("availability").join(", "),
		"What feels most in the way right now?": fields.get("message").trim(),
		"Tried therapy or self-help?": fields.get("tried").trim(),
		"Worst quality, with an example": fields.get("quality").trim()
	};
	if (isEmail) payload.email = contact;
	const button = form.querySelector('button[type="submit"]');
	button.disabled = true;
	status.textContent = "Sending…";
	try {
		const response = await fetch("https://api.web3forms.com/submit", {
			method: "POST",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify(payload)
		});
		const result = await response.json();
		if (!result.success) throw new Error(result.message);
		form.reset();
		wordFields.forEach(updateWordCount);
		status.textContent = `Thank you, ${name}. Your request is on its way, and Demetri will be in touch soon.`;
	} catch {
		status.textContent = "Something went wrong sending your request. Please try again in a moment.";
	} finally {
		button.disabled = false;
	}
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
	const words = ["burnt out", "frustrated", "nervous", "self-critical", "lonely"];
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

// Placeholder links (e.g. Instagram) stay put until a real URL is added.
document.querySelectorAll('a[href="#"]').forEach((link) => {
	link.addEventListener("click", (event) => event.preventDefault());
});
