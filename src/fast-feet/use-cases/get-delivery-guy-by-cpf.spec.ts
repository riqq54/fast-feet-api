import { GetDeliveryGuyByCPFUseCase } from "./get-delivery-guy-by-cpf"
import { makeDeliveryGuy } from "test/factories/make-delivery-guy"
import { CPF } from "../entities/value-objects/cpf"
import { InMemoryDeliveryGuysRepository } from "test/repositories/in-memory-delivery-guys-repository copy"

let inMemoryDeliveryGuysRepository: InMemoryDeliveryGuysRepository

let sut: GetDeliveryGuyByCPFUseCase

describe('Get Delivery Guy by CPF', () => {
    beforeEach(() => {

        inMemoryDeliveryGuysRepository = new InMemoryDeliveryGuysRepository()
        
        sut = new GetDeliveryGuyByCPFUseCase(inMemoryDeliveryGuysRepository)
    })

    it('should be possible to get a delivery guy by CPF', async () => {

        const deliveryGuy = makeDeliveryGuy({
            name: 'John Doe',
            cpf: CPF.create('123.456.789-10')
        })
        await inMemoryDeliveryGuysRepository.create(deliveryGuy)

        const result = await sut.execute({
            cpf: '123.456.789-10'
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toMatchObject({
            deliveryGuy: expect.objectContaining({
                name: 'John Doe'
            })
        })
    })
})