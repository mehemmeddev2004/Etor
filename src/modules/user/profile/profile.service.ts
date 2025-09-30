import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";

import { DataSource, Repository } from "typeorm";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ClsService } from "nestjs-cls";
import { userEntity } from "src/database/user.entity";
import { ProfileEntiry } from "src/database/profile.entity";

@Injectable()
export class ProfileService {
    private profileRepo: Repository<ProfileEntiry>;

    constructor(
        private readonly cls: ClsService,
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {
        this.profileRepo = this.dataSource.getRepository(ProfileEntiry);
    }

    async find() {
        const user = this.cls.get<userEntity>('user');
        if (!user) throw new UnauthorizedException("User is not authenticated");

        const profiles = await this.profileRepo.find({ relations: ['user'] });
        return profiles;
    }

    async create(params: CreateProfileDto) {
        const user = this.cls.get<userEntity>('user');
        if (!user) throw new UnauthorizedException("User is not authenticated");

        const profile = this.profileRepo.create(params);
        await this.profileRepo.save(profile);
        return profile;
    }

    async update(params: UpdateProfileDto, id: number) {
        const user = this.cls.get<userEntity>('user');
        if (!user) throw new UnauthorizedException("User is not authenticated");

        const profile = await this.profileRepo.findOne({ where: { id } });
        if (!profile) throw new NotFoundException(`Profile with id ${id} not found`);

        await this.profileRepo.update(id, params);

        const updatedProfile = await this.profileRepo.findOne({ where: { id } });
        return {
            profile: updatedProfile,
            message: "Profile updated successfully"
        };
    }

    async delete(id: number) {
        const user = this.cls.get<userEntity>('user');
        if (!user) throw new UnauthorizedException("User is not authenticated");

        const profile = await this.profileRepo.findOne({ where: { id } });
        if (!profile) throw new NotFoundException(`Profile with id ${id} not found`);

        await this.profileRepo.delete(id);
        return {
            message: "Profile deleted successfully",
            deletedProfile: profile
        };
    }
}
