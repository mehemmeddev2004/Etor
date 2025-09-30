import { 
  Controller, 
  Get, 
  Param, 
  Post, 
  Body, 
  Put, 
  Delete 
} from "@nestjs/common";
import { NewSeasonService } from "./NewSeasson.service";
import { CreateNewSeassonDto } from "./dto/Create.NewSeasson.dto";
import { UpdateNewSeassonDto } from "./dto/Update.NewSeasson.dto";

@Controller("new-season")
export class NewSeassonController {
  constructor(private readonly newSeasonService: NewSeasonService) {}

  // Bütün new season-ları gətir
  @Get()
  find() {
    return this.newSeasonService.find();
  }

  // ID-ə görə tək new season gətir
  @Get(":id")
  findById(@Param("id") id: number) {
    return this.newSeasonService.findById(id);
  }

  // Yeni season yarat
  @Post(":productId")
  create(
    @Body() params: CreateNewSeassonDto,
    @Param("productId") productId: number
  ) {
    return this.newSeasonService.create(params, productId);
  }

  // Mövcud season-u yenilə
  @Put(":id")
  update(
    @Param("id") id: number,
    @Body() params: UpdateNewSeassonDto
  ) {
    return this.newSeasonService.update(params, id);
  }

  // Mövcud season-u sil
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.newSeasonService.remove(id);
  }
}
