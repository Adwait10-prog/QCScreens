document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('upload1').addEventListener('change', handleVideoUpload);
    document.getElementById('upload2').addEventListener('change', handleVideoUpload);
    document.getElementById('startButton').addEventListener('click', startAlternatingVideos);
    document.getElementById('commentButton').addEventListener('click', addComment);
    document.getElementById('downloadCommentsButton').addEventListener('click', downloadComments);

    let video1 = document.getElementById('video1');
    let video2 = document.getElementById('video2');
    let activeVideo = video1; // Start with video1 as the active video
    let interval;
    let comments = [];

    function handleVideoUpload(event) {
        let file = event.target.files[0];
        let url = URL.createObjectURL(file);
        
        if (event.target.id === 'upload1') {
            video1.src = url;
            video1.load();
        } else if (event.target.id === 'upload2') {
            video2.src = url;
            video2.load();
        }
    }

    function startAlternatingVideos() {
        video1.currentTime = 0;
        video2.currentTime = 0;
        video1.play();
        
        interval = parseInt(document.getElementById('intervalInput').value) * 1000;
        setTimeout(alternateVideos, interval);
    }

    function alternateVideos() {
        if (!video1.paused) {
            video1.pause();
            
            // Add a delay of 1 second before starting the target video
            setTimeout(() => {
                video2.play();
                activeVideo = video2;
                
                if (video2.currentTime < video2.duration) {
                    setTimeout(alternateVideos, interval);
                }
            }, 1000); // 1000 ms = 1 second
        } else {
            video2.pause();
            
            // Add a delay of 1 second before starting the source video
            setTimeout(() => {
                video1.play();
                activeVideo = video1;
                
                if (video1.currentTime < video1.duration) {
                    setTimeout(alternateVideos, interval);
                }
            }, 1000); // 1000 ms = 1 second
        }
    }

    function addComment() {
        let commentInput = document.getElementById('commentInput');
        let commentList = document.getElementById('commentList');
        
        let commentText = commentInput.value;
        if (commentText.trim() !== '') {
            let currentTime = video2.currentTime;
            comments.push({ comment: commentText, timestamp: currentTime });

            let li = document.createElement('li');
            li.textContent = `${commentText} (Timestamp: ${formatTime(currentTime)})`;
            li.dataset.timestamp = currentTime;
            li.addEventListener('click', function() {
                seekToTimestamp(this.dataset.timestamp);
            });
            commentList.appendChild(li);
            commentInput.value = '';
        }
    }

    function seekToTimestamp(timestamp) {
        let time = parseFloat(timestamp);
        video2.currentTime = time;
        video2.play();
    }

    function formatTime(seconds) {
        let date = new Date(0);
        date.setSeconds(seconds);
        return date.toISOString().substr(11, 8);
    }

    function downloadComments() {
        let commentText = comments.map(c => `${c.comment} (Timestamp: ${formatTime(c.timestamp)})`).join('\n');
        let blob = new Blob([commentText], { type: 'text/plain' });
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'comments.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
