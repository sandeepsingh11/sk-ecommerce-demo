import { error } from "@sveltejs/kit";
import { Client, Environment } from "square";

export const client = new Client({
    accessToken: import.meta.env.VITE_SQUARE_ACCESS_TOKEN,
    environment: (import.meta.env.VITE_MODE === "dev") ? Environment.Sandbox : Environment.Production,
});

// get locationId
// /** @type string | undefined */
// let locationId;
// await client.locationsApi.listLocations()
//     .then((response) => {
//         locationId = response.result.locations?.at(0)?.id;
//     });

export async function mapProducts() {
    // retrieve products (must be done in api context otherwise I get a cors error)
    const productsRes = await fetch('http://localhost:5173/api/products', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
    });

    // throw error if response is not ok
    if (!productsRes.ok) {
        error(500, 'An error occurred while fetching products.');
    }

    // extrapolate data
    const result = await productsRes.json();
    let productsImages = result.objects;

    // break response objects into their types
    const { products, images, mods } = separateCatalogObjects(productsImages)

    // add and map product's url slugs
    slugifyProducts(products);

    // build the product mapping
    /** @type import("./stores/products").product[] */
    let mapping = Array();
    products.forEach(product => {
        if (product.type === "ITEM") {
            // get a product's images, if any
            let productImages = undefined;
            if (product.itemData?.imageIds) productImages = getProductImages(images, product.itemData.imageIds);

            // get a product's variations
            const variations = getProductVariations(product);

            // get a product's modifiers, if any
            const modifiers = getProductModifiers(mods, product);

            mapping.push({
                id: product.id,
                name: product.itemData?.name || '(no name)',
                // @ts-ignore
                slug: product.itemData?.slug,
                desc: product.itemData?.description || '(no description)',
                images: productImages,
                variations,
                mods: modifiers,
                displayPrice: Number((Number(product.itemData?.variations?.at(0)?.itemVariationData?.priceMoney?.amount) / 100).toFixed(2))
            });
        }
    });

    return mapping;
}

/**
 * Break out and return the different types of Catalog Objects
 * @param {import("square").CatalogObject[] | undefined} catalog 
 */
function separateCatalogObjects(catalog) {
    /** @type {import("square").CatalogObject[]} */
    let products = [];
    /** @type {import("square").CatalogObject[]} */
    let images = [];
    /** @type {import("square").CatalogObject[]} */
    let mods = [];

    catalog?.forEach(obj => {
        if (obj.type === "ITEM") products.push(obj)
        else if (obj.type === "IMAGE") images.push(obj)
        else if (obj.type === "MODIFIER") mods.push(obj)
    });

    return { products, images, mods };
}

/**
 * Make a slug url out of the product's name
 * @param {import("square").CatalogObject[] | undefined} products 
 * 
 * @returns {import("square").CatalogObject[] | undefined} products
 */
function slugifyProducts(products) {
    products?.forEach(product => {
        // @ts-ignore
        if (product.type === "ITEM") product.itemData.slug = product.itemData?.name?.replace(" ", "-").toLowerCase();
    });

    return products;
}

/** 
 * Get a product's images, if any
 * @param {import("square").CatalogObject[] | undefined} catalogImages 
 * @param {string[]} imageIds 
 * 
 * @return {{id: string, name: string, url: string}[]} images
 */
function getProductImages(catalogImages, imageIds) {
    let images = Array();

    imageIds.forEach(imageId => {
        catalogImages?.forEach(productImage => {
            if (productImage.type === "IMAGE") {
                if (productImage.id === imageId) {
                    images.push({
                        id: productImage.id,
                        name: productImage.imageData?.name,
                        url: productImage.imageData?.url
                    });
                }
            }
        });
    });

    return images;
}

/**
 * Get a product's variations
 * @param {import("square").CatalogObject} product
 * 
 * @returns {{id: string, name: string, price: number}[]} variations
 */
function getProductVariations(product) {
    let variations = Array();

    product.itemData?.variations?.forEach(variation => {
        variations.push({
            id: variation.id,
            name: variation.itemVariationData?.name,
            price: Number(variation.itemVariationData?.priceMoney?.amount) / 100
        })
    });
    
    return variations;
}

/**
 * Get a product's modifications, if any
 * @param {import("square").CatalogObject[]} mods
 * @param {import("square").CatalogObject} product
 * 
 * @returns {{id: string, name: string, price: number}[]} modifiers
 */
function getProductModifiers(mods, product) {
    let modifiers = Array();

    product.itemData?.modifierListInfo?.forEach(modEntry => {
        mods.forEach(mod => {
            if (mod.modifierData?.modifierListId === modEntry.modifierListId) {
                modifiers.push({
                    id: mod.id,
                    name: mod.modifierData?.name,
                    price: Number(mod.modifierData?.priceMoney?.amount) / 100,
                });
            }
        });
    });

    return modifiers;
}