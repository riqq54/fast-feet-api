import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order, OrderProps } from "@/fast-feet/entities/order";

export function makeOrder(
    override: Partial<OrderProps> = {},
    id?: UniqueEntityID
){

    const order = Order.create({
        deliveryGuyId: new UniqueEntityID(),
        receiverId: new UniqueEntityID(),
        deliveryCoordinates: {
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude()
        },
        ...override
        },
        id
    )

    return order
}