<script>
    import { goto } from '$app/navigation';
    import { cart } from "$lib/stores/cart";
    import { onMount } from 'svelte';

    // localStorage.setItem('sk_ecommerce', 'test');
    // console.log(localStorage.getItem('sk_ecommerce'));

    onMount(async () => {
        if (cart.isEmpty()) goto('/products');
        else cart.getHostedCheckout();
    });
</script>

<div class="flex flex-col justify-center items-center min-h-screen px-6">
    <p>Fetching Square's checkout page, you will be redirected to Square shortly!</p>
</div>