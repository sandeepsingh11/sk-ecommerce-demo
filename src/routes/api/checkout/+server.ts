import { error, json } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import { client } from '$lib/square.js';
import type { cart } from '$lib/stores/cart.js';

// @ts-ignore
BigInt.prototype.toJSON = function () {
    return this.toString();
};  

export async function POST({ request }) {
    const req = await request.json();

    let locationId: string | undefined;
    await client.locationsApi.listLocations()
        .then((response) => {
            locationId = response.result.locations?.at(0)?.id;
            
            if (!locationId) throw error(500, 'Could not get the Location ID.');
        });
    
    const cart: cart = req['cart'];
    
    if (!cart.lineItems) throw error(500, 'Cart is empty.');
    
    // prep line item payload
    let lineItems = Array();
    cart.lineItems.forEach(item => {
        let mods = Array();
        item.mods?.forEach(mod => {
            mods.push({
                name: mod.name,
                quantity: "1",
                basePriceMoney: {
                    amount: mod.price * 100,
                    currency: 'USD'
                }
            });
        });

        lineItems.push({
            name: item.name,
            quantity: String(item.quantity),
            variationName: item.variation.name,
            modifiers: mods,
            basePriceMoney: {
                amount: item.variation.price * 100,
                currency: 'USD'
            }
        })
    });

    // get Square hosted checkout link
    try {
        if (locationId) {
            const { result } = await client.checkoutApi.createPaymentLink({
                idempotencyKey: randomUUID(),
                order: {
                    locationId,
                    lineItems
                }
            });

            return json(result);
        }
    } catch (error) {
        return json(error);
    }
}