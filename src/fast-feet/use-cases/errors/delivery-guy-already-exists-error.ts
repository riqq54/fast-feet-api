import { UseCaseError } from "@/core/errors/use-case-error";

export class DeliveryGuyAlreadyExistsError extends Error implements UseCaseError{
    constructor(identifier: string){
        super(`Delivery guy ${identifier} already exists`)
    }
}