import { User } from 'src/modules/user/user.entity';
import { DataSource } from 'typeorm';
import { UtilsService } from 'src/shared/modules/utils/utils.service';

export async function seedUserData(
    dataSource: DataSource,
    utilsService: UtilsService,
): Promise<void> {
    const hashedPassword = await utilsService.getHash('User123123@');
    await dataSource.query('TRUNCATE "user" RESTART IDENTITY;');
    const repository = dataSource.getRepository(User);
    await repository.insert({
        name: 'MD HOSSEN RANA',
        email: 'sfd.mhrana@gmail.com',
        password: hashedPassword,
    });
}