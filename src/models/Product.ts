export enum ProductCategory {
    HANDBAGS = "Handbags",
    SHOULDER_BAGS = "Shoulder Bags",
}

export interface ProductDTO {
    id?: string | undefined,
    displayName: string,
    description: string,
    price: number,
    category: ProductCategory
    images: string[]
}

export class Product {
    private readonly _id: string | undefined;
    private readonly _displayName: string;
    private readonly _description: string;
    private readonly _price: number
    private readonly _category: ProductCategory;
    private readonly _images: string[]


    constructor(id: string | undefined, displayName: string, description: string, price: number, category: ProductCategory, images: string[]) {
        this._id = id;
        this._displayName = displayName;
        this._description = description;
        this._price = price;
        this._category = category;
        this._images = images;
    }

    get id(): string | undefined {
        return this._id;
    }

    get displayName(): string {
        return this._displayName;
    }

    get description(): string {
        return this._description;
    }

    get price(): number {
        return this._price;
    }

    get category(): ProductCategory {
        return this._category;
    }

    get images(): string[] {
        return this._images;
    }

    static fromDto(dto: ProductDTO): Product {
        return new Product(
            dto.id,
            dto.displayName,
            dto.description,
            dto.price,
            dto.category,
            dto.images
        )
    }

    toDto(): ProductDTO {
        return {
            id: this.id,
            displayName: this.displayName,
            description: this.description,
            price: this.price,
            category: this.category,
            images: this.images
        }
    }

    getFormattedPrice() {
        return new Intl.NumberFormat('de-AT', {style: 'currency', currency: 'EUR'}).format(this._price)
    }
}