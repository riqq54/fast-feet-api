import { PaginationParams } from "@/core/repositories/pagination-params"
import { Receiver } from "@/fast-feet/entities/receiver"
import { ReceiversRepository } from "@/fast-feet/repositories/receivers-repository"

export class InMemoryReceiversRepository implements ReceiversRepository {
        
    public items: Receiver[] = []

    async findById(id: string) {
        
        const receiver = this.items.find(item => {
            return item.id.toString() === id
        })

        if (!receiver){
            return null
        }

        return receiver
    }

    async findByCPF(cpf: string) {
        const receiver = this.items.find(item => {
            return item.cpf.value === cpf
        })

        if (!receiver){
            return null
        }

        return receiver
    }

    async findMany({ page }: PaginationParams){
        const receivers = this.items.slice((page - 1) * 20, page * 20)

        return receivers
    }

    async create(receiver: Receiver) {
        this.items.push(receiver)
    }

    async save(receiver: Receiver) {
        const itemIndex = this.items.findIndex((item) => item.id === receiver.id)

        this.items[itemIndex] = receiver
    }

    async delete(receiver: Receiver) {
        const itemIndex = this.items.findIndex((item) => item.id === receiver.id)

        this.items.splice(itemIndex, 1)
    }

}