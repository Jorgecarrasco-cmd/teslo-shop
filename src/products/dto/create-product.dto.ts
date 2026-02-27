import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsStrongPassword, MinLength } from "class-validator";

export class CreateProductDto {

    //opcionales
    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number
    //requeridas
    @IsString()
    @MinLength(1)
    title!: string;

    @IsString()
    @IsOptional()
    slug!: string

    @IsString({ each: true })
    @IsArray()
    sizes!: string[]

    @IsString({ each: true })
    @IsArray()
    tags!: string[]

    @IsIn(['men', 'women', 'unisex'])
    gender!: string;
}
