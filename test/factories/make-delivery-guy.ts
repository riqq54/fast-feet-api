import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CPF } from "@/fast-feet/entities/value-objects/cpf";
import { DeliveryGuy, DeliveryGuyProps } from "@/fast-feet/entities/delivery-guy";

export function makeDeliveryGuy(
    override: Partial<DeliveryGuyProps> = {},
    id?: UniqueEntityID
){

    const deliveryGuy = DeliveryGuy.create({
        name: faker.person.fullName(),
        cpf: CPF.create(faker.string.numeric(11)),
        password: faker.internet.password(),
        ...override
        },
        id
    )

    return deliveryGuy
}