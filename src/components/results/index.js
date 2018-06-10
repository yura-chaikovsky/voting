import "./index.scss";
import S from  "s-js";
import SView from  "./index.tpl";
import {Page} from "ruth";
import ResultChart from "./chart";
import Storage from "../data/storage";

export const QuestionsPage = new Page(
    {
        pathname: /^\/vote\/results\/(.+)$/,
        mountTo: "body",
        view: SView,

        events: {

        },

        init() {
            this.open(null);

            this.question = Storage.getQuestionById(this.$options.routeMatches[1]);

            const previewData = this.question.pool.answers.map(answer => ({
                label: answer.body,
                value: 1
            }));

            const data = this.question.pool.answers.map(answer => ({
                label: answer.body,
                value: this.question.results.reduce((value, result) => value + (result.index == answer.id ? result.votes.length : 0), 0)
            }));

            ResultChart.setData([]);
            ResultChart.setData(previewData);

            setTimeout(() => {
                ResultChart.setData(data);
            }, 2000);

            requestAnimationFrame(() => {
                this.open("open");
            });
        }
    },
    {
        chart: () => ResultChart.dom(),
        open: S.data(null)
    });
