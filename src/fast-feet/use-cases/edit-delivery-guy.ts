import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { DeliveryGuy } from "../entities/delivery-guy"
import { DeliveryGuysRepository } from "../repositories/delivery-guys-repository"
import { AdminsRepository } from "../repositories/admins-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { CPF } from "../entities/value-objects/cpf"

interface EditDeliveryGuyUseCaseRequest {
    adminId: string
    deliveryGuyId: string
    name: string
    cpf: string
}

type EditDeliveryGuyUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError, {
    deliveryGuy: DeliveryGuy
}>

export class EditDeliveryGuyUseCase {
    constructor(
        private deliveryGuysRepository:DeliveryGuysRepository,
        private adminsRepository: AdminsRepository
    ) {}

    async execute({name, cpf, adminId, deliveryGuyId}: EditDeliveryGuyUseCaseRequest): Promise<EditDeliveryGuyUseCaseResponse>{
        const isAdmin = await this.adminsRepository.findById(adminId)
        
        if(!isAdmin) {
            return left(new NotAllowedError())
        }

        const deliveryGuy = await this.deliveryGuysRepository.findById(deliveryGuyId)
        
        if(!deliveryGuy){
            return left(new ResourceNotFoundError())
        }

        deliveryGuy.name = name
        deliveryGuy.cpf = CPF.create(cpf)

        await this.deliveryGuysRepository.save(deliveryGuy)

        return right({ deliveryGuy })
    }
}