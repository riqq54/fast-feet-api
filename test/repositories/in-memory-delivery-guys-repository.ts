import { PaginationParams } from "@/core/repositories/pagination-params"
import { DeliveryGuy } from "@/fast-feet/entities/delivery-guy"
import { DeliveryGuysRepository } from "@/fast-feet/repositories/delivery-guys-repository"

export class InMemoryDeliveryGuysRepository implements DeliveryGuysRepository {
        
    public items: DeliveryGuy[] = []

    async findById(id: string) {
        
        const deliveryGuy = this.items.find(item => {
            return item.id.toString() === id
        })

        if (!deliveryGuy){
            return null
        }

        return deliveryGuy
    }

    async findByCPF(cpf: string) {
        const deliveryGuy = this.items.find(item => {
            return item.cpf.value === cpf
        })

        if (!deliveryGuy){
            return null
        }

        return deliveryGuy
    }

    async findMany({ page }: PaginationParams){
        const deliveryGuys = this.items.slice((page - 1) * 20, page * 20)

        return deliveryGuys
    }

    async create(deliveryGuy: DeliveryGuy) {
        this.items.push(deliveryGuy)
    }

    async save(deliveryGuy: DeliveryGuy) {
        const itemIndex = this.items.findIndex((item) => item.id === deliveryGuy.id)

        this.items[itemIndex] = deliveryGuy
    }

    async delete(deliveryGuy: DeliveryGuy) {
        const itemIndex = this.items.findIndex((item) => item.id === deliveryGuy.id)

        this.items.splice(itemIndex, 1)
    }

}