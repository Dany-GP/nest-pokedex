import { BadRequestException, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter
    ) {

  }

  async executeSeed() {

    const data = await this.http.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=650`)
    const pokemons: CreatePokemonDto[] = data.results.map(({name, url}) => ({
      name: name,
      no: +url.split('/')[6]
    }));

    // data.results.forEach( ({ name, url }) => {
    //   const segments = url.split('/');
    //   let pokemonDto = new CreatePokemonDto();
    //   pokemonDto.name = name;
    //   pokemonDto.no = +segments[6];
    //   //insertPromisesArray.push(this.pokemonService.create(pokemonDto));
    //   pokemons.push(pokemonDto);
    // });

    await this.pokemonService.insertMany(pokemons);

    return data.results;
  }
}
