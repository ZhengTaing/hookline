export function renderLogin(message = ""): string {
  return `
    <section class="login">
      <div class="brand">
        <img src="./icon.svg" alt="" width="48" height="48" />
        <h1>Hookline</h1>
        <p>Music theory for guitar players, a few minutes a day.</p>
      </div>
      <button class="btn" type="button" id="google">Continue with Google</button>
      <p class="form-msg" role="status">${message}</p>
      <button class="link" type="button" id="guest">Skip for now. Progress stays on this device</button>
    </section>
  `;
}
