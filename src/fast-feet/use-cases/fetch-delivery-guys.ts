import { Either, right } from "@/core/either"
import { DeliveryGuy } from "../entities/delivery-guy"
import { DeliveryGuysRepository } from "../repositories/delivery-guys-repository"

interface FetchDeliveryGuysUseCaseRequest {
    page: number
}

type FetchDeliveryGuysUseCaseResponse = Either<null, {
    deliveryGuys: DeliveryGuy[]
}>

export class FetchDeliveryGuysUseCase {
    constructor(private deliveryGuysRepository: DeliveryGuysRepository) {}

    async execute({ page }:FetchDeliveryGuysUseCaseRequest):Promise<FetchDeliveryGuysUseCaseResponse> {
        
        const deliveryGuys = await this.deliveryGuysRepository.findMany({ page })

        return right({ deliveryGuys })

    }
}