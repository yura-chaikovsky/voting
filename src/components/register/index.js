import "./index.scss";
import {Page} from "ruth";
import SView from "./index.tpl";
import QRCode from "./qrcode";
import VotingService from "./../data/voting";
import S from "s-js";
import AudioService from "../data/audio";

export const RegisterPage = new Page(
    {
        pathname: /^\/vote\/register$/,
        mountTo: "body",
        view: SView,

        events: {

        },

        init() {
            VotingService.eventEmitter.addEventListener("onListVoters", event => {
                this.votersList(event.detail)
            });
            VotingService.eventEmitter.addEventListener("onShakeIt", event => {
                this.shakeIt(event.detail)
            });

            VotingService.registerHost();
            VotingService.endVoting();
            AudioService.stop();
        },

        mount() {
            this.$dom.querySelector(".qrcode").innerHTML = "";
            const qrcode = new QRCode(this.$dom.querySelector(".qrcode"));
            qrcode.makeCode("telenor.team/vote");
        },

        unmount() {
            VotingService.eventEmitter.removeEventListener("onListVoters", this.updateVotersList);
            VotingService.eventEmitter.removeEventListener("onShakeIt", this.saveAnswer);
        }

    },

    {
        votersList: S.data([]),

        shakeIt(id){
            var ball = this.$dom.querySelector(`[data-id="${id}"]`);

            if(!ball || ball.classList.contains("shake")){
                return;
            }
            ball.classList.add("shake");

            setTimeout(() => {
                ball.classList.remove("shake");
            }, 1000)
        }
    }
);