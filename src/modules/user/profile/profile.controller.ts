import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "src/guard/auth.guard";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller('profile')
export class ProfileController {
    constructor(
        private profileService: ProfileService
    ) { }
    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    find() {
        return this.profileService.find()
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    create(@Body() body: CreateProfileDto) {
        return this.profileService.create(body)
    }

    @Post(':id/profileId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    update(@Param('id') id: number, @Body() body: UpdateProfileDto) {
        return this.profileService.update(body, id)
    }

    @Delete(':id/profileId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    delete(@Param('id') id: number) {
        return this.profileService.delete(id)
    }
}