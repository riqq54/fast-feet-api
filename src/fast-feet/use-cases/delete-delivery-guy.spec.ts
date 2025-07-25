import { InMemoryAdminsRepository } from "test/repositories/in-memory-admin-repository"
import { InMemoryDeliveryGuysRepository } from "test/repositories/in-memory-delivery-guys-repository"
import { DeleteDeliveryGuyUseCase } from "./delete-delivery-guy"
import { makeDeliveryGuy } from "test/factories/make-delivery-guy"
import { makeAdmin } from "test/factories/make-admin"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryDeliveryGuysRepository: InMemoryDeliveryGuysRepository

let sut: DeleteDeliveryGuyUseCase

describe('Delete Delivery Guy', () => {
    beforeEach(() => {

        inMemoryDeliveryGuysRepository = new InMemoryDeliveryGuysRepository()
        inMemoryAdminsRepository = new InMemoryAdminsRepository()

        sut = new DeleteDeliveryGuyUseCase(inMemoryDeliveryGuysRepository,inMemoryAdminsRepository)
    })

    it('should be possible to delete a Delivery Guy', async () => {
        const admin = makeAdmin()
        await inMemoryAdminsRepository.create(admin)
        
        const deliveryGuy = makeDeliveryGuy()
        await inMemoryDeliveryGuysRepository.create(deliveryGuy)

        const result = await sut.execute({
            adminId: admin.id.toString(),
            deliveryGuyId: deliveryGuy.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryDeliveryGuysRepository.items).toHaveLength(0)
    })

    it('should not be possible for a non-admin user to delete a Delivery Guy', async () => {
        const nonAdmin = makeDeliveryGuy()
        await inMemoryDeliveryGuysRepository.create(nonAdmin)
        
        const deliveryGuy = makeDeliveryGuy()
        await inMemoryDeliveryGuysRepository.create(deliveryGuy)

        const result = await sut.execute({
            adminId: nonAdmin.id.toString(),
            deliveryGuyId: deliveryGuy.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(inMemoryDeliveryGuysRepository.items).toHaveLength(2)
    })
})