import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Admin, AdminProps } from "@/fast-feet/entities/admin";
import { CPF } from "@/fast-feet/entities/value-objects/cpf";

export function makeAdmin(
    override: Partial<AdminProps> = {},
    id?: UniqueEntityID
){

    const admin = Admin.create({
        name: faker.person.fullName(),
        cpf: CPF.create(faker.string.numeric(11)),
        password: faker.internet.password(),
        ...override
        },
        id
    )

    return admin
}