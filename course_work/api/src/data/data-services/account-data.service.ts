import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { account, account_info } from "@prisma/client";

@Injectable()
export class AccountDataService {

    constructor(private prisma: PrismaService) {}

    async getById(id: number) {
        return await this.prisma.account.findUnique({ 
            where: { id },
        });
    }

    async create(account: account, info: account_info) {
        
    }
}