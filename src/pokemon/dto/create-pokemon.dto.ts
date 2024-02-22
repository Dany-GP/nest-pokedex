import { IsInt, IsNumberString, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    @IsInt()
    @IsPositive()
    @Min(0)
    no: number;

    @IsString()
    @MinLength(1)
    name: string;
}
