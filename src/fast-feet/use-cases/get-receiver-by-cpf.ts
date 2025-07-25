import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AdminsRepository } from "../repositories/admins-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { Receiver } from "../entities/receiver";
import { ReceiversRepository } from "../repositories/receivers-repository";

interface GetReceiverByCPFUseCaseRequest {
    adminId: string
    cpf: string
}

type GetReceiverByCPFUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
    receiver: Receiver
}>

export class GetReceiverByCPFUseCase {
    constructor(
        private receiversRepository: ReceiversRepository,
        private adminsRepository: AdminsRepository
    ) {}
    
    async execute({ cpf, adminId }:GetReceiverByCPFUseCaseRequest): Promise<GetReceiverByCPFUseCaseResponse>{

        const isAdmin = await this.adminsRepository.findById(adminId)
                
        if(!isAdmin) {
            return left(new NotAllowedError())
        }
        
        const receiver = await this.receiversRepository.findByCPF(cpf)

        if (!receiver){
            return left(new ResourceNotFoundError())
        }

        return right({ receiver })
    }
}