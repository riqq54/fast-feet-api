import { InMemoryAdminRepository } from "test/repositories/in-memory-admin-repository"
import { CreateDeliveryGuyUseCase } from "./create-delivery-guy"
import { InMemoryDeliveryGuyRepository } from "test/repositories/in-memory-delivery-guy-repository copy"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeAdmin } from "test/factories/make-admin"

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryDeliveryGuyRepository: InMemoryDeliveryGuyRepository
let fakeHasher: FakeHasher

let sut: CreateDeliveryGuyUseCase

describe('Create Delivery Guy', () => {
    beforeEach(() => {

        inMemoryAdminRepository = new InMemoryAdminRepository()
        inMemoryDeliveryGuyRepository = new InMemoryDeliveryGuyRepository()
        fakeHasher = new FakeHasher()
    
        sut = new CreateDeliveryGuyUseCase(
            inMemoryAdminRepository,
            inMemoryDeliveryGuyRepository,
            fakeHasher
        )
    })

    it('should be able to create a Delivery Guy', async () => {

        const adminUser = makeAdmin()
        inMemoryAdminRepository.items.push(adminUser)

        const result = await sut.execute({
            name: 'Delivery Guy',
            cpf: '123.456.789-10',
            password: '123456',
            adminId: adminUser.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            deliveryGuy: inMemoryDeliveryGuyRepository.items[0]
        })
    })

    it('should hash Delivery Guy password upon creation', async () => {

        const adminUser = makeAdmin()
        inMemoryAdminRepository.items.push(adminUser)

        const result = await sut.execute({
            name: 'Delivery Guy',
            cpf: '123.456.789-10',
            password: '123456',
            adminId: adminUser.id.toString()
        })

        const hashedPassword = await fakeHasher.hash('123456')

        expect(result.isRight()).toBe(true)
        expect(inMemoryDeliveryGuyRepository.items[0].password).toEqual(hashedPassword)
    })

    it('should not be possible for a non-admin user to create a Delivery Guy', async () => {
        
        const nonAdminUser = makeAdmin()
        
        const result = await sut.execute({
            name: 'Delivery Guy',
            cpf: '123.456.789-10',
            password: '123456',
            adminId: nonAdminUser.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(inMemoryDeliveryGuyRepository.items[0]).toBeUndefined()
    })
})