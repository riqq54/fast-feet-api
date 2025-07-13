import { CreateDeliveryGuyUseCase } from "./create-delivery-guy"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeAdmin } from "test/factories/make-admin"
import { makeDeliveryGuy } from "test/factories/make-delivery-guy"
import { CPF } from "../entities/value-objects/cpf"
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admin-repository"
import { InMemoryDeliveryGuysRepository } from "test/repositories/in-memory-delivery-guys-repository copy"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { DeliveryGuyAlreadyExistsError } from "./errors/delivery-guy-already-exists-error"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryDeliveryGuysRepository: InMemoryDeliveryGuysRepository
let fakeHasher: FakeHasher

let sut: CreateDeliveryGuyUseCase

describe('Create Delivery Guy', () => {
    beforeEach(() => {

        inMemoryAdminsRepository = new InMemoryAdminsRepository()
        inMemoryDeliveryGuysRepository = new InMemoryDeliveryGuysRepository()
        fakeHasher = new FakeHasher()
    
        sut = new CreateDeliveryGuyUseCase(
            inMemoryAdminsRepository,
            inMemoryDeliveryGuysRepository,
            fakeHasher
        )
    })

    it('should be able to create a Delivery Guy', async () => {

        const adminUser = makeAdmin()
        inMemoryAdminsRepository.items.push(adminUser)

        const result = await sut.execute({
            name: 'Delivery Guy',
            cpf: '123.456.789-10',
            password: '123456',
            adminId: adminUser.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            deliveryGuy: inMemoryDeliveryGuysRepository.items[0]
        })
    })

    it('should hash Delivery Guy password upon creation', async () => {

        const adminUser = makeAdmin()
        inMemoryAdminsRepository.items.push(adminUser)

        const result = await sut.execute({
            name: 'Delivery Guy',
            cpf: '123.456.789-10',
            password: '123456',
            adminId: adminUser.id.toString()
        })

        const hashedPassword = await fakeHasher.hash('123456')

        expect(result.isRight()).toBe(true)
        expect(inMemoryDeliveryGuysRepository.items[0].password).toEqual(hashedPassword)
    })

    it('should not be possible for a non-admin user to create a Delivery Guy', async () => {
        
        const nonAdminUser = makeDeliveryGuy({
            name: 'Non-admin user'
        })
        inMemoryDeliveryGuysRepository.items.push(nonAdminUser)
        
        const result = await sut.execute({
            name: 'Delivery Guy',
            cpf: '123.456.789-10',
            password: '123456',
            adminId: nonAdminUser.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

    it('should not be possible to create two Delivery Guys with the same CPF', async () => {

        const deliveryGuy = makeDeliveryGuy({
            cpf: CPF.create('123.456.789-10')
        })
        inMemoryDeliveryGuysRepository.items.push(deliveryGuy)

        const adminUser = makeAdmin()
        inMemoryAdminsRepository.items.push(adminUser)

        const result = await sut.execute({
            name: 'Delivery Guy',
            cpf: '123.456.789-10',
            password: '123456',
            adminId: adminUser.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(DeliveryGuyAlreadyExistsError)
    })
})