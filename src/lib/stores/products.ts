import { mapProducts } from "$lib/square";
import { writable } from "svelte/store";

export type product = {
    id: string,
    name: string,
    slug: string,
    desc: string,
    images?: Array<{
        id: string,
        name: string,
        url: string,
    }>,
    variations: Array<{
        id: string,
        name: string,
        price: number,
    }>,
    mods: Array<{
        id: string,
        name: string,
        price: number,
    }>,
    displayPrice: number
};

async function createProducts() {
    const store = writable<product[]>([]);
    let products: product[] = []; // so I dont need to call update() to access the products

    await mapProducts()
        .then((mappedProducts) => {
            store.update((store) => {
                mappedProducts.forEach((p, i) => {
                    // add to local products
                    products.push({
                        id: p.id,
                        name: p.name,
                        slug: p.slug,
                        desc: p.desc,
                        images: p.images,
                        variations: p.variations,
                        mods: p.mods,
                        displayPrice: p.displayPrice
                    });

                    // add to products store
                    store.push(products[i]);
                });

                return store;
            });
        });

    function getProduct(productSlug: string) {
        let product: product | undefined;
        for(let p of products) {
            if (p.slug === productSlug) {
                product = p;
                break;
            }
        };

        return product;
    }

    return {
        ...store,
        getProduct
    };
}

export const products = await createProducts();