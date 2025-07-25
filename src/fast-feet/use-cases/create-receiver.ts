import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { HashGenerator } from "../cryptography/hash-generator"
import { CPF } from "../entities/value-objects/cpf"
import { AdminsRepository } from "../repositories/admins-repository"
import { Receiver } from "../entities/receiver"
import { ReceiversRepository } from "../repositories/receivers-repository"
import { ReceiverAlreadyExistsError } from "./errors/receiver-already-exists-error"

interface CreateReceiverUseCaseRequest {
    name: string
    cpf: string
    password: string
    adminId: string
}

type CreateReceiverUseCaseResponse = Either< NotAllowedError | ReceiverAlreadyExistsError, {receiver: Receiver} >


export class CreateReceiverUseCase {

    constructor(
        private adminsRepository: AdminsRepository,
        private receiversRepository: ReceiversRepository,
        private hashGenerator: HashGenerator
    ) {}

    async execute({name, cpf, password, adminId}: CreateReceiverUseCaseRequest): Promise<CreateReceiverUseCaseResponse> {

        const isAdmin = await this.adminsRepository.findById(adminId)

        if(!isAdmin) {
            return left(new NotAllowedError())
        }

        const receiverWithSameCPF = await this.receiversRepository.findByCPF(cpf)

        if(receiverWithSameCPF){
            return left(new ReceiverAlreadyExistsError(cpf))
        }

        const hashedPassword = await this.hashGenerator.hash(password)

        const receiver = Receiver.create({
            name,
            cpf: CPF.create(cpf),
            password: hashedPassword
        })

        await this.receiversRepository.create(receiver)

        return right({ receiver })
    }
}