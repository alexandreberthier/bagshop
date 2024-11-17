export function formatPrice(price: number){
    return new Intl.NumberFormat('de-AT', {style: 'currency', currency: 'EUR'}).format(price)
}