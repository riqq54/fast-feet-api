import { Either, left, right } from "@/core/either"
import { DeliveryGuy } from "../entities/delivery-guy"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { DeliveryGuyAlreadyExistsError } from "./errors/delivery-guy-already-exists-error"
import { HashGenerator } from "../cryptography/hash-generator"
import { CPF } from "../entities/value-objects/cpf"
import { DeliveryGuysRepository } from "../repositories/delivery-guys-repository"
import { AdminsRepository } from "../repositories/admins-repository"

interface CreateDeliveryGuyUseCaseRequest {
    name: string
    cpf: string
    password: string
    adminId: string
}

type CreateDeliveryGuyUseCaseResponse = Either< NotAllowedError | DeliveryGuyAlreadyExistsError, {deliveryGuy: DeliveryGuy} >


export class CreateDeliveryGuyUseCase {

    constructor(
        private adminsRepository: AdminsRepository,
        private deliveryGuysRepository: DeliveryGuysRepository,
        private hashGenerator: HashGenerator
    ) {}

    async execute({name, cpf, password, adminId}: CreateDeliveryGuyUseCaseRequest): Promise<CreateDeliveryGuyUseCaseResponse> {

        const isAdmin = await this.adminsRepository.findById(adminId)

        if(!isAdmin) {
            return left(new NotAllowedError())
        }

        const deliveryGuyWithSameCPF = await this.deliveryGuysRepository.findByCPF(cpf)

        if(deliveryGuyWithSameCPF){
            return left(new DeliveryGuyAlreadyExistsError(cpf))
        }

        const hashedPassword = await this.hashGenerator.hash(password)

        const deliveryGuy = DeliveryGuy.create({
            name,
            cpf: CPF.create(cpf),
            password: hashedPassword
        })

        await this.deliveryGuysRepository.create(deliveryGuy)

        return right({ deliveryGuy })
    }
}