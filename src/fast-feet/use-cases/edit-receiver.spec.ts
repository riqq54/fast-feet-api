import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"
import { CPF } from "../entities/value-objects/cpf"
import { makeAdmin } from "test/factories/make-admin"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { InMemoryReceiversRepository } from "test/repositories/in-memory-receivers-repository"
import { EditReceiverUseCase } from "./edit-receiver"
import { makeReceiver } from "test/factories/make-receiver"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryReceiversRepository: InMemoryReceiversRepository

let sut: EditReceiverUseCase

describe('Edit Receiver', () => {

    beforeEach(() => {

        inMemoryReceiversRepository = new InMemoryReceiversRepository()
        inMemoryAdminsRepository = new InMemoryAdminsRepository()

        sut = new EditReceiverUseCase(inMemoryReceiversRepository, inMemoryAdminsRepository)
    })

    it('should be possible to edit Receiver information', async () => {
        const receiver = makeReceiver({
            name: 'John Doe',
            cpf: CPF.create('111.111.111.11')
        })
        await inMemoryReceiversRepository.create(receiver)

        const admin = makeAdmin()
        await inMemoryAdminsRepository.create(admin)

        const result = await sut.execute({
            adminId: admin.id.toString(),
            receiverId: receiver.id.toString(),
            cpf: '123.456.789-10',
            name: 'John Doe Edited'
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toMatchObject({
            receiver: expect.objectContaining({
                name: 'John Doe Edited',
                cpf: expect.objectContaining({
                    value: '123.456.789-10',
                })
            })
        })
    })

    it('should not be possible for a non-admin user to edit a Receiver information', async ()=> {
        const receiver = makeReceiver({
            name: 'John Doe',
            cpf: CPF.create('111.111.111.11')
        })
        await inMemoryReceiversRepository.create(receiver)

        const nonAdmin = makeReceiver()
        await inMemoryReceiversRepository.create(nonAdmin)

        const result = await sut.execute({
            adminId: nonAdmin.id.toString(),
            receiverId: receiver.id.toString(),
            cpf: '123.456.789-10',
            name: 'John Doe Edited'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

})