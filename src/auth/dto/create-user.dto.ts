import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class createUserDto {

    @IsString()
    @IsEmail()
    email!: string

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    }
    )
    @ApiProperty({})
    password!: string
    
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    fullName!: string

}