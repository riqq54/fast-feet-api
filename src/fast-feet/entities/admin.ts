import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CPF } from "./value-objects/cpf";
import { Optional } from "@/core/types/optional";

export interface AdminProps{
    name: string
    cpf: CPF
    password: string
    createdAt: Date
    updatedAt?: Date | null
}

export class Admin extends Entity<AdminProps> {

    get name() {
        return this.props.name
    }
    
    get cpf() {
        return this.props.cpf
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

    static create(props: Optional<AdminProps, 'createdAt'>, id?: UniqueEntityID){

        const admin = new Admin({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id)

        return admin
    }
}