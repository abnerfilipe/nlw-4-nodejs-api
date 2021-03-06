import { response } from 'express';
import request from 'supertest';
import { app } from '../app';
import createConnection from '../database'


describe('Surveys', () => {
    beforeAll(async ()=> {
        const connection = await createConnection();
        await connection.dropDatabase();
        await connection.runMigrations();
    });
    it("Should be able to create a new survey",async()=>{
        const response = await request(app).post("/surveys").send({title: "title example",description: "discription example"});
        expect(response.status).toBe(201);
    });
    it("Should be able to get all surveys", async() => {
        await request(app).post("/surveys").send({title: "title example 2",description: "discription example 2"});

        const response = await request(app).get("/surveys");
        expect(response.body.length).toBe(2);
    })
});