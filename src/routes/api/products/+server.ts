import { client } from "$lib/square.js";
import { json } from "@sveltejs/kit";

// @ts-ignore
BigInt.prototype.toJSON = function () {
    return this.toString();
};  

export async function POST() {
    try {
        const { result } = await client.catalogApi.listCatalog(undefined, 'ITEM,IMAGE,MODIFIER');
        return json(result);   
    } catch (error) {
        return json(error);
    }
}