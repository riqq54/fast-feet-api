import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"
import { makeAdmin } from "test/factories/make-admin"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { InMemoryReceiversRepository } from "test/repositories/in-memory-receivers-repository"
import { FetchReceiversUseCase } from "./fetch-receivers"
import { makeReceiver } from "test/factories/make-receiver"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryReceiversRepository: InMemoryReceiversRepository

let sut: FetchReceiversUseCase

describe('Fetch Receivers', () => {
    beforeEach(() => {

        inMemoryReceiversRepository = new InMemoryReceiversRepository()
        inMemoryAdminsRepository = new InMemoryAdminsRepository()

        sut = new FetchReceiversUseCase(inMemoryReceiversRepository, inMemoryAdminsRepository)
    })

    it('should be possible to fetch receivers', async () => {
        const admin = makeAdmin()
        await inMemoryAdminsRepository.create(admin)

        await inMemoryReceiversRepository.create(makeReceiver({
            name: 'Receiver 1'
        }))
        await inMemoryReceiversRepository.create(makeReceiver({
            name: 'Receiver 2'
        }))
        await inMemoryReceiversRepository.create(makeReceiver({
            name: 'Receiver 3'
        }))

        const result = await sut.execute({
            page: 1,
            adminId: admin.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            receivers: expect.arrayContaining([
                expect.objectContaining({ name: 'Receiver 1' }),
                expect.objectContaining({ name: 'Receiver 2' }),
                expect.objectContaining({ name: 'Receiver 3' }),
            ])
        })
    })

    it('should be possible to fetch paginated receivers', async () => {

        const admin = makeAdmin()
        await inMemoryAdminsRepository.create(admin)

        for (let i = 0; i < 22; i++) {
            await inMemoryReceiversRepository.create(makeReceiver({
                name: `Receiver ${i}` 
            }))
        }

        const result = await sut.execute({
            page: 2,
            adminId: admin.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            receivers: expect.arrayContaining([
                expect.objectContaining({ name: 'Receiver 20' }),
                expect.objectContaining({ name: 'Receiver 21' }),
            ])
        })
    })

    it('should not be possible for a non-admin user to fetch receivers', async () => {
        const nonAdmin = makeReceiver()
        await inMemoryReceiversRepository.create(nonAdmin)

        await inMemoryReceiversRepository.create(makeReceiver())
        await inMemoryReceiversRepository.create(makeReceiver())
        await inMemoryReceiversRepository.create(makeReceiver())

        const result = await sut.execute({
            page: 1,
            adminId: nonAdmin.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

})