import { PaginationParams } from "@/core/repositories/pagination-params";
import { Order } from "../entities/order";

export abstract class OrdersRepository {
    abstract create(order: Order): Promise<void>
    abstract findMany(params: PaginationParams): Promise<Order[]>
}