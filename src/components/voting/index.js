import "./index.scss";
import S from "s-js";
import SView from "./index.tpl";
import {Page, Routing} from "ruth";
import Storage from "./../data/storage";
import VotingService from "../data/voting";
import AudioService from "../data/audio";

export const VotingPage = new Page(
    {
        pathname: /^\/vote\/voting\/(.+)$/,
        mountTo: "body",
        view: SView,

        events: {},

        init() {
            VotingService.registerHost();

            this.question = Storage.getQuestionById(this.$options.routeMatches[1]);
            Storage.clearResults(this.question.id);

            this.votersList = S.data(VotingService.voters);
            this.results = S.data([]);

            VotingService.eventEmitter.addEventListener("onListVoters", this.updateVotersList);

            VotingService.eventEmitter.addEventListener("onVote", this.saveAnswer);

            VotingService.startVoting(this.question);

            const trackId = this.question.pool.audio == -1? Math.floor(AudioService.tracks.length * Math.random()) : this.question.pool.audio;
            const track = AudioService.play(trackId);
            this.timeLeft(track.peak / 1000 | 0);

            this.countDownInterval = setInterval(()=>{
                if(this.timeLeft() > 0){
                    this.timeLeft(this.timeLeft() - 1);
                }else{
                    clearInterval(this.countDownInterval);
                }
            }, 1000);

            this.endVotingTimeout = setTimeout(()=>{
                VotingService.endVoting();
                Routing.navigate(`/vote/results/${this.question.id}`);
            }, track.peak)
        },

        unmount() {
            VotingService.eventEmitter.removeEventListener("onListVoters", this.updateVotersList);
            VotingService.eventEmitter.removeEventListener("onVote", this.saveAnswer);

            clearTimeout(this.endVotingTimeout);
            clearInterval(this.countDownInterval);
        }
    },
    {
        results: S.data([]),

        timeLeft: S.data(0),

        updateVotersList(event) {
            this.votersList(event.detail);
        },

        saveAnswer(event) {
            Storage.saveAnswer(this.question.id, event.detail);
            const question = Storage.getQuestionById(this.$options.routeMatches[1]);
            this.results(question.results);
            console.log(this.results());
        },

        hasVoted(results, voterId){
            console.log("hasVoted: ", voterId, results);
            return results.some(result => result.votes.some(vote => vote.voterId == voterId));
        }
    });
