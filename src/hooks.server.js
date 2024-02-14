/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    let cartId;
    if (cartId = event.cookies.get('commercejs_cart_id')) {
        event.locals.cartId = cartId;
    }
    
    return await resolve(event);
}