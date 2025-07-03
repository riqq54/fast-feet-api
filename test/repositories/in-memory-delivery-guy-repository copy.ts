import { DeliveryGuy } from "@/fast-feet/entities/delivery-guy"
import { DeliveryGuyRepository } from "@/fast-feet/repositories/delivery-guy-repository"

export class InMemoryDeliveryGuyRepository implements DeliveryGuyRepository {
    
    public items: DeliveryGuy[] = []

    async findById(id: string): Promise<DeliveryGuy | null> {
        
        const deliveryGuy = this.items.find(item => {
            return item.id.toString() === id
        })

        if (!deliveryGuy){
            return null
        }

        return deliveryGuy
    }

    async findByCPF(cpf: string): Promise<DeliveryGuy | null> {
        const deliveryGuy = this.items.find(item => {
            return item.cpf.toString() === cpf
        })

        if (!deliveryGuy){
            return null
        }

        return deliveryGuy
    }

    async create(deliveryGuy: DeliveryGuy): Promise<void> {
        this.items.push(deliveryGuy)
    }

}