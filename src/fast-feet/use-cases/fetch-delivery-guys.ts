import { Either, left, right } from "@/core/either"
import { DeliveryGuy } from "../entities/delivery-guy"
import { DeliveryGuysRepository } from "../repositories/delivery-guys-repository"
import { AdminsRepository } from "../repositories/admins-repository"
import { NotAllowedError } from "@/core/errors/not-allowed-error"

interface FetchDeliveryGuysUseCaseRequest {
    adminId: string
    page: number
}

type FetchDeliveryGuysUseCaseResponse = Either<NotAllowedError, {
    deliveryGuys: DeliveryGuy[]
}>

export class FetchDeliveryGuysUseCase {
    constructor(
        private deliveryGuysRepository: DeliveryGuysRepository,
        private adminsRepository: AdminsRepository
    ) {}

    async execute({ adminId, page }:FetchDeliveryGuysUseCaseRequest):Promise<FetchDeliveryGuysUseCaseResponse> {

        const isAdmin = await this.adminsRepository.findById(adminId)
                
        if(!isAdmin) {
            return left(new NotAllowedError())
        }
        
        const deliveryGuys = await this.deliveryGuysRepository.findMany({ page })

        return right({ deliveryGuys })

    }
}