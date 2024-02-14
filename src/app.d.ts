// See https://kit.svelte.dev/docs/types#app

import type { Cart } from "@chec/commerce.js/types/cart";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			cartId: string;
			cart: Cart
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
