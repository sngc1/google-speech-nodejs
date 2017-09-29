/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This application demonstrates how to perform basic recognize operations with
 * with the Google Cloud Speech API.
 *
 * For more information, see the README.md under /speech and the documentation
 * at https://cloud.google.com/speech/docs.
 */

'use strict';

function streamingMicRecognize () {
  // [START speech_streaming_mic_recognize]
  const record = require('node-record-lpcm16');

  // Imports the Google Cloud client library
  const Speech = require('@google-cloud/speech');

  // Instantiates a client
  const speech = Speech();

  // The encoding of the audio file, e.g. 'LINEAR16'
  const encoding = 'LINEAR16';

  // The sample rate of the audio file in hertz, e.g. 16000
  const sampleRateHertz = 16000;

  // The BCP-47 language code to use, e.g. 'en-US'
  const languageCode = 'ja-JP';

  const request = {
    config: {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
      speechContexts: [
        {
          phrases: [ "" ]
        }
      ],
    },
    interimResults: true // If you want interim results, set this to true
  };

  // Create a recognize stream
  const recognizeStream = speech.streamingRecognize(request)
    .on('error', console.error)
    .on('data', (data) => {
      let finalResult = ""
      if(data.results[0].isFinal) {
         finalResult = "[final result]";
      }
        process.stdout.write(
          (data.results[0] && data.results[0].alternatives[0])
            ? `Transcription: ${finalResult} ${data.results[0].alternatives[0].transcript}\n`
            : `\n\nReached transcription time limit, press Ctrl+C\n`)
    });
  // Start recording and send the microphone input to the Speech API
  record
    .start({
      sampleRateHertz: sampleRateHertz,
      threshold: 0,
      // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
      verbose: false,
      recordProgram: 'rec', // Try also "arecord" or "sox"
      silence: '10.0'
    })
    .on('error', console.error)
    .pipe(recognizeStream);

  console.log('Listening, press Ctrl+C to stop.');
  // [END speech_streaming_mic_recognize]
}



if (module === require.main) {
  streamingMicRecognize()
}
