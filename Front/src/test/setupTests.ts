import "@testing-library/jest-dom/vitest";

class MockIntersectionObserver {
	constructor(
		_callback?: IntersectionObserverCallback,
		_options?: IntersectionObserverInit
	) {}

	disconnect() {}
	observe() {}
	unobserve() {}

	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}
}

if (!("IntersectionObserver" in globalThis)) {
	Object.defineProperty(globalThis, "IntersectionObserver", {
		writable: true,
		configurable: true,
		value: MockIntersectionObserver,
	});
}
