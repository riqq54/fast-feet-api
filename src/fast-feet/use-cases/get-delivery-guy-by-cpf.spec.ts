import { GetDeliveryGuyByCPFUseCase } from "./get-delivery-guy-by-cpf"
import { makeDeliveryGuy } from "test/factories/make-delivery-guy"
import { CPF } from "../entities/value-objects/cpf"
import { InMemoryDeliveryGuysRepository } from "test/repositories/in-memory-delivery-guys-repository"
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"
import { makeAdmin } from "test/factories/make-admin"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryDeliveryGuysRepository: InMemoryDeliveryGuysRepository

let sut: GetDeliveryGuyByCPFUseCase

describe('Get Delivery Guy by CPF', () => {
    beforeEach(() => {

        inMemoryDeliveryGuysRepository = new InMemoryDeliveryGuysRepository()
        inMemoryAdminsRepository = new InMemoryAdminsRepository()

        sut = new GetDeliveryGuyByCPFUseCase(inMemoryDeliveryGuysRepository, inMemoryAdminsRepository)
    })

    it('should be possible to get a delivery guy by CPF', async () => {

        const admin = makeAdmin()
        await inMemoryAdminsRepository.create(admin)

        const deliveryGuy = makeDeliveryGuy({
            name: 'John Doe',
            cpf: CPF.create('123.456.789-10')
        })
        await inMemoryDeliveryGuysRepository.create(deliveryGuy)

        const result = await sut.execute({
            cpf: '123.456.789-10',
            adminId: admin.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toMatchObject({
            deliveryGuy: expect.objectContaining({
                name: 'John Doe'
            })
        })
    })
})