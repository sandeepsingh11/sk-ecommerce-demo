import { commercejs } from "$lib/commercejs";
import { writable } from "svelte/store";

export type product = {
    id: string,
    name: string,
    description: string,
    price: number,
    displayPrice: string,
    url: string,
    image?: {
        url: string,
        alt: string,
    }
}

async function createProducts() {
    const products = writable<product[]>([]);
    let _products: product[] = [];

    await commercejs.products.list()
        .then(({data}) => {
            products.update((products) => {
                // map each cjs product to local store objects
                data.forEach(product => {
                    let image;
                    if (product.image) {
                        image = {
                            url: product.image.url,
                            alt: product.image.description || product.image.filename
                        }
                    }

                    products.push({
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: Number(product.price.formatted),
                        displayPrice: product.price.formatted_with_symbol,
                        url: product.permalink,
                        image: image
                    })

                    _products.push({
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: Number(product.price.formatted),
                        displayPrice: product.price.formatted_with_symbol,
                        url: product.permalink,
                        image: image
                    })
                })
        
                return products;
            })
        });

    function getProduct(productSlug: string) {
        let product: product | undefined;
        _products.forEach(p => {
            if (p.url === productSlug) product = p;
        });

        return product;
    }

    return {
        ...products,
        getProduct
    };
}

export const products = await createProducts();