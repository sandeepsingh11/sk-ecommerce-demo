<script>
    import { nav } from "$lib/_data/nav.json";
    import { cart } from "$lib/stores/cart";
    import { onMount } from "svelte";
    
    export let data;

    onMount(() => {
        cart.set();
    });

    /**
     * @param {Event} e
     * @param {string} lineItemId
     */
    function updateCart(e, lineItemId) {
        // @ts-ignore
        const quantity = e.target?.value;
        if (quantity) {
            cart.updateQuantity(lineItemId, quantity)
        }
    }

    /**
     * @param {string} lineItemId
     */
    function removeLineItem(lineItemId) {
        cart.removeLineItem(lineItemId);
    }
</script>

<svelte:head>
    <script type="text/javascript" src="https://{data.squareCdnPrefix}web.squarecdn.com/v1/square.js"></script>
</svelte:head>

<nav>
    {#each nav as item}
        <a href="{ item.url }">{ item.name }</a>
    {/each}
</nav>

<div>
    Cart:
    {#if $cart.lineItems.length > 0}
        <div class="grid">
            {#each $cart.lineItems as lineItem}
                <div>
                    <button type="button" on:click={() => removeLineItem(lineItem.id)}>X</button>
                    <div>Product: { lineItem.name }</div>
                    <div>Quantity: { lineItem.quantity }</div>
                    <div>Price: ${ lineItem.total }</div>
                    <input 
                        type="number" 
                        name="quantity" 
                        id="quantity-{lineItem.id}" 
                        value="{ lineItem.quantity }" 
                        min="1"
                        on:input={(e) => updateCart(e, lineItem.id)}
                    >
                </div>
            {/each}

            <div>Subtotal: ${$cart.subtotal}</div>
        </div>
        
        <a href="/checkout" role="button">Checkout</a>
    {/if}
</div>

<slot />