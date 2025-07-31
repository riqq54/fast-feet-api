import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"
import { makeAdmin } from "test/factories/make-admin"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { FetchOrdersUseCase } from "./fetch-orders"
import { makeOrder } from "test/factories/make-order"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: FetchOrdersUseCase

describe('Fetch Orders', () => {
    beforeEach(() => {

        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        inMemoryAdminsRepository = new InMemoryAdminsRepository()

        sut = new FetchOrdersUseCase(inMemoryOrdersRepository, inMemoryAdminsRepository)
    })

    it.only('should be possible to fetch orders', async () => {
        const admin = makeAdmin()
        await inMemoryAdminsRepository.create(admin)

        await inMemoryOrdersRepository.create(makeOrder({},
            new UniqueEntityID('1')
        ))

        await inMemoryOrdersRepository.create(makeOrder({},
            new UniqueEntityID('2')
        ))

        await inMemoryOrdersRepository.create(makeOrder({},
            new UniqueEntityID('3')
        ))

        const result = await sut.execute({
            page: 1,
            adminId: admin.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            orders: expect.arrayContaining([
                expect.objectContaining({ id: new UniqueEntityID('1') }),
                expect.objectContaining({ id: new UniqueEntityID('2') }),
                expect.objectContaining({ id: new UniqueEntityID('3') }),
            ])
        })
    })

    it('should be possible to fetch paginated orders', async () => {

        const admin = makeAdmin()
        await inMemoryAdminsRepository.create(admin)

        for (let i = 0; i < 22; i++) {
            await inMemoryOrdersRepository.create(makeOrder({},
                new UniqueEntityID(`${i}`)
            ))
        }

        const result = await sut.execute({
            page: 2,
            adminId: admin.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            orders: expect.arrayContaining([
                expect.objectContaining({ id: new UniqueEntityID('20') }),
                expect.objectContaining({ id: new UniqueEntityID('21') }),
            ])
        })
    })

    it('should not be possible for a non-admin user to fetch orders', async () => {
        const nonAdmin = makeOrder()
        await inMemoryOrdersRepository.create(nonAdmin)

        await inMemoryOrdersRepository.create(makeOrder())
        await inMemoryOrdersRepository.create(makeOrder())
        await inMemoryOrdersRepository.create(makeOrder())

        const result = await sut.execute({
            page: 1,
            adminId: nonAdmin.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

})