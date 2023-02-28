import { 
    Controller, 
    Get, 
    Post,
    Patch,
    Delete,
    UseGuards,
    Body,
    Param,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from '../auth/guard';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {}

    @Get()
    getBookmarks(@GetUser('id') userId: number) {
        return this.bookmarkService.getBookmarks(userId);
    }

    @Get(':id')
    getBookmarksById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number
    ) {
        return this.bookmarkService.getBookmarksById(userId, bookmarkId);
    }

    @Post()
    createBookmark(
        @Body() createBookmarkDto: CreateBookmarkDto,
        @GetUser('id') userId: number
    ) {
        return this.bookmarkService.createBookmark(userId, createBookmarkDto);
    }

    @Patch(':id')
    updateBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number,
        @Body() updateBookmarkDto: UpdateBookmarkDto
    ) {
        return this.bookmarkService.updateBookmarkById(userId, bookmarkId, updateBookmarkDto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number
    ) {
        return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
    }
}


