import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { DeliveryGuysRepository } from "../repositories/delivery-guys-repository"
import { AdminsRepository } from "../repositories/admins-repository"
import { Order } from "../entities/order"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ReceiversRepository } from "../repositories/receivers-repository"
import { OrdersRepository } from "../repositories/orders-repository"

interface CreateOrderUseCaseRequest {
    receiverId: string
    deliveryGuyId: string
    deliveryCoordinates: {
        latitude: number
        longitude: number
    }
    adminId: string
}

type CreateOrderUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError, {order: Order} >

export class CreateOrderUseCase {

    constructor(
        private adminsRepository: AdminsRepository,
        private deliveryGuysRepository: DeliveryGuysRepository,
        private receiversRepository: ReceiversRepository,
        private ordersRepository: OrdersRepository
    ) {}

    async execute({receiverId, deliveryGuyId, deliveryCoordinates, adminId}: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {

        const isAdmin = await this.adminsRepository.findById(adminId)

        if(!isAdmin) {
            return left(new NotAllowedError())
        }

        const deliveryGuy = await this.deliveryGuysRepository.findById(deliveryGuyId)

        if(!deliveryGuy){
            return left(new ResourceNotFoundError())
        }

        const receiver = await this.receiversRepository.findById(receiverId)

        if(!receiver){
            return left(new ResourceNotFoundError())
        }

        const order = Order.create({
            deliveryGuyId: new UniqueEntityID(deliveryGuyId),
            receiverId: new UniqueEntityID(receiverId),
            deliveryCoordinates,
        })

        this.ordersRepository.create(order)

        return right({ order })
    }
}