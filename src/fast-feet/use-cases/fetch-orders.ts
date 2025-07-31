import { Either, left, right } from "@/core/either"
import { AdminsRepository } from "../repositories/admins-repository"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { OrdersRepository } from "../repositories/orders-repository"
import { Order } from "../entities/order"

interface FetchOrdersUseCaseRequest {
    adminId: string
    page: number
}

type FetchOrdersUseCaseResponse = Either<NotAllowedError, {
    orders: Order[]
}>

export class FetchOrdersUseCase {
    constructor(
        private ordersRepository: OrdersRepository,
        private adminsRepository: AdminsRepository
    ) {}

    async execute({ adminId, page }:FetchOrdersUseCaseRequest):Promise<FetchOrdersUseCaseResponse> {

        const isAdmin = await this.adminsRepository.findById(adminId)
                
        if(!isAdmin) {
            return left(new NotAllowedError())
        }
        
        const orders = await this.ordersRepository.findMany({ page })

        return right({ orders })

    }
}