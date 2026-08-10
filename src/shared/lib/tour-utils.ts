import type { ExpectedValue, TourConfig, TourStep } from "@/features/learning/types";

/** Steps that apply to the selected scenario (or all steps if no scenario). */
export function activeTourSteps(config: TourConfig, scenarioId?: string | null): TourStep[] {
  if (!scenarioId) return config.steps;
  return config.steps.filter((s) => !s.scenarioIds?.length || s.scenarioIds.includes(scenarioId));
}

export function fillInput(selector: string, value: string) {
  const el = document.querySelector<HTMLInputElement>(selector);
  if (!el) return;
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

export function setSelect(selector: string, value: string) {
  const el = document.querySelector<HTMLSelectElement>(selector);
  if (!el) return;
  el.value = value;
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

export function setRadio(name: string, value: string) {
  const el = document.querySelector<HTMLInputElement>(`input[name="${name}"][value="${value}"]`);
  if (!el) return;
  el.checked = true;
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

/** Same as original TourUtils — toggles `.open` on `.modal-overlay`. */
export function openModal(id: string) {
  const el = document.getElementById(id);
  if (el) el.classList.add("open");
}

export function closeModal(id: string) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("open");
}

export function showToast(message: string, ms = 2500) {
  let toast = document.getElementById("demo-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "demo-toast";
    toast.className = "demo-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout((toast as any)._hideTimer);
  (toast as any)._hideTimer = window.setTimeout(() => {
    toast?.classList.remove("show");
  }, ms);
}

export function hasAnyValue(expected?: ExpectedValue) {
  if (!expected || expected.type === "action" || (expected as any).optional) return true;
  if (expected.type === "radio") {
    return !!document.querySelector<HTMLInputElement>(`input[name="${expected.name}"]:checked`);
  }
  if (expected.type === "input" || expected.type === "select") {
    const el = document.querySelector<HTMLInputElement>(expected.selector);
    if (!el) return false;
    return String(el.value || "").trim() !== "";
  }
  return false;
}

export function applyValue(expected?: ExpectedValue) {
  if (!expected) return;
  if (expected.type === "action") return;
  if (expected.type === "radio") {
    setRadio(expected.name, expected.value);
    return;
  }
  if (expected.type === "select") {
    setSelect(expected.selector, expected.value);
    return;
  }
  if (expected.type === "input") {
    fillInput(expected.selector, expected.value);
  }
}
