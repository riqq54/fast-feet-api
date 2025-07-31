import { CPF } from "../entities/value-objects/cpf"
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"
import { makeAdmin } from "test/factories/make-admin"
import { InMemoryReceiversRepository } from "test/repositories/in-memory-receivers-repository"
import { GetReceiverByCPFUseCase } from "./get-receiver-by-cpf"
import { makeReceiver } from "test/factories/make-receiver"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryReceiversRepository: InMemoryReceiversRepository

let sut: GetReceiverByCPFUseCase

describe('Get Receiver by CPF', () => {
    beforeEach(() => {

        inMemoryReceiversRepository = new InMemoryReceiversRepository()
        inMemoryAdminsRepository = new InMemoryAdminsRepository()

        sut = new GetReceiverByCPFUseCase(inMemoryReceiversRepository, inMemoryAdminsRepository)
    })

    it('should be possible to get a receiver by CPF', async () => {

        const admin = makeAdmin()
        await inMemoryAdminsRepository.create(admin)

        const receiver = makeReceiver({
            name: 'John Doe',
            cpf: CPF.create('123.456.789-10')
        })
        await inMemoryReceiversRepository.create(receiver)

        const result = await sut.execute({
            cpf: '123.456.789-10',
            adminId: admin.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toMatchObject({
            receiver: expect.objectContaining({
                name: 'John Doe'
            })
        })
    })
})