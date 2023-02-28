import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, UpdateBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = 
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe(
        { whitelist: true }
      )
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  })

  describe('Auth', () => {

    const dto: AuthDto = {
      email: 'miguel_test@gmail.com',
      password: '123456'
    }

    describe('Signup', () => {
      it('Should throw if empty email', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: '',
            password: dto.password
          })
          .expectStatus(400)
      })

      it('Should throw if invalid email', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: 'miguel_test',
            password: dto.password
          })
          .expectStatus(400)
      })

      it('Should throw if empty password', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            password: ''
          })
          .expectStatus(400)
      })

      it('Should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400)
      })

      it('Should Sign-Up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
      });

      it('Should throw if email already exists', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403)
      });
    });

    describe('Signin', () => {

      it('Should throw if empty email', () => {
        return pactum
          .spec()
          .post('/auth/singin')
          .withBody({
            email: '',
            password: dto.password
          })
          .expectStatus(404)
      })

      it('Should throw if invalid email', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'miguel_test',
            password: dto.password
          })
          .expectStatus(400)
      })

      it('Should throw if empty password', () => {
        return pactum
          .spec()
          .post('/auth/sigin')
          .withBody({
            email: dto.email,
            password: ''
          })
          .expectStatus(404)
      })

      it('Should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400)
      })

      it('Should Sign-In', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get Me', () => {
      it('Should return current user', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: `Bearer $S{userAt}`
          })
          .get('/users/me')
          .expectStatus(200)
      });

      it('Should throw if no token provided', () => {
        return pactum
          .spec()
          .get('/users/me')
          .expectStatus(401)
      });
    });

    describe('Edit User', () => {
      it('Should Edit User', () => {
        const dto: EditUserDto = {
          firstName: 'Miguel',
          lastName: 'El Mejor De todo Los Tiempos',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: `Bearer $S{userAt}`
          })
          .patch('/users')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName)
          .inspect();
      });

      it('Should throw if no token provided', () => {
        return pactum
          .spec()
          .patch('/users')
          .expectStatus(401)
      });
    }); 
  });

  describe('Bookmark', () => {
    describe('Get Empty Bookmarks', () => {
      it('Should return empty ', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: `Bearer $S{userAt}`
          })
          .get('/bookmarks')
          .expectStatus(200)
          .expectBody([])
          .expectBodyContains('[]')
      })
    });

    describe('Create Bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'This is our first bookmark',
        description: 'First bookmark description',
        link: 'https://www.google.com'
      }
      it('Should return empty ', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: `Bearer $S{userAt}`
          })
          .post('/bookmarks')
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .expectBodyContains(dto.link)
          .stores('bookmarkId', 'id')
      })
    });

    describe('Get Bookmarks', () => {
      it('Should return empty ', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: `Bearer $S{userAt}`
          })
          .get('/bookmarks')
          .expectStatus(200)
          .expectJsonLength(1)
      });
    });

    describe('Get Bookmarks by ID', () => {
      it('Should return empty ', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: `Bearer $S{userAt}`
          })
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
      });
    });

    describe('Edit Bookmark by ID', () => {
      const dto: UpdateBookmarkDto = {
        title: 'this is our first edit',
        link: 'https://www.youtube.com'
      }
      it('Should update bookmark', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: `Bearer $S{userAt}`
          })
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link)
      });
    });

    describe('Delete Bookmark by ID', () => {
      it('Should delete bookmark', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: `Bearer $S{userAt}`
          })
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(204)
      });

      it('Should return empty', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: `Bearer $S{userAt}`
          })
          .get('/bookmarks')
          .expectStatus(200)
          .expectJsonLength(0)
      })
    });
  });
})