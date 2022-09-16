import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Teste do modulo Tarefa (e2e)', () => {
  let app: INestApplication;

  let tarefaId: number

  beforeAll(async() => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '%ESSI2022kelly',
          database: 'db_todolist_test',
          autoLoadEntities: true,
          synchronize: true,
          logging: false,
          dropSchema: true
        }),
        AppModule
      ],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Testes-exemplo feitos em aula copiado linha por linha e (a fazer) comentados
  //teste para inserir uma tabela no banco
  it('01 - Deve inserir uma tabela no banco', async () =>  {
    let response = await request(app.getHttpServer())
      .post('/tarefa')
      .send({
        nome: 'Mercado',
        descricao: 'Compras da semana',
        responsavel: 'Wesley',
        data: '2022-09-15',
        status: true
      })
    .expect(201)

    tarefaId = response.body.id
  })

// Teste para verificar se conseguimos recuperar uma tarefa em específico
it('02 - Deve recuperar uma tarefa específica', async () => {
  return request(app.getHttpServer())
  .get(`/tarefa/${tarefaId}`)
  .expect(200)
})

// Teste para verificar se conseguimos atualizar uma tarefa
it('03 - Deve atualizar uma tarefa', async () => {
  return request(app.getHttpServer())
  .put('/tarefa')
  .send({
    id: 1,
    nome: 'Mercado - concluído',
    descricao: 'Próxima semana',
    responsavel: 'Wesley',
    data: '2022-09-15',
    status: false
  })
  .expect(200)
  .then(response => {
    expect('Mercado - concluído').toEqual(response.body.nome)
  })
})

// Teste para ver se ele valida uma atualização de uma tarefa que não existe
it('04 - Não deverá atualizar uma tabela que não existe', async () => {
  return request(app.getHttpServer())
  .put('/tarefa')
  .send({
    id: 10000,
    nome: 'Mercado - concluído',
    descricao: 'Próxima semana',
    responsavel: 'Wesley',
    data: '2022-09-15',
    status: false
  })
  .expect(404)
})

//Teste para verificar se conseguimos deletar uma tarefa
it('05 - Deve deletar uma tarefa do banco', async () => {
  return request(app.getHttpServer())
  .delete(`/tarefa/${tarefaId}`)
  .expect(204)
})

//Parar execução dos testes
afterAll(async () => {
  await app.close()
}) 

});











  //   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });
// });
