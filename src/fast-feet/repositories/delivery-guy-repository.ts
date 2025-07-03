import { DeliveryGuy } from "../entities/delivery-guy";

export abstract class DeliveryGuyRepository {
    abstract findById(id: string): Promise<DeliveryGuy | null>
    abstract findByCPF(cpf: string): Promise<DeliveryGuy | null>
    abstract create(deliveryGuy: DeliveryGuy): Promise<void>
}