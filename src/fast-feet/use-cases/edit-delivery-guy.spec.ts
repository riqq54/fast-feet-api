import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"
import { InMemoryDeliveryGuysRepository } from "test/repositories/in-memory-delivery-guys-repository"
import { EditDeliveryGuyUseCase } from "./edit-delivery-guy"
import { makeDeliveryGuy } from "test/factories/make-delivery-guy"
import { CPF } from "../entities/value-objects/cpf"
import { makeAdmin } from "test/factories/make-admin"
import { NotAllowedError } from "@/core/errors/not-allowed-error"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryDeliveryGuysRepository: InMemoryDeliveryGuysRepository

let sut: EditDeliveryGuyUseCase

describe('Edit Delivery Guy', () => {

    beforeEach(() => {

        inMemoryDeliveryGuysRepository = new InMemoryDeliveryGuysRepository()
        inMemoryAdminsRepository = new InMemoryAdminsRepository()

        sut = new EditDeliveryGuyUseCase(inMemoryDeliveryGuysRepository, inMemoryAdminsRepository)
    })

    it('should be possible to edit Delivery Guy information', async () => {
        const deliveryGuy = makeDeliveryGuy({
            name: 'John Doe',
            cpf: CPF.create('111.111.111.11')
        })
        await inMemoryDeliveryGuysRepository.create(deliveryGuy)

        const admin = makeAdmin()
        await inMemoryAdminsRepository.create(admin)

        const result = await sut.execute({
            adminId: admin.id.toString(),
            deliveryGuyId: deliveryGuy.id.toString(),
            cpf: '123.456.789-10',
            name: 'John Doe Edited'
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toMatchObject({
            deliveryGuy: expect.objectContaining({
                name: 'John Doe Edited',
                cpf: expect.objectContaining({
                    value: '123.456.789-10',
                })
            })
        })
    })

    it('should not be possible for a non-admin user to edit a Delivery Guy information', async ()=> {
        const deliveryGuy = makeDeliveryGuy({
            name: 'John Doe',
            cpf: CPF.create('111.111.111.11')
        })
        await inMemoryDeliveryGuysRepository.create(deliveryGuy)

        const nonAdmin = makeDeliveryGuy()
        await inMemoryDeliveryGuysRepository.create(nonAdmin)

        const result = await sut.execute({
            adminId: nonAdmin.id.toString(),
            deliveryGuyId: deliveryGuy.id.toString(),
            cpf: '123.456.789-10',
            name: 'John Doe Edited'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

})