import supertest from "supertest";
// import server from "../server/server"
describe("test", ()=> {
    describe('test route', () => {
        describe(`doesn't exist`, () => {
            it("should return 404", () => {
                expect(true).toBe(true)
            })
        })
    })
} )