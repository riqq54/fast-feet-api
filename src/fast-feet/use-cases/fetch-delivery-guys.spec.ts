import { InMemoryDeliveryGuysRepository } from "test/repositories/in-memory-delivery-guys-repository copy"
import { FetchDeliveryGuysUseCase } from "./fetch-delivery-guys"
import { makeDeliveryGuy } from "test/factories/make-delivery-guy"

let inMemoryDeliveryGuysRepository: InMemoryDeliveryGuysRepository

let sut: FetchDeliveryGuysUseCase

describe('Fetch Delivery Guys', () => {
    beforeEach(() => {

        inMemoryDeliveryGuysRepository = new InMemoryDeliveryGuysRepository()

        sut = new FetchDeliveryGuysUseCase(inMemoryDeliveryGuysRepository)
    })

    it('should be possible to fetch delivery guys', async () => {
        await inMemoryDeliveryGuysRepository.create(makeDeliveryGuy())
        await inMemoryDeliveryGuysRepository.create(makeDeliveryGuy())
        await inMemoryDeliveryGuysRepository.create(makeDeliveryGuy())

        const result = await sut.execute({
            page: 1
        })

        expect(result.value?.deliveryGuys).toHaveLength(3)
    })

    it('should be possible to fetch paginated delivery guys', async () => {
        for (let i = 0; i < 22; i++) {
            await inMemoryDeliveryGuysRepository.create(makeDeliveryGuy())
        }

        const result = await sut.execute({
            page: 2
        })

        expect(result.value?.deliveryGuys).toHaveLength(2)
    })
})