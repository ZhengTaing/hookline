export function renderLogin(message = "", mode: "signin" | "signup" = "signin"): string {
  return `
    <section class="login">
      <div class="brand">
        <img src="./icon.svg" alt="" width="48" height="48" />
        <h1>Hookline</h1>
        <p>Music theory for guitar players, a few minutes a day.</p>
      </div>
      <form id="login-form" novalidate>
        <label for="email">Email</label>
        <input id="email" name="email" type="email" autocomplete="email" required />
        <label for="password">Password</label>
        <input id="password" name="password" type="password"
          autocomplete="${mode === "signup" ? "new-password" : "current-password"}" minlength="8" required />
        <button class="btn" type="submit">${mode === "signup" ? "Create account" : "Log in"}</button>
        <p class="form-msg" role="status">${message}</p>
      </form>
      <button class="link" type="button" id="toggle-mode" data-mode="${mode}">
        ${mode === "signup" ? "Already have an account? Log in" : "First time here? Create your account"}
      </button>
    </section>
  `;
}
