require('dotenv').config();

class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }
  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }
  public getPort() {
    return this.getValue('PORT', true);
  }
  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getOrigins() {
    try {
      return this.getValue('ALLOW_ORIGINS').split(',').map(origin => origin.trim())
    } catch (e: any) {
      return [];
    }
  }

  public getTypeOrmConfig() {
    return {
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      ssl: this.isProduction(),
      synchronize: Boolean(this.getValue('POSTGRES_SUNCHRONIZE')),
    };
  }

}

const envConfigService = new ConfigService(process.env)
  .ensureValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE',
    'POSTGRES_SUNCHRONIZE',
    'ALLOW_ORIGINS',
    'MODE'
  ]);

export { envConfigService };