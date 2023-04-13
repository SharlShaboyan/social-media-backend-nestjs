import { TypeOrmModuleOptions } from "@nestjs/typeorm";
const DB_PORT = Number(process.env.APP_PORT)

const config: TypeOrmModuleOptions = {
    type : 'postgres',
    host : process.env.DB_HOST,
    port : DB_PORT,
    username : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    entities: ["dist/**/*.entity{.ts,.js}"],
    autoLoadEntities : true,
    synchronize : true
};

export default config