import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  try{
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe())
    app.use(cors())
    await app.listen(3005);
    
    process.stdout.write(`Listening on port ${3005}`);
  } catch(e) {
    console.log(e)
  }
  
}
bootstrap();


