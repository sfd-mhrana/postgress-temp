import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilsService {

    async getHash(text: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(text, salt);
    }

    async isMatchHash(first: string, second: string): Promise<boolean> {
        return await bcrypt.compare(
            first,
            second,
        );
    }

}
