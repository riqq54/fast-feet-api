import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeAdmin } from "test/factories/make-admin"
import { CPF } from "../entities/value-objects/cpf"
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admin-repository"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { InMemoryReceiversRepository } from "test/repositories/in-memory-receivers-repository"
import { CreateReceiverUseCase } from "./create-receiver"
import { makeReceiver } from "test/factories/make-receiver"
import { ReceiverAlreadyExistsError } from "./errors/receiver-already-exists-error"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryReceiversRepository: InMemoryReceiversRepository
let fakeHasher: FakeHasher

let sut: CreateReceiverUseCase

describe('Create Receiver', () => {
    beforeEach(() => {

        inMemoryAdminsRepository = new InMemoryAdminsRepository()
        inMemoryReceiversRepository = new InMemoryReceiversRepository()
        fakeHasher = new FakeHasher()
    
        sut = new CreateReceiverUseCase(
            inMemoryAdminsRepository,
            inMemoryReceiversRepository,
            fakeHasher
        )
    })

    it('should be able to create a Receiver', async () => {

        const adminUser = makeAdmin()
        inMemoryAdminsRepository.items.push(adminUser)

        const result = await sut.execute({
            name: 'Receiver',
            cpf: '123.456.789-10',
            password: '123456',
            adminId: adminUser.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            receiver: inMemoryReceiversRepository.items[0]
        })
    })

    it('should hash Receiver password upon creation', async () => {

        const adminUser = makeAdmin()
        inMemoryAdminsRepository.items.push(adminUser)

        const result = await sut.execute({
            name: 'Receiver',
            cpf: '123.456.789-10',
            password: '123456',
            adminId: adminUser.id.toString()
        })

        const hashedPassword = await fakeHasher.hash('123456')

        expect(result.isRight()).toBe(true)
        expect(inMemoryReceiversRepository.items[0].password).toEqual(hashedPassword)
    })

    it('should not be possible for a non-admin user to create a Receiver', async () => {
        
        const nonAdminUser = makeReceiver({
            name: 'Non-admin user'
        })
        inMemoryReceiversRepository.items.push(nonAdminUser)
        
        const result = await sut.execute({
            name: 'Receiver',
            cpf: '123.456.789-10',
            password: '123456',
            adminId: nonAdminUser.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

    it('should not be possible to create two Receivers with the same CPF', async () => {

        const receiver = makeReceiver({
            cpf: CPF.create('123.456.789-10')
        })
        inMemoryReceiversRepository.items.push(receiver)

        const adminUser = makeAdmin()
        inMemoryAdminsRepository.items.push(adminUser)

        const result = await sut.execute({
            name: 'Receiver',
            cpf: '123.456.789-10',
            password: '123456',
            adminId: adminUser.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ReceiverAlreadyExistsError)
    })
})