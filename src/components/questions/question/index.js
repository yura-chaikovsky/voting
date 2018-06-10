import S from "s-js";
import SView from "./index.tpl";
import {Directive, Form} from "ruth";
import Storage from "./../../data/storage";
import AudioService from "./../../data/audio";

export const QuestionDirective = new Directive(
    {
        name: "Question",
        view: SView,
        events: {},
        init() {
            let emptyQuestion = {pool: {question: "", answers: [], audio: -1}, voters: [], results: []};

            this.question = this.questionId === null ? emptyQuestion : Storage.getQuestionById(this.questionId);

            this.question.id = S.data(this.question.id);
            this.question.pool = S.data(this.question.pool);
        }
    },
    {
        tracks: AudioService.tracks,

        save() {
            const question = Form.serialize(this.$dom);

            Storage.saveQuestion(question);

            this.question.id(question.id);
            this.question.pool(question.pool);
        }
    }
);
