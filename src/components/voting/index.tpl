<section class="voting-page">
    <div class="page-grid">
        <div class="question">
            {::question.pool.question}
        </div>

        <div class="options">
            {::question.pool.answers.map(answer =>
                <div>{answer.body}</div>
            )}
        </div>

        <div class="countdown">
            {::timeLeft()}
        </div>

        <div class="voters">
            {::votersList().map(voter =>
                <div data-id={voter.id}
                     class={"voter " + (::hasVoted(::results(), voter.id)? "voted" : "")}
                     style={{animationDelay: (Math.random()*1992 | 0) + "ms"}}></div>
            )}
        </div>

        <div class="loading" style={{display: "none"}}>
            Preparing...
        </div>

    </div>
</section>