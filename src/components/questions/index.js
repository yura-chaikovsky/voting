import "./index.scss";
import S from "s-js";
import SView from "./index.tpl";
import {Page} from "ruth";
import Storage from "./../data/storage";


export const QuestionsPage = new Page(
    {
        pathname: /^\/vote\/questions$/,
        mountTo: "body",
        view: SView,

        events: {},

        init() {
            this.questions(Storage.getQuestions());
        }

    },
    {
        questions: S.data([])
    }
);
