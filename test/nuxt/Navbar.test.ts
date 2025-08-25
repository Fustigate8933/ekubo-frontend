import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import NavBar from "@/components/NavBar.vue";

describe("NavBar testing", () => {
	it("renders Ekubo title", async () => {
		const wrapper = await mountSuspended(NavBar);
		expect(wrapper.text()).toContain("Ekubo");
	});

	it("renders a home link", async () => {
		const wrapper = await mountSuspended(NavBar);
		const link = wrapper.find("a");
		expect(link.attributes("href")).toBe("/");
	});

	it("toggles theme on button click", async () => {
		const wrapper = await mountSuspended(NavBar);
		const button = wrapper.find("button"); // Adjust selector as needed
		await button.trigger("click");
		expect(wrapper.vm.colorMode.preference).toBe("light"); // Assuming initial is 'dark'
	});
});
