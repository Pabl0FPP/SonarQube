import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {

    createTypeOrmOptions(): TypeOrmModuleOptions {
        const isTestEnv = process.env.NODE_ENV === 'test';

        if (isTestEnv) {
            // Configuración para pruebas (SQLite en memoria)
            return {
                type: 'sqlite',
                database: ':memory:',
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true, // Solo para pruebas
            };
        }

        // Configuración para desarrollo/producción
        return {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +(process.env.DB_PORT || 5432),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            synchronize: process.env.NODE_ENV === 'development', // Solo en desarrollo
            autoLoadEntities: true,
            ssl: process.env.SSL_MODE === 'require',
        };
    }
}