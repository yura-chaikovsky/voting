export default {
    getStorage() {
        return window.localStorage.questions? JSON.parse(window.localStorage.questions) : {};
    },
    getQuestions() {
        return Object.values(this.getStorage());
    },
    getQuestionById(id) {
        return this.getStorage()[id];
    },
    saveQuestion(question) {
        const storage = this.getStorage();
        if(!question.id){
            question.id = uuid();
        }
        question.pool.answers.forEach((answer, index) => {
            if(answer.body === ""){
                question.pool.answers.splice(index, 1);
            }
        });
        question = Object.assign({ results: [], voters: [] }, question);
        storage[question.id] = question;
        window.localStorage.questions = JSON.stringify(storage);
    },
    clearResults(questionId) {
        const question = this.getQuestionById(questionId);
        question.results = [];
        this.saveQuestion(question);
    },
    saveAnswer(questionId, answer) {
        const question = this.getQuestionById(questionId);
        let results = question.results.find(result => result.index === answer.answerId);
        if(!results) {
            results = {
                index: answer.answerId,
                votes: []
            };
            question.results.push(results);
        }

        results.votes.push({
            voterId: answer.id,
            time: answer.time
        });

        this.saveQuestion(question);
    }
}

