import { PaginationParams } from "@/core/repositories/pagination-params";
import { Receiver } from "../entities/receiver";

export abstract class ReceiversRepository {
    abstract findById(id: string): Promise<Receiver | null>
    abstract findByCPF(cpf: string): Promise<Receiver | null>
    abstract findMany(params: PaginationParams): Promise<Receiver[]>
    abstract create(receiver: Receiver): Promise<void>
    abstract save(receiver: Receiver): Promise<void>
    abstract delete(receiver: Receiver): Promise<void>
}