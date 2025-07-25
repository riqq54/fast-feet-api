import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface OrderProps {
    receiverId: UniqueEntityID
    deliveryGuyId: UniqueEntityID
    deliveryCoordinates: {
        latitude: number
        longitude: number
    }
    createdAt: Date
    pickedUpAt?: Date | null
    deliveredAt?: Date | null
    returnedAt?: Date | null
    updatedAt?: Date | null
}

export class Order extends Entity<OrderProps>{

    get receiverId() {
        return this.props.receiverId
    }

    get deliveryGuyId() {
        return this.props.deliveryGuyId
    }

    get deliveryCoordinates() {
        return this.props.deliveryCoordinates
    }

    get createdAt(){
        return this.props.createdAt
    }

    get pickedUpAt(){
        return this.props.pickedUpAt
    }

    set pickedUpAt(pickedUpAt: Date | null | undefined) {
        this.props.pickedUpAt = pickedUpAt
        this.touch()
    }

    get deliveredAt(){
        return this.props.deliveredAt
    }

    set deliveredAt(deliveredAt: Date | null | undefined) {
        this.props.deliveredAt = deliveredAt
        this.touch()
    }

    get returnedAt(){
        return this.props.returnedAt
    }

    set returnedAt(returnedAt: Date | null | undefined) {
        this.props.returnedAt = returnedAt
        this.touch()
    }

    get updatedAt(){
        return this.props.updatedAt
    }

    private touch(){
        this.props.updatedAt = new Date()
    }

    static create(props: Optional<OrderProps, 'createdAt'>, id?: UniqueEntityID) {
        const order = new Order({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id)

        return order
    }

}