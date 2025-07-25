import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CPF } from "./value-objects/cpf";
import { Optional } from "@/core/types/optional";

export interface ReceiverProps{
    name: string
    cpf: CPF
    password: string
    createdAt: Date
    updatedAt?: Date | null
}

export class Receiver extends Entity<ReceiverProps> {

    get name() {
        return this.props.name
    }

    set name(name: string) {
        this.props.name =  name
        
        this.touch()
    }
    
    get cpf() {
        return this.props.cpf
    }

    set cpf(cpf: CPF){
        this.props.cpf = cpf
        
        this.touch()
    }

    get password() {
        return this.props.password
    }

    get createdAt(){
        return this.props.createdAt
    }

    get updatedAt(){
        return this.props.updatedAt
    }

    private touch(){
        this.props.updatedAt = new Date()
    }

    static create(props: Optional<ReceiverProps, 'createdAt'>, id?: UniqueEntityID){

        const receiver = new Receiver({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id)

        return receiver
    }
}