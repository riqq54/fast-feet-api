import { Admin } from "@/fast-feet/entities/admin";
import { AdminsRepository } from "@/fast-feet/repositories/admins-repository";

export class InMemoryAdminsRepository implements AdminsRepository {
    
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
        this.items.push(admin)
    }

}