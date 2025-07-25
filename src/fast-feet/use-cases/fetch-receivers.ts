import { Either, left, right } from "@/core/either"
import { AdminsRepository } from "../repositories/admins-repository"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ReceiversRepository } from "../repositories/receivers-repository"
import { Receiver } from "../entities/receiver"

interface FetchReceiversUseCaseRequest {
    adminId: string
    page: number
}

type FetchReceiversUseCaseResponse = Either<NotAllowedError, {
    receivers: Receiver[]
}>

export class FetchReceiversUseCase {
    constructor(
        private receiversRepository: ReceiversRepository,
        private adminsRepository: AdminsRepository
    ) {}

    async execute({ adminId, page }:FetchReceiversUseCaseRequest):Promise<FetchReceiversUseCaseResponse> {

        const isAdmin = await this.adminsRepository.findById(adminId)
                
        if(!isAdmin) {
            return left(new NotAllowedError())
        }
        
        const receivers = await this.receiversRepository.findMany({ page })

        return right({ receivers })

    }
}