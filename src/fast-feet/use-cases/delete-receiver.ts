import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { AdminsRepository } from "../repositories/admins-repository"
import { ReceiversRepository } from "../repositories/receivers-repository"

interface DeleteReceiverUseCaseRequest{
    adminId: string
    receiverId: string
}

type DeleteReceiverUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteReceiverUseCase {
    constructor(
        private receiversRepository: ReceiversRepository,
        private adminsRepository: AdminsRepository
    ) {}

    async execute({ adminId, receiverId }: DeleteReceiverUseCaseRequest): Promise<DeleteReceiverUseCaseResponse> {
        const isAdmin = await this.adminsRepository.findById(adminId)
                
        if(!isAdmin) {
            return left(new NotAllowedError())
        }

        const receiver = await this.receiversRepository.findById(receiverId)
        
        if(!receiver){
            return left(new ResourceNotFoundError())
        }

        await this.receiversRepository.delete(receiver)

        return right({})
    }
}