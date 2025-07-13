import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { DeliveryGuysRepository } from "../repositories/delivery-guys-repository"
import { AdminsRepository } from "../repositories/admins-repository"

interface DeleteDeliveryGuyUseCaseRequest{
    adminId: string
    deliveryGuyId: string
}

type DeleteDeliveryGuyUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteDeliveryGuyUseCase {
    constructor(
        private deliveryGuysRepository: DeliveryGuysRepository,
        private adminsRepository: AdminsRepository
    ) {}

    async execute({ adminId, deliveryGuyId }: DeleteDeliveryGuyUseCaseRequest): Promise<DeleteDeliveryGuyUseCaseResponse> {
        const isAdmin = await this.adminsRepository.findById(adminId)
                
        if(!isAdmin) {
            return left(new NotAllowedError())
        }

        const deliveryGuy = await this.deliveryGuysRepository.findById(deliveryGuyId)
        
        if(!deliveryGuy){
            return left(new ResourceNotFoundError())
        }

        await this.deliveryGuysRepository.delete(deliveryGuy)

        return right({})
    }
}