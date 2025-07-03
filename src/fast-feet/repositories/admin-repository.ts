import { Admin } from "../entities/admin";

export abstract class AdminRepository {
    abstract findById(id: string): Promise<Admin | null>
    abstract create(admin: Admin): Promise<void>
}