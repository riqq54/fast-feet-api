import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface DeliveryGuyProps{
    name: string
    cpf: string
    password: string
}

export class DeliveryGuy extends Entity<DeliveryGuyProps> {

    get name() {
        return this.props.name
    }
    
    get cpf() {
        return this.props.cpf
    }

    get password() {
        return this.props.password
    }

    static create(props: DeliveryGuyProps, id?: UniqueEntityID){

        const deliveryGuy = new DeliveryGuy(props, id)

        return deliveryGuy
    }
}