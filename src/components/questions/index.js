import "./index.scss";
import S from "s-js";
import SView from "./index.tpl";
import {Page} from "ruth";
import Storage from "./../data/storage";
import AudioService from "../data/audio";
import VotingService from "../data/voting";


export const QuestionsPage = new Page(
    {
        pathname: /^\/vote\/questions$/,
        mountTo: "body",
        view: SView,

        events: {},

        init() {
            VotingService.endVoting();
            AudioService.stop();

            this.questions(Storage.getQuestions());
        }

    },
    {
        questions: S.data([])
    }
);
