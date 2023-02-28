import {
    IsNotEmpty, 
    IsString,
    IsOptional,
    IsUrl,
} from 'class-validator';

export class CreateBookmarkDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsUrl()
    link: string;
}