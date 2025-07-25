import { InMemoryDeliveryGuysRepository } from "test/repositories/in-memory-delivery-guys-repository"
import { FetchDeliveryGuysUseCase } from "./fetch-delivery-guys"
import { makeDeliveryGuy } from "test/factories/make-delivery-guy"
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admin-repository"
import { makeAdmin } from "test/factories/make-admin"
import { NotAllowedError } from "@/core/errors/not-allowed-error"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryDeliveryGuysRepository: InMemoryDeliveryGuysRepository

let sut: FetchDeliveryGuysUseCase

describe('Fetch Delivery Guys', () => {
    beforeEach(() => {

        inMemoryDeliveryGuysRepository = new InMemoryDeliveryGuysRepository()
        inMemoryAdminsRepository = new InMemoryAdminsRepository()

        sut = new FetchDeliveryGuysUseCase(inMemoryDeliveryGuysRepository, inMemoryAdminsRepository)
    })

    it('should be possible to fetch delivery guys', async () => {
        const admin = makeAdmin()
        await inMemoryAdminsRepository.create(admin)

        await inMemoryDeliveryGuysRepository.create(makeDeliveryGuy({
            name: 'Delivery Guy 1'
        }))
        await inMemoryDeliveryGuysRepository.create(makeDeliveryGuy({
            name: 'Delivery Guy 2'
        }))
        await inMemoryDeliveryGuysRepository.create(makeDeliveryGuy({
            name: 'Delivery Guy 3'
        }))

        const result = await sut.execute({
            page: 1,
            adminId: admin.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            deliveryGuys: expect.arrayContaining([
                expect.objectContaining({ name: 'Delivery Guy 1' }),
                expect.objectContaining({ name: 'Delivery Guy 2' }),
                expect.objectContaining({ name: 'Delivery Guy 3' }),
            ])
        })
    })

    it('should be possible to fetch paginated delivery guys', async () => {

        const admin = makeAdmin()
        await inMemoryAdminsRepository.create(admin)

        for (let i = 0; i < 22; i++) {
            await inMemoryDeliveryGuysRepository.create(makeDeliveryGuy({
                name: `Delivery Guy ${i}` 
            }))
        }

        const result = await sut.execute({
            page: 2,
            adminId: admin.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            deliveryGuys: expect.arrayContaining([
                expect.objectContaining({ name: 'Delivery Guy 20' }),
                expect.objectContaining({ name: 'Delivery Guy 21' }),
            ])
        })
    })

    it('should not be possible for a non-admin user to fetch delivery guys', async () => {
        const nonAdmin = makeDeliveryGuy()
        await inMemoryDeliveryGuysRepository.create(nonAdmin)

        await inMemoryDeliveryGuysRepository.create(makeDeliveryGuy())
        await inMemoryDeliveryGuysRepository.create(makeDeliveryGuy())
        await inMemoryDeliveryGuysRepository.create(makeDeliveryGuy())

        const result = await sut.execute({
            page: 1,
            adminId: nonAdmin.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

})