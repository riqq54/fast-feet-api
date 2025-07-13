import { PaginationParams } from "@/core/repositories/pagination-params";
import { DeliveryGuy } from "../entities/delivery-guy";

export abstract class DeliveryGuysRepository {
    abstract findById(id: string): Promise<DeliveryGuy | null>
    abstract findByCPF(cpf: string): Promise<DeliveryGuy | null>
    abstract findMany(params: PaginationParams): Promise<DeliveryGuy[]>
    abstract create(deliveryGuy: DeliveryGuy): Promise<void>
    abstract save(deliveryGuy: DeliveryGuy): Promise<void>
    abstract delete(deliveryGuy: DeliveryGuy): Promise<void>
}