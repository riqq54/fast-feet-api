import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"
import { CreateOrderUseCase } from "./create-order"
import { InMemoryReceiversRepository } from "test/repositories/in-memory-receivers-repository"
import { InMemoryDeliveryGuysRepository } from "test/repositories/in-memory-delivery-guys-repository"
import { makeAdmin } from "test/factories/make-admin"
import { makeReceiver } from "test/factories/make-receiver"
import { makeDeliveryGuy } from "test/factories/make-delivery-guy"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { NotAllowedError } from "@/core/errors/not-allowed-error"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryDeliveryGuysRepository: InMemoryDeliveryGuysRepository
let inMemoryReceiversRepository: InMemoryReceiversRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: CreateOrderUseCase

describe('Create Order', () => {
    beforeEach(() => {
        inMemoryAdminsRepository = new InMemoryAdminsRepository()
        inMemoryDeliveryGuysRepository = new InMemoryDeliveryGuysRepository()
        inMemoryReceiversRepository = new InMemoryReceiversRepository()
        inMemoryOrdersRepository =  new InMemoryOrdersRepository()

        sut = new CreateOrderUseCase(
            inMemoryAdminsRepository,
            inMemoryDeliveryGuysRepository,
            inMemoryReceiversRepository,
            inMemoryOrdersRepository
        )
    })

    it('should be possible to create an Order', async () => {
        const adminUser = makeAdmin()
        inMemoryAdminsRepository.items.push(adminUser)

        const receiverUser = makeReceiver()
        inMemoryReceiversRepository.items.push(receiverUser)

        const deliveryGuyUser = makeDeliveryGuy()
        inMemoryDeliveryGuysRepository.items.push(deliveryGuyUser)

        const result = await sut.execute({
            adminId: adminUser.id.toString(),
            receiverId: receiverUser.id.toString(),
            deliveryGuyId: deliveryGuyUser.id.toString(),
            deliveryCoordinates: {
                latitude: -23.5614337,
                longitude: -46.6559015
            }
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            order: inMemoryOrdersRepository.items[0]
        })
    })

    it('should not be possible for a non-Admin user to create an Order', async () => {
        const nonAdminUser = makeReceiver()
        inMemoryReceiversRepository.items.push(nonAdminUser)

        const receiverUser = makeReceiver()
        inMemoryReceiversRepository.items.push(receiverUser)

        const deliveryGuyUser = makeDeliveryGuy()
        inMemoryDeliveryGuysRepository.items.push(deliveryGuyUser)

        const result = await sut.execute({
            adminId: nonAdminUser.id.toString(),
            receiverId: receiverUser.id.toString(),
            deliveryGuyId: deliveryGuyUser.id.toString(),
            deliveryCoordinates: {
                latitude: -23.5614337,
                longitude: -46.6559015
            }
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})