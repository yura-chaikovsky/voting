import Config from "./../../../config";

class VotingServiceClass {

    constructor() {
        this.eventEmitter = document.createElement("div");
        this.voters = [];

        this.socket = new WebSocket(Config.apiHost);

        this.socket.addEventListener('open', event => {

        });

        this.socket.addEventListener('message', event => {
            ActionMachine(JSON.parse(event.data));
        });

        this.socket.addEventListener('error', event => {
            this.emitConnectionLost();
        });

        this.socket.addEventListener('close', event => {
            this.emitConnectionLost();
        });
    }

    _sendMessage(message){
        if(this.socket.readyState === WebSocket.OPEN){
            this.socket.send(JSON.stringify(message));
        }else{
            setTimeout(()=> {
                this._sendMessage(message);
            }, 200);
        }

    }

    emitConnectionLost() {
        this.eventEmitter.dispatchEvent(new CustomEvent("onConnectionLost"));
    }

    emitUpdateVotersList(list) {
        this.voters = list;
        this.eventEmitter.dispatchEvent(new CustomEvent("onListVoters", {detail: this.voters}));
    }

    registerHost() {
        this._sendMessage({action: "registerHost"});
    }

    registerVoter() {
        this._sendMessage({action: "registerVoter"});
    }

    askToShake() {
        this._sendMessage({action: "shakeIt"});
    }

    emitShakeIt(id) {
        this.eventEmitter.dispatchEvent(new CustomEvent("onShakeIt", {detail: id}));
    }

    startVoting(question) {
        this._sendMessage({action: "startVoting", id: question.id, pool: question.pool});
    }

    emitStartVoting(question) {
        this.eventEmitter.dispatchEvent(new CustomEvent("onStartVoting", {detail: question}));
    }

    registerVote(answer) {
        this._sendMessage({action: "registerVote", answerId: answer.id, time: answer.time});
    }

    emitRegisterVote(question) {
        this.eventEmitter.dispatchEvent(new CustomEvent("onVote", {detail: question}));
    }

    endVoting() {
        this._sendMessage({action: "endVoting"});
    }

    emitEndVoting(question) {
        this.eventEmitter.dispatchEvent(new CustomEvent("onEndVoting", {detail: question}));
    }
};

const ActionMachine = (function(){
    const actions = {
        listVoters(message) {
            VotingService.emitUpdateVotersList(message.voters);
        },

        shakeIt(message){
            VotingService.emitShakeIt(message.id);
        },

        startVoting(message){
            VotingService.emitStartVoting({id: message.id, pool: message.pool});
        },

        registerVote(message){
            VotingService.emitRegisterVote({id: message.id, answerId: message.answerId, time: message.time});
        },

        endVoting(){
            VotingService.emitEndVoting();
        }
    };

    return (message, ws) => actions[message.action]? actions[message.action](message, ws) : false;

})();


const VotingService = new VotingServiceClass();

export default VotingService;