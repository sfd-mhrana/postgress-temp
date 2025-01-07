import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { NestFactory } from '@nestjs/core';
import { seedUserData } from './user.seed';
import { UtilsService } from 'src/shared/modules/utils/utils.service';

async function runSeeder() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const utilsService = app.get(UtilsService);
  await seedUserData(dataSource, utilsService);
  await app.close();
}
runSeeder();