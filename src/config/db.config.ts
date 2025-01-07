import { envConfigService } from './env-config.service';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';

export const appDataSource = new DataSource({
    type: 'postgres',
    ...envConfigService.getTypeOrmConfig(),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrationsRun: false,
    migrationsTableName: 'migrations',
    migrations: [__dirname + '/../**/migrations/*{.ts,.js}'],
    namingStrategy: new SnakeNamingStrategy(),
})