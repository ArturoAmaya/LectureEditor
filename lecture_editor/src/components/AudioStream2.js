import React, {useState} from "react";
import axios from "axios"
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
const AudioStream2 = ({voiceId, text, apiKey, voiceSettings}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const startStreaming = async () => {
        setLoading(true);
        setError("");

        const baseUrl = "https://api.elevenlabs.io/v1/text-to-speech"
        const headers = {
            'Content-Type':'application/json',
            'xi-api-key': apiKey,
        }
        const requestBody = {
            text,
            voice_settings: voiceSettings,
          };
        try{
            const response = await axios.post(`${baseUrl}/${voiceId}`, requestBody, {
                headers,
                responseType: 'blob',
            });
            console.log(response)
            if (response.status === 200){
                console.log('sucka')
                const audio = new Audio(URL.createObjectURL(response.data));
                console.log(audio)
                audio.play();
                console.log('huh')
            }
        } catch (error) {
            console.log("error")
            setError("Unable to stream audio because I'm dumb")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <button onClick={startStreaming} disabled={loading}>
                Start Streaming
            </button>
            {error && <p>{error}</p>}

        </div>
    )
}
export default AudioStream2
