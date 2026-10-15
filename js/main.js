drawSkillRings();

const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const honeypot = form.querySelector("#company");
  if (honeypot.value) {
    showSuccess();
    return;
  }

  const button = form.querySelector("button");
  const name = form.querySelector("#name").value.trim();
  const email = form.querySelector("#email").value.trim();
  const message = form.querySelector("#message").value.trim();

  button.disabled = true;
  button.textContent = "Sending…";
  status.textContent = "";
  status.className = "form-status";

  try {
    const response = await fetch("https://formsubmit.co/ajax/sborgquist@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `Website note from ${name}`,
        _template: "table",
        _captcha: "false",
        _replyto: email,
      }),
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    showSuccess();
  } catch {
    status.className = "form-status is-error";
    status.textContent = "That did not send. Please try again.";
    button.disabled = false;
    button.textContent = "Send message";
  }
});

function drawSkillRings() {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;

  document.querySelectorAll(".ring-card").forEach((card) => {
    const skills = card.querySelectorAll("li");
    const count = skills.length;
    const gap = count === 1 ? 22 : count >= 8 ? 8 : 10;
    const segment = (circumference - count * gap) / count;
    const group = card.querySelector(".segments");
    const colors = ["#152238", "#9a7848"];

    skills.forEach((_, index) => {
      const arc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      arc.setAttribute("cx", "60");
      arc.setAttribute("cy", "60");
      arc.setAttribute("r", String(radius));
      arc.setAttribute("fill", "none");
      arc.setAttribute("stroke", colors[index % 2]);
      arc.setAttribute("stroke-width", "11");
      arc.setAttribute("stroke-dasharray", `${segment} ${circumference - segment}`);
      arc.setAttribute("stroke-dashoffset", String(-(index * (segment + gap))));
      group.appendChild(arc);
    });
  });
}

function showSuccess() {
  form.hidden = true;
  status.className = "form-status is-success";
  status.textContent = "Message sent. Samantha will get back to you.";
}
