import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UsersRepository';
class UserController {

    async create(request: Request, response: Response){
        const {name, email} = request.body;
        
        const usersRepository = getCustomRepository(UserRepository);

        const userAlreadyExists = await usersRepository.findOne({"email": email});
        
        if(userAlreadyExists){
            return response.status(400).json({
                message: "Usuario ja existe!"
            })
        }
        const user =  usersRepository.create({
            name, email
        })
        await usersRepository.save(user);

        return response.status(201).json(user);
    }
}
export { UserController };
