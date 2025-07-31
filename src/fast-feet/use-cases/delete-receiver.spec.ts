import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"
import { makeAdmin } from "test/factories/make-admin"
import { InMemoryReceiversRepository } from "test/repositories/in-memory-receivers-repository"
import { DeleteReceiverUseCase } from "./delete-receiver"
import { makeReceiver } from "test/factories/make-receiver"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryReceiversRepository: InMemoryReceiversRepository

let sut: DeleteReceiverUseCase

describe('Delete Receiver', () => {
    beforeEach(() => {

        inMemoryReceiversRepository = new InMemoryReceiversRepository()
        inMemoryAdminsRepository = new InMemoryAdminsRepository()

        sut = new DeleteReceiverUseCase(inMemoryReceiversRepository,inMemoryAdminsRepository)
    })

    it('should be possible to delete a Receiver', async () => {
        const admin = makeAdmin()
        await inMemoryAdminsRepository.create(admin)
        
        const receiver = makeReceiver()
        await inMemoryReceiversRepository.create(receiver)

        const result = await sut.execute({
            adminId: admin.id.toString(),
            receiverId: receiver.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryReceiversRepository.items).toHaveLength(0)
    })

    it('should not be possible for a non-admin user to delete a Receiver', async () => {
        const nonAdmin = makeReceiver()
        await inMemoryReceiversRepository.create(nonAdmin)
        
        const receiver = makeReceiver()
        await inMemoryReceiversRepository.create(receiver)

        const result = await sut.execute({
            adminId: nonAdmin.id.toString(),
            receiverId: receiver.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(inMemoryReceiversRepository.items).toHaveLength(2)
    })
})