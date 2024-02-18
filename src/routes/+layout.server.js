import { env } from '$env/dynamic/private';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
    let squareCdnPrefix = (env.VITE_MODE === "dev") ? "sandbox." : "";

    return {
        squareCdnPrefix
    }
}