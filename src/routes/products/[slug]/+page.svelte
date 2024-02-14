<script>
    import { cart } from "$lib/stores/cart";
    import { products } from "$lib/stores/products";

    export let data;
    
    export let quantity = 1;
    export let product = products.getProduct(data.productId);

    async function handleAdd() {
        if (product) {
            await cart.addItem(product, quantity)
        }
    }
</script>

<div>
    {#if product}
        <hgroup>
            <h3>{ product.name }</h3>
            <p>{ product.description }</p>
        </hgroup>
        <p>{ product.displayPrice }</p>
        {#if product.image}
            <img src="{ product.image.url }" alt="{ product.image.alt }">
        {/if}
        <input type="number" name="quantity" id="quantity" bind:value={quantity}>

        <button on:click={handleAdd}>Add</button>
    {:else}
        <p>Sorry, we could not find that product...</p>
    {/if}
</div>