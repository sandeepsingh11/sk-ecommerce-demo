import { writable } from 'svelte/store';
import { cartCookieName, getCookieByName, writeCookie } from '$lib/cookies';
import type { product } from './products';

type lineItem = {
    id: string,
    productId: string,
    name: string,
    desc: string,
    imageUrl?: string,
    variation: {
        id: string,
        name: string,
        price: number,
    },
    mods?: Array<{
        id: string,
        name: string,
        price: number,
    }>,
    quantity: number,
    total: number
}

export type cart = {
    lineItems: lineItem[];
    subtotal: number;
}

function createCart() {    
    const store = writable<cart>({
        lineItems: [],
        subtotal: 0
    });

    // set the cart store data
    function set() {
        let cartData = getCookieByName(cartCookieName);
        
        // if cart cookie does not exist, create it
        if (!cartData) {
            const defaultCart = {lineItems: [], subtotal: 0};
            
            writeCookie(cartCookieName, defaultCart);

            // get newly created cart cookie
            cartData = getCookieByName(cartCookieName);
        }

        if (cartData) {
            // set cart cookie data to cart store
            store.update((store) => {
                store.lineItems = cartData.lineItems;
                store.subtotal = cartData.subtotal;
                
                return store;
            })
        }
    }

    async function addItem(
        product: product, 
        formData: {
            id: string, 
            quantity: number, 
            variation: {id: string, name: string, price: number},
            mods: {id: string, name: string, price: number}[]
        }
    ) {
        const total = (formData.variation.price * formData.quantity) + formData.mods.reduce((acc, mod) => acc + mod.price, 0);

        const item: lineItem = {
            id: formData.id,
            productId: product.id,
            name: product.name,
            desc: product.desc,
            imageUrl: product.images?.at(0)?.url,
            variation: formData.variation,
            mods: formData.mods,
            quantity: formData.quantity,
            total: total
        };

        // set cart store in case it didnt run before (race condition)
        set();

        // update local cart
        store.update((store) => {
            store.lineItems.push(item);
            store.subtotal += item.total;

            // add to cart cookie
            writeCookie(cartCookieName, {lineItems: store.lineItems, subtotal: store.subtotal});
            
            return store;
        });
    }

    async function updateQuantity(lineItemId: string, quantity: number) {
        https://dev.to/jdgamble555/the-unwritten-svelte-stores-guide-47la
        
        // update local cart
        store.update((store) => {
            // // handle if 0
            // if (quantity == 0) {
            //     console.log('q = 0');
                
            //     const index = cart.lineItems.findIndex(item => item.id === lineItemId);
            //     cart.lineItems.splice(index, 1);
            //     console.log(cart.lineItems);
                
            // }

            store.subtotal = 0;
            store.lineItems.forEach(lineItem => {
                if (lineItem.id === lineItemId) {
                    lineItem.quantity = quantity;

                    let total = lineItem.variation.price * lineItem.quantity;
                    if (lineItem.mods) {
                        total += lineItem.mods.reduce((acc, mod) => acc + mod.price, 0);
                    }

                    lineItem.total = total;
                }

                store.subtotal += lineItem.total;
            });
            
            // add to cart cookie
            writeCookie(cartCookieName, {lineItems: store.lineItems, subtotal: store.subtotal});

            return store;
        });
    }

    return {
        ...store,
        set,
        addItem,
        updateQuantity,
        // increment: () => update((n) => n + 1),
        // decrement: () => update((n) => n - 1),
        // reset: () => set(0)
    };
}

export const cart = createCart();
