<script>
    import { products } from "$lib/stores/products";
</script>

<div class="grid">
    {#each $products as product}
    <div>
        <hgroup>
            <h3>{ product.name }</h3>
            <p>{ product.description }</p>
        </hgroup>
        <p>{ product.displayPrice }</p>
        {#if product.image}
            <img src="{ product.image.url }" alt="{ product.image.alt }">
        {/if}
        <a href="/products/{ product.url }" style="display: block;">View product</a>
    </div>

    {/each}
</div>
