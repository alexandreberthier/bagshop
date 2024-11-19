import type { Timestamp } from "firebase/firestore";
import type {DeliveryData, PersonalData} from "@/models/User";

export enum DeliveryStatus {
    Pending = "In Bearbeitung",
    Finished= "Abgeschlossen",
}

export interface Item {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface OrderDTO {
    userId?: string;
    personalData: PersonalData; // Persönliche Daten des Benutzers
    deliveryData: DeliveryData; // Lieferadresse des Benutzers
    items: Item[];
    totalPrice: number;
    status: DeliveryStatus;
    createdAt: Date | Timestamp;
}

export class Order {
    private readonly _userId?: string;
    private readonly _personalData: PersonalData;
    private readonly _deliveryData: DeliveryData;
    private readonly _items: Item[];
    private readonly _totalPrice: number;
    private readonly _status: DeliveryStatus;
    private readonly _createdAt: Date | Timestamp;

    constructor(
        userId: string | undefined,
        personalData: PersonalData,
        deliveryData: DeliveryData,
        items: Item[],
        totalPrice: number,
        status: DeliveryStatus,
        createdAt: Date | Timestamp
    ) {
        this._userId = userId;
        this._personalData = personalData;
        this._deliveryData = deliveryData;
        this._items = items;
        this._totalPrice = totalPrice;
        this._status = status;
        this._createdAt = createdAt;
    }

    // Getter
    get userId(): string | undefined {
        return this._userId;
    }

    get personalData(): PersonalData {
        return this._personalData;
    }

    get deliveryData(): DeliveryData {
        return this._deliveryData;
    }

    get items(): Item[] {
        return this._items;
    }

    get totalPrice(): number {
        return this._totalPrice;
    }

    get status(): DeliveryStatus {
        return this._status;
    }

    get createdAt(): Date | Timestamp {
        return this._createdAt;
    }

    // Konvertierungsmethoden
    static fromDto(dto: OrderDTO): Order {
        return new Order(
            dto.userId,
            dto.personalData,
            dto.deliveryData,
            dto.items,
            dto.totalPrice,
            dto.status,
            dto.createdAt
        );
    }

    toDto(): OrderDTO {
        return {
            userId: this.userId,
            personalData: this.personalData,
            deliveryData: this.deliveryData,
            items: this.items,
            totalPrice: this.totalPrice,
            status: this.status,
            createdAt: this.createdAt,
        };
    }
}

