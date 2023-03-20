const fs = require('fs')
const youtubedl = require('youtube-dl-exec')

function youtube2mp3(youtubeURL) {
    youtubedl(youtubeURL, {
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        extractAudio: true,
        o: './audio/%(id)s.%(ext)s',
        audioFormat: 'mp3',
        ffmpegLocation: './tools/',
        addHeader: [
            'referer:youtube.com',
            'user-agent:googlebot'
        ]
    });
}

// Test for Debugging
//youtube2mp3('https://www.youtube.com/watch?v=DWaB4PXCwFU');

module.exports = { youtube2mp3 };