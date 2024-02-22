import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { error } from 'console';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {

  }

  async create(createPokemonDto: CreatePokemonDto) {
    console.log(createPokemonDto);

    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    }
    catch (ex) {
      switch (ex.code) {
        case 11000:
          throw new BadRequestException(`Elemento existente de db: ${JSON.stringify(ex.keyValue)}`);
          break;

        default:
          break;
      }
      throw new InternalServerErrorException();
    }



  }

  async findAll() {
    return await this.pokemonModel.find();
  }

  async findOne(id: string) {

    let pokemon: Pokemon;

    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ no: id });
    }
    else if (isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    } else {
      pokemon = await this.pokemonModel.findOne({ name: id });
    }

    if (!pokemon) {
      throw new NotFoundException();
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      pokemon.name = updatePokemonDto.name;
    }

    // if (updatePokemonDto.no) {
    //   pokemon.no = updatePokemonDto.no;
    // }

    try {

      await pokemon.updateOne(updatePokemonDto, { new: true });

    }
    catch (ex) {
      switch (ex.code) {
        case 11000:
          throw new BadRequestException(`Elemento existente de db: ${JSON.stringify(ex.keyValue)}`);
          break;

        default:
          break;
      }
      throw new InternalServerErrorException();
    }



    return pokemon;
  }

  async remove(id: string) {

    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount === 0){
      throw new NotFoundException();
    }
    return deletedCount;
  }
}
