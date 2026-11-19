import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Nav } from "@/components/site/Nav";

vi.mock("@/components/site/Dashboard", () => ({ Signal: () => null }));
vi.mock("@/components/site/primitives", () => ({
  Magnetic: ({ children }: { children: React.ReactNode }) => children,
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.history.replaceState(null, "", "/");
});

describe("Hamburger navigation", () => {
  it.each([393, 768, 1023])(
    "closes and scrolls to the existing section below 1024px (%i)",
    async (width) => {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
      const scroll = vi.spyOn(window, "scrollTo");
      render(
        <>
          <Nav />
          <section id="platform" />
        </>,
      );
      const toggle = screen.getByRole("button", { name: "Toggle menu" });
      fireEvent.click(toggle);
      fireEvent.click(screen.getByRole("link", { name: "Unified CNAPP" }));
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      await waitFor(() => expect(scroll).toHaveBeenCalledWith({ top: 0, behavior: "smooth" }));
    },
  );

  it("leaves desktop dropdown anchor clicks native at 1024px", () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
    const scroll = vi.spyOn(window, "scrollTo");
    render(
      <>
        <Nav />
        <section id="platform" />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Platform" }));
    expect(fireEvent.click(screen.getByRole("link", { name: /Unified CNAPP/ }))).toBe(true);
    expect(scroll).not.toHaveBeenCalled();
  });
});
