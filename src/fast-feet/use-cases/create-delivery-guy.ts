import { Either, left, right } from "@/core/either"
import { DeliveryGuy } from "../entities/delivery-guy"
import { AdminRepository } from "../repositories/admin-repository"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { DeliveryGuyRepository } from "../repositories/delivery-guy-repository"
import { DeliveryGuyAlreadyExistsError } from "./errors/delivery-guy-already-exists-error"
import { HashGenerator } from "../cryptography/hash-generator"

interface CreateDeliveryGuyUseCaseRequest {
    name: string
    cpf: string
    password: string
    adminId: string
}

type CreateDeliveryGuyUseCaseResponse = Either< NotAllowedError | DeliveryGuyAlreadyExistsError, {deliveryGuy: DeliveryGuy} >


export class CreateDeliveryGuyUseCase {

    constructor(
        private adminRepository: AdminRepository,
        private deliveryGuyRepository: DeliveryGuyRepository,
        private hashGenerator: HashGenerator
    ) {}

    async execute({name, cpf, password, adminId}: CreateDeliveryGuyUseCaseRequest): Promise<CreateDeliveryGuyUseCaseResponse> {

        const isAdmin = await this.adminRepository.findById(adminId)

        if(!isAdmin) {
            return left(new NotAllowedError())
        }

        const deliveryGuyWithSameCPF = await this.deliveryGuyRepository.findByCPF(cpf)

        if(deliveryGuyWithSameCPF){
            return left(new DeliveryGuyAlreadyExistsError(cpf))
        }

        const hashedPassword = await this.hashGenerator.hash(password)

        const deliveryGuy = DeliveryGuy.create({
            name,
            cpf,
            password: hashedPassword
        })

        await this.deliveryGuyRepository.create(deliveryGuy)

        return right({ deliveryGuy })
    }
}