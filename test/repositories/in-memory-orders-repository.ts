import { PaginationParams } from "@/core/repositories/pagination-params";
import { Order } from "@/fast-feet/entities/order";
import { OrdersRepository } from "@/fast-feet/repositories/orders-repository";

export class InMemoryOrdersRepository implements OrdersRepository {

    public items: Order[] = []

    async create(order: Order){
        this.items.push(order)
    }

    async findMany({ page }: PaginationParams) {
        const orders = this.items.slice((page - 1) * 20, page * 20)

        return orders
    }

}