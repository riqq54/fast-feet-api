import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CPF } from "@/fast-feet/entities/value-objects/cpf";
import { Receiver, ReceiverProps } from "@/fast-feet/entities/receiver";

export function makeReceiver(
    override: Partial<ReceiverProps> = {},
    id?: UniqueEntityID
){

    const receiver = Receiver.create({
        name: faker.person.fullName(),
        cpf: CPF.create(faker.string.numeric(11)),
        password: faker.internet.password(),
        ...override
        },
        id
    )

    return receiver
}