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
     * @param {string} itemId
     */
    async function updateCart(e, itemId) {
        // // @ts-ignore
        // const quantity = e.target?.value;
        // if (quantity) {
        //     cart.updateQuantity(itemId, quantity)
        // }
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
    <div class="grid">
        {#each $cart.lineItems as item}
            <div>
                <div>Product: { item.name }</div>
                <div>Quantity: { item.quantity }</div>
                <div>Price: ${ item.total }</div>
                <input 
                    type="number" 
                    name="quantity" 
                    id="quantity-{item.id}" 
                    value="{ item.quantity }" 
                    min="0"
                    on:input={(e) => updateCart(e, item.id)}
                >
            </div>
        {/each}

        <div>Subtotal: ${$cart.subtotal}</div>
    </div>
</div>

<slot />