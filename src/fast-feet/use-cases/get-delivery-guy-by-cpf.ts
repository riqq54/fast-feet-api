import { Either, left, right } from "@/core/either";
import { DeliveryGuy } from "../entities/delivery-guy";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { DeliveryGuysRepository } from "../repositories/delivery-guys-repository";

interface GetDeliveryGuyByCPFUseCaseRequest {
    cpf: string
}

type GetDeliveryGuyByCPFUseCaseResponse = Either<ResourceNotFoundError, {
    deliveryGuy: DeliveryGuy
}>

export class GetDeliveryGuyByCPFUseCase {
    constructor(private deliveryGuysRepository: DeliveryGuysRepository) {}
    
    async execute({ cpf }:GetDeliveryGuyByCPFUseCaseRequest): Promise<GetDeliveryGuyByCPFUseCaseResponse>{
        
        const deliveryGuy = await this.deliveryGuysRepository.findByCPF(cpf)

        if (!deliveryGuy){
            return left(new ResourceNotFoundError())
        }

        return right({ deliveryGuy })
    }
}