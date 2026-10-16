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

function showSuccess() {
  form.reset();
  form.hidden = true;
  status.className = "form-status is-success";
  status.textContent = "Message sent. Samantha will get back to you.";
}
