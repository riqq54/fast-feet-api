import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { AdminsRepository } from "../repositories/admins-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { CPF } from "../entities/value-objects/cpf"
import { ReceiversRepository } from "../repositories/receivers-repository"
import { Receiver } from "../entities/receiver"

interface EditReceiverUseCaseRequest {
    adminId: string
    receiverId: string
    name: string
    cpf: string
}

type EditReceiverUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError, {
    receiver: Receiver
}>

export class EditReceiverUseCase {
    constructor(
        private receiversRepository:ReceiversRepository,
        private adminsRepository: AdminsRepository
    ) {}

    async execute({name, cpf, adminId, receiverId}: EditReceiverUseCaseRequest): Promise<EditReceiverUseCaseResponse>{
        const isAdmin = await this.adminsRepository.findById(adminId)
        
        if(!isAdmin) {
            return left(new NotAllowedError())
        }

        const receiver = await this.receiversRepository.findById(receiverId)
        
        if(!receiver){
            return left(new ResourceNotFoundError())
        }

        receiver.name = name
        receiver.cpf = CPF.create(cpf)

        await this.receiversRepository.save(receiver)

        return right({ receiver })
    }
}