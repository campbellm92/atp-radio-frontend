export function openTooltip() {
  const trigger = document.querySelector<HTMLButtonElement>(".tooltip-trigger");
  const content = document.querySelector<HTMLElement>(".tooltip-text");

  if (!trigger || !content) return;

  trigger.addEventListener("click", () => {
    const isOpen = content.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (e) => {
    if (
      !content.contains(e.target as Node) &&
      !trigger.contains(e.target as Node)
    ) {
      content.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    }
  });
}
