import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      //exclude: ['/api/(.*)'],
      exclude: ['/(.*)'],
    }),

    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest-pokemon'),

    PokemonModule,

    CommonModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
