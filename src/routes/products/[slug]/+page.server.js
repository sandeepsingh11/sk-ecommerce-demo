import { randomUUID } from 'crypto';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const productId = params.slug;

    return {
        productId
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({request}) => {
        const form = await request.formData();
        const variationId = String(form.get('variation'));
        const mods = form.getAll('mods');
        const quantity = Number(form.get('quantity'));
        const id = randomUUID();

        /** @type string[] */
        let modIds = [];
        mods.forEach(m => {
            modIds.push(String(m));
        })

        return {
            id,
            variationId,
            modIds,
            quantity
        };
	}
};