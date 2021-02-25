import {Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveyRepository } from '../repositories/SurveyRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UserRepository } from '../repositories/UsersRepository';
import SendEmailService from '../Services/SendEmailService';
import { resolve} from 'path';


class SendMailController {
    async execute(request: Request,response: Response){
        const {email, survey_id} = request.body
        const usersRepository = getCustomRepository(UserRepository);
        const surveyRepository = getCustomRepository(SurveyRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({email});
        if(!user){
            return response.status(400).json({
                message: "O usuario nao existe"
            })
        }
        const survey = await surveyRepository.findOne({id: survey_id});
        if(!survey){
            return response.status(400).json({
                message: "A pesquisa nao existe",
            })
        }
        const variables ={
            name: user.name,
            title: survey.title,
            description: survey.description,
            link: process.env.URL_MAIL,
            user_id: user.id,
        };
        const npsPath = resolve(__dirname, "..", "views","emails", "npsMail.hbs");

        const surveyAlreadyExists =await surveysUsersRepository.findOne({
            where: [{user_id: user.id},{value: null}],
            relations: ["user","survey"],
        })
        if(surveyAlreadyExists){
            await SendEmailService.execute(email,survey.title,variables,npsPath);
            return response.status(200).json(surveyAlreadyExists);
        }
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id: survey.id,
        }); 
       
        await surveysUsersRepository.save(surveyUser);
        await SendEmailService.execute(email, survey.title,variables,npsPath)
        return response.status(200).json(surveyUser);

     

       
    }
    

}

export {SendMailController}