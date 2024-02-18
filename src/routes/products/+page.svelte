<script>
    import { products } from "$lib/stores/products";
</script>

<div class="grid">
    {#each $products as product}
    <div>
        <hgroup>
            <h3>{ product.name }</h3>
            <p>{ product.desc }</p>
        </hgroup>
        <p>${ (product.displayPrice) ? product.displayPrice.toFixed(2) : '0.00' }</p>
        {#if product.images}
            <img src="{ product.images[0].url }" alt="{ product.images[0].name }">
        {/if}
        <a href="/products/{ product.slug }" style="display: block;">View product</a>
    </div>

    {/each}
</div>
