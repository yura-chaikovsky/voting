<form class="question">
    <div class="question-name">
        <input type="hidden" value={::question.id() || >uuid()} name="id" />

        <input type="text" value={::question.pool().question} name="pool.question" placeholder="Type your question here" onChange={::save} />
        <div class="actions">
            <a class="results action-link" onClick={>navigate(`/vote/results/${::question.id()}`)}
                style={{display: ::question.results.length? "inline-block" : "none"}}>
                <svg class="icon" viewBox="0 0 384 384">
                    <path d="M348 196.8H186.4V34.4c0-4.8-3.2-8-8-8C80 26.4 0 106.4 0 204.8s80 177.6 178.4 177.6S356 302.4 356 204.8c0-4.8-3.2-8-8-8zM178.4 366.4c-89.6 0-162.4-72-162.4-161.6 0-86.4 68.8-157.6 154.4-161.6v161.6c0 4.8 3.2 8 8 8H340c-4 85.6-75.2 153.6-161.6 153.6z"/>
                    <path d="M205.6 1.6c-4.8 0-8 3.2-8 8v169.6c0 4.8 4 8 8 8H376c4.8 0 8-3.2 8-8C384 80.8 304 1.6 205.6 1.6zm8 169.6V17.6c83.2 4 149.6 70.4 154.4 153.6H213.6z"/>
                </svg>
            </a>
            <a class="start-voting action-link" onClick={>navigate(`/vote/voting/${::question.id()}`)}>
                <svg class="icon" viewBox="0 0 60 60">
                    <path d="M45.563 29.174l-22-15c-.307-.208-.703-.231-1.031-.058-.327.173-.532.513-.532.884v30c0 .371.205.711.533.884.146.078.307.116.467.116.197 0 .394-.059.563-.174l22-15c.273-.186.437-.495.437-.826s-.164-.64-.437-.826zM24 43.107V16.893L43.225 30 24 43.107z"/>
                    <path d="M30 0C13.458 0 0 13.458 0 30s13.458 30 30 30 30-13.458 30-30S46.542 0 30 0zm0 58C14.561 58 2 45.439 2 30S14.561 2 30 2s28 12.561 28 28-12.561 28-28 28z"/>
                </svg>
            </a>
        </div>
    </div>
    <div class="options">
        <ol class="options-list">
            {::question.pool().answers.map((answer, index) =>
            <li class="option">
                <input type="hidden" value={answer.id} name={`pool.answers[${index}].id`} placeholder="Type answer here"/>
                <input type="text" value={answer.body} name={`pool.answers[${index}].body`} onChange={::save} placeholder="Type answer here"/>
            </li>
            )}
            <li className="option">
                <input type="hidden" name={`pool.answers[${::question.pool().answers.length}].id`} value={::question.pool().answers.length} placeholder="Type answer here"/>
                <input type="text" name={`pool.answers[${::question.pool().answers.length}].body`} value="" onChange={::save} placeholder="Type answer here" autofocus />
            </li>
        </ol>

        <div>
            <span class="music-icon">
                <svg class="icon" viewBox="0 0 55 55">
                    <path d="M52.66.249c-.216-.189-.501-.275-.789-.241l-31 4.011c-.498.065-.871.488-.871.991v35.613C18.174 38.428 15.273 37 12 37c-5.514 0-10 4.037-10 9s4.486 9 10 9 10-4.037 10-9c0-.232-.019-.46-.039-.687.013-.065.039-.124.039-.192V16.118l29-3.753v18.257C49.174 28.428 46.273 27 43 27c-5.514 0-10 4.037-10 9s4.486 9 10 9c5.464 0 9.913-3.966 9.993-8.867 0-.013.007-.024.007-.037V1c0-.288-.124-.562-.34-.751zM12 53c-4.411 0-8-3.141-8-7s3.589-7 8-7 8 3.141 8 7-3.589 7-8 7zm31-10c-4.411 0-8-3.141-8-7s3.589-7 8-7 8 3.141 8 7-3.589 7-8 7zM22 14.101V5.889l29-3.752v8.211l-29 3.753z"/>
                </svg>
            </span>
            <select name="pool.audio" value={::question.pool().audio} onChange={::save}>
                <option value="-1" >Random</option>
            {::tracks.map((track, index) =>
                <option value={index} >{track.title}</option>
            )}
            </select>
        </div>
    </div>
</form>