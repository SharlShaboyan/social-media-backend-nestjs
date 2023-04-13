import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type : 'postgres',
    host : '127.0.0.1',
    port : 5432,
    username : 'postgres',
    password : 'root',
    database : 'nest',
    synchronize: true,
    logging: true,
    entities: ["dist/**/*.entity{.ts,.js}"],
    subscribers: [],
    migrations: [],
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })