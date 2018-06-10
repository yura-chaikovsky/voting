import "./index.scss";
import S from "s-js";
import {Page} from "ruth";
import SView from "./index.tpl";
import VotingService from "./../data/voting";
import ShakeEvent from "./shake";

export const BallotPage = new Page(
    {
        pathname: /^\/vote\/?$/,
        mountTo: "body",
        view: SView,

        events: {

        },

        init() {

            VotingService.eventEmitter.addEventListener("onConnectionLost", event => {
                this.isConnected(false);
            });
            VotingService.eventEmitter.addEventListener("onStartVoting", event => {
                this.answered(false);
                this.startVotingTime = new Date();
                this.question(event.detail)
            });
            VotingService.eventEmitter.addEventListener("onEndVoting", event => {
                this.question(false);
            });
            VotingService.registerVoter();

            window.addEventListener('shake', event => {
                this.shake()
            });

        }

    },

    {
        isConnected: S.data(true),

        question: S.data(false),

        answered: S.data(false),

        refresh() {
            window.location.reload();
        },

        shake() {
            if(window.navigator.vibrate) {
                window.navigator.vibrate([100, 50, 100, 50, 100]);
            }
            VotingService.askToShake();
        },

        answer(id) {
            VotingService.registerVote({id: id, time: (new Date() - this.startVotingTime)});
            this.answered(true);
        }
    }
);