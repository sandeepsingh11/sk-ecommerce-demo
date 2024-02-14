import { commercejs } from '$lib/commercejs';
import { writable } from 'svelte/store';
import type { product } from './products';

type lineItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

type cart = {
    cartId: string;
    lineItems: lineItem[];
    subtotal: number;
}

function createCart() {
    const cart = writable<cart>(
        {
            cartId: '',
            lineItems: Array(),
            subtotal: 0
        }
    );

    async function set(cartId: string) {
        await commercejs.cart.retrieve(cartId)
            .then((data) => {
                cart.update((cart) => {
                    cart.subtotal = 0;
                    data.line_items.forEach((item) => {
                        cart.lineItems.push({ 
                            id: item.id, 
                            name: item.name, 
                            quantity: item.quantity, 
                            price: Number(item.price.formatted)
                        })    

                        cart.subtotal += Number(item.price.formatted) * item.quantity;
                    });

                    cart.cartId = cartId;

                    return cart;
                });
            });
    }

    async function addItem(product: product, quantity: number) {
        const item: lineItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        };

        // add to local cart
        cart.update((cart) => {
            cart.lineItems.push(item)

            return cart;
        });

        // add to cookie
        await commercejs.cart.add(product.id, quantity);
    }

    async function updateQuantity(itemId: string, quantity: number) {
        https://dev.to/jdgamble555/the-unwritten-svelte-stores-guide-47la
        
        console.log(quantity);
        
        // update local cart
        cart.update((cart) => {
            // handle if 0
            if (quantity == 0) {
                console.log('q = 0');
                
                const index = cart.lineItems.findIndex(item => item.id === itemId);
                cart.lineItems.splice(index, 1);
                console.log(cart.lineItems);
                
            }

            cart.subtotal = 0;
            cart.lineItems.forEach(item => {
                if (item.id === itemId) {
                    item.quantity = quantity;
                }

                cart.subtotal += item.quantity * item.price;
            });
            
            return cart;
        });

        // update cookie
        await commercejs.cart.update(itemId, { quantity: quantity })
    }

    return {
        ...cart,
        set,
        addItem,
        updateQuantity,
        // increment: () => update((n) => n + 1),
        // decrement: () => update((n) => n - 1),
        // reset: () => set(0)
    };
}

export const cart = createCart();
