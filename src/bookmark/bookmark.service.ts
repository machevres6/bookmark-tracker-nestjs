import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) {}

    getBookmarks(userId: number) {
        return this.prisma.bookmark.findMany({
            where: { userId }
        });
    }

    getBookmarksById(userId: number, bookmarkId: number) {
        const bookmark = this.prisma.bookmark.findFirst({
            where: { 
                id: bookmarkId,
                userId 
            }
        })

        if (!bookmark) {
            throw new Error('Bookmark not found')
        }

        return bookmark;
    }

    async createBookmark(userId: number, createBookmarkDto: CreateBookmarkDto) {
        const bookmark = await this.prisma.bookmark.create({
            data: {
                userId,
                ...createBookmarkDto
            }
        })

        return bookmark;
    }

    async updateBookmarkById(userId: number, bookmarkId: number, updateBookmarkDto: UpdateBookmarkDto) {
        // get bookmark by id
        const bookmark = await this.prisma.bookmark.findUnique({
            where: { id: bookmarkId }
        })

        // check if bookmark is owned by user
        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('You are not allowed to update this bookmark')
        }

        return this.prisma.bookmark.update({
            where: { id: bookmarkId },
            data: {
                ...updateBookmarkDto
            }
        });
    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        // get bookmark by id
        const bookmark = await this.prisma.bookmark.findUnique({
            where: { id: bookmarkId }
        })

        // check if bookmark is owned by user
        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('You are not allowed to delete this bookmark')
        }

        await this.prisma.bookmark.delete({
            where: { id: bookmarkId }
        })
    }
}
