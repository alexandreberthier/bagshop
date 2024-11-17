export function getImage(image:string){
    return new URL(`../assets/images/${image}`, import.meta.url).href
}