import { Admin } from "@/fast-feet/entities/admin";
import { AdminRepository } from "@/fast-feet/repositories/admin-repository";

export class InMemoryAdminRepository implements AdminRepository {
    
    public items: Admin[] = []

    async findById(id: string): Promise<Admin | null> {
        
        const admin = this.items.find(item => {
            return item.id.toString() === id
        })

        if (!admin){
            return null
        }

        return admin
    }

    async create(admin: Admin): Promise<void> {
        throw new Error("Method not implemented.");
    }

}