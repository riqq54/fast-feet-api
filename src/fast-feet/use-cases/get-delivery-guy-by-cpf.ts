import { Either, left, right } from "@/core/either";
import { DeliveryGuy } from "../entities/delivery-guy";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { DeliveryGuysRepository } from "../repositories/delivery-guys-repository";
import { AdminsRepository } from "../repositories/admins-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface GetDeliveryGuyByCPFUseCaseRequest {
    adminId: string
    cpf: string
}

type GetDeliveryGuyByCPFUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
    deliveryGuy: DeliveryGuy
}>

export class GetDeliveryGuyByCPFUseCase {
    constructor(
        private deliveryGuysRepository: DeliveryGuysRepository,
        private adminsRepository: AdminsRepository
    ) {}
    
    async execute({ cpf, adminId }:GetDeliveryGuyByCPFUseCaseRequest): Promise<GetDeliveryGuyByCPFUseCaseResponse>{

        const isAdmin = await this.adminsRepository.findById(adminId)
                
        if(!isAdmin) {
            return left(new NotAllowedError())
        }
        
        const deliveryGuy = await this.deliveryGuysRepository.findByCPF(cpf)

        if (!deliveryGuy){
            return left(new ResourceNotFoundError())
        }

        return right({ deliveryGuy })
    }
}