import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { userEntity } from "src/database/user.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class userService {
    private userRepo: Repository<userEntity>
    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.userRepo = this.dataSource.getRepository(userEntity)
    }

    async find() {
        return await this.userRepo.find({
            relations:['profile']
        });
    }

    async findById(id: number) {
        try {
            const user = await this.userRepo.findOne({ where: { id } });
            if (!user) throw new BadRequestException("User is not found");
            return user;
        } catch (err) {
            console.log(err);
            throw new BadRequestException("failed get user id", err);
        }
    }

    async delete(id: number) {
        try {
            const user = await this.userRepo.findOne({ where: { id } });
            if (!user) throw new BadRequestException("User is not found");

            await this.userRepo.delete(id);

            return {
                user,
                message: "User deleted successfully"
            };

        } catch (err) {
            throw new BadRequestException("Error deleting user");
        }
    }

}