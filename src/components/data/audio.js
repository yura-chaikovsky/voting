import Config from "./../../../config";

let  audio;

export default (function() {

    const tracks = [
        { duration: 24555, peak: 16000, title: "Rock burst", path: "rockburst.mp3" },
        { duration: 25494, peak: 17000, title: "Fashion", path: "fashion.mp3" },
        { duration: 21242, peak: 17200, title: "Looking on waves", path: "waves.mp3" },
        { duration: 24007, peak: 17250, title: "Jazzy night", path: "jazzy-night.mp3" },
        { duration: 23590, peak: 18400, title: "Headline", path: "headline.mp3" },
        { duration: 25050, peak: 20250, title: "Fall in love", path: "inlove.mp3" },
        { duration: 25462, peak: 20600, title: "Madcap", path: "madcap.mp3" },
        { duration: 25311, peak: 21000, title: "Hardly working", path: "hardly-working.mp3" },
        { duration: 31023, peak: 26400, title: "Happy days", path: "happy-days.mp3" }
    ];

    tracks.forEach(track => {
        track.audioObject = new Audio();
        track.audioObject.preload = "auto";
        track.audioObject.src = Config.mediaHost + track.path;
    });

    return {

        tracks,

        play(trackIndex) {
            this.stop();

            audio = tracks[trackIndex].audioObject;
            audio.play();
            return this.tracks[trackIndex];
        },

        stop() {
            if(!audio) return;

            audio.pause();
            audio = null;
        }
    }
})();