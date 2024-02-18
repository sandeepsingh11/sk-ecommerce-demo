<script>
    import { cart } from "$lib/stores/cart";
    import { products } from "$lib/stores/products";
    import { onMount } from "svelte";

    export let data;
    /** @type {import('./$types').ActionData} */
	export let form;
    
    export let quantity = 1;
    export let product = products.getProduct(data.productId);

    onMount(async () => {
        // if form submitted, add product
        if (form) {
            if (product) {
                // get selected variation
                /** @type {{id: string; name: string; price: number;}} */
                let selectedVariation = product.variations[0];
                product.variations.forEach(v => {
                    if (v.id === form?.variationId) selectedVariation = v;
                });

                // get selected mods
                /** @type {{id: string; name: string; price: number;}[]} */
                let selectedMods = [];
                form.modIds.forEach(modId => {
                    product?.mods.forEach(m => {
                        if (m.id === modId) selectedMods.push(m);
                    });
                })

                const formData = {
                    id: form.id, 
                    quantity: form.quantity,
                    variation: selectedVariation, 
                    mods: selectedMods
                }

                await cart.addItem(product, formData);
            }
        }
    })
</script>

<div>
    {#if product}
        <hgroup>
            <h3>{ product.name }</h3>
            <p>{ product.desc }</p>
        </hgroup>
        <p>${ (product.displayPrice) ? product.displayPrice.toFixed(2) : '0.00' }</p>
        {#if product.images}
            <img src="{ product.images[0].url }" alt="{ product.images[0].name }">
        {/if}

        <form method="POST">
            <div>
                {#if product.variations.length > 0}
                    <div class="mb-8">
                        <h3 class="text-2xl mb-2">Set:</h3>
    
                        <div>
                            {#each product.variations as variation, i}
                                <div class="mb-2">
                                    <input type="radio" name="variation" id="{variation.id}" value="{variation.id}" class="w-5 h-5 checked:bg-primary-500 checked:hover:bg-primary-500 checked:focus:bg-primary-500 border-primary-500 focus:ring-primary-500" required checked="{(i === 0) ? true : false}">
                                    <label for="{variation.id}">{variation.name} - ${ (variation.price) ? variation.price.toFixed(2) : '0.00' }</label>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
        
                {#if product.mods.length > 0}
                    <div class="mb-8">
                        <h3 class="text-2xl mb-2">Options:</h3>
                        {#each product.mods as mod}
                            <div class="mb-1">
                                <input type="checkbox" name="mods" id="mod-{ mod.id }" value="{ mod.id }" class="rounded checked:bg-primary-500 checked:hover:bg-primary-500 checked:focus:bg-primary-500 border-primary-500 focus:ring-primary-500">
                                <label for="mod-{ mod.id }">{ mod.name } - ${ (mod.price) ? mod.price.toFixed(2) : '0.00' }</label>
                            </div>
                        {/each}
                    </div>
                {/if}
        
                <div class="mb-8">
                    <label for="quantity" class="block text-2xl">Quantity:</label>
                    <input type="number" name="quantity" id="quantity" bind:value={quantity} min="1" class="w-[80px] rounded focus:ring-primary-500 focus:border-primary-500" required>
                </div>
            </div>
    
            <button type="submit">Add</button>
        </form>
    {:else}
        <p>Sorry, we could not find that product...</p>
    {/if}
</div>