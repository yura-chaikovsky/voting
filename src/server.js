const ENV = {
    host: "192.168.0.101",
    port: 1337,
    path: "/vote"
};

const WebSocket = require('./../build/node_modules/ws');

const wsServer = new WebSocket.Server(Object.assign({
    clientTracking: true,
    perMessageDeflate: false,
    maxPayload: 400 * 1024 * 1024 /* bytes*/
}, ENV));

wsServer.broadcast = function broadcast(data) {
    wsServer.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wsServer.on('connection', (ws, reqest) => {
    const client = {id: uuid(), ua: reqest.headers["user-agent"], ws};
    ActionMachine({action: "addVoter", client}, ws);

    ws.addEventListener("message", message => {
        ActionMachine(Object.assign(JSON.parse(message.data), {client}), ws);
    });

    ws.addEventListener("close", (code, reason) => {
        ActionMachine({action: "removeVoter", client}, ws);
    });
});


const ActionMachine = (function(){
    const Voters = [];
    let Host;

    const _sendToHost= function(message) {
        Host && Host.readyState === WebSocket.OPEN && Host.send(JSON.stringify(message));
    };
    const _sendToVoters= function(message) {
        Voters.forEach(voter => {
            voter.ws.send(JSON.stringify(message));
        });
    };

    const actions = {

        addVoter(message) {
            Voters.push(message.client);
            this.listVoters();
        },

        removeVoter(message) {
            const index = Voters.indexOf(message.client);
            index > -1 && Voters.splice(index, 1);
            this.listVoters();
        },

        listVoters() {
            const voters = Voters.map(voter => ({"id": voter.id, "ua": voter.ua}));
            _sendToHost({action: "listVoters", voters: voters});
        },

        shakeIt(message) {
            _sendToHost({action: "shakeIt", id: message.client.id});
        },

        registerHost(message, ws) {
            Host = ws;
            this.removeVoter(message);
        },

        startVoting(message) {
            _sendToVoters({ action: "startVoting", id: message.id, pool: message.pool });
        },

        registerVote(message, ws) {
            const voter = Voters.find(voter => voter.ws === ws);
            if(voter) {
                _sendToHost({action: "registerVote", id: voter.id, answerId: message.answerId, time: message.time});
            }
        },

        endVoting() {
            _sendToVoters({ action: "endVoting" });
        }

    };

    return (message, ws) => actions[message.action]? actions[message.action](message, ws) : false;

})();

function uuid(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}


console.log(`Server listening on ${ENV.host}:${ENV.port}`);
