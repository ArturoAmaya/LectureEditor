import React, {useState} from "react";
import axios from "axios"
import {classnames} from "../utils/general";
/*
nterface VoiceSettings {
  stability: number;
  similarity_boost: number;
}

interface AudioStreamProps {
  voiceId: string;
  text: string;
  apiKey: string;
  voiceSettings: VoiceSettings;
}*/
const AudioStream2 = ({voiceId, text, apiKey, voiceSettings, count}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    let safe_text = '';

    const startStreaming = async () => {
        setLoading(true);
        setError("");

        const baseUrl = "https://api.elevenlabs.io/v1/text-to-speech"
        const headers = {
            'Content-Type':'application/json',
            'xi-api-key': apiKey,
        }

        safe_text = text.slice(0).replaceAll(/{.*}/g, '').replaceAll(/\[.*\]/g,'').replaceAll(/\(.*\)/g, '');
        const requestBody = {
            text: safe_text,
            voice_settings: voiceSettings,
          };
        try{
            const response = await axios.post(`${baseUrl}/${voiceId}`, requestBody, {
                headers,
                responseType: 'blob',
            });
            console.log(response)
            let true_count = count - 1
            if (response.status === 200){
                console.log('sucka')
                const audio = new Audio(URL.createObjectURL(response.data));
                console.log(audio)
                audio.play();
                console.log('huh')
                const url = '/lecture-editor/lecture-editor/audio_upload'
                const config_audio = {
                    method: "POST",
                    url: url,
                    headers: {
                        'content-type': 'multipart/form-data'
                    },
                    data: {
                        "audio": response.data,
                    },
                    params: { // apparently params is the way to put query params in there not query or in body
                        'audio_index': true_count
                    },
                };
                axios.request(config_audio)
                .then((response)=>{console.log(response.data)})
                .catch((error)=>{
                    console.log(error);
                })
            }
        } catch (error) {
            console.log("error")
            setError("Unable to stream audio because I'm dumb")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{display: 'inline'}} className="mr-3">
            <button onClick={startStreaming} disabled={loading} className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0")}>
                Test Voice
            </button>
            {error && <p>{error}</p>}

        </div>
    )
}
export default AudioStream2
