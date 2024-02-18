export const cartCookieName = 'sk_ecommerce_cart';
export const orderCookieName = 'sk_ecommerce_order';

/**
 * Write data to a new or existing cookie.
 * @param {string} name 
 * @param {*} data 
 * @param {number} expDays 
 */
export function writeCookie(name, data, expDays = 14) {
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expValue = `expires=${date.toUTCString()}`;

    data = btoa(JSON.stringify(data));

    const https = (document.URL.indexOf('localhost')) ? false : true;

    document.cookie = `${name}=${data};${expValue};path=/;SameSite=Lax;${(https) ? 'Secure' : ''}`;
}

/**
 * Get cookie by name.
 * @param {string} name 
 * @return {any | undefined} cookie or undefined
 */
export function getCookieByName(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
        const value = parts?.pop()?.split(';').shift();

        if (value) return JSON.parse(atob(value));
    }

    return undefined;
}

/**
 * Delete the specified cookie.
 * @param {string} name 
 */
export function deleteCookieByName(name) {
    writeCookie(name, '', -1);
}

/**
 * Set a cookie via the server
 * @param {import ('@sveltejs/kit').Cookies} cookies
 * @param {string} name
 * @param {*} data
 * @param {number} expDays
 */
export function writeCookieViaServer(cookies, name, data, expDays = 14) {
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));

    cookies.set(name, btoa(JSON.stringify(data)), {
        path: '/',
        expires: date,
        httpOnly: (name === cartCookieName) ? false : true
    });
}

/**
 * Decode the cart object from the cookie
 * @param {string} encodedCart 
 */
export function decodeCart(encodedCart) {
    return JSON.parse(atob(encodedCart));
}

/**
 * Get the order object from the cookie
 * @param {string} encodedOrder 
 */
export function getOrder(encodedOrder) {
    return JSON.parse(atob(encodedOrder));
}

/**
 * Get the specified cookie
 * @param {import ('@sveltejs/kit').Cookies} cookies
 * @param {string} cookieName 
 */
export function getCookie(cookies, cookieName) {
    return cookies.get(cookieName);
}

/**
 * Delete the specified cookie
 * @param {import ('@sveltejs/kit').Cookies} cookies
 * @param {string} cookieName 
 */
export function deleteCookie(cookies, cookieName) {
    cookies.delete(cookieName, { path: '/' });
}