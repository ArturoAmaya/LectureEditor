"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// AudioStream.tsx
// from 
// https://github.com/kevinamiri/elevenlabs-react-example/blob/main/src/AudioStream.tsx
const react_1 = __importStar(require("react"));
const axios_1 = __importDefault(require("axios"));
const AudioStream = ({ voiceId, text, apiKey, voiceSettings, }) => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)("");
    const startStreaming = async () => {
        setLoading(true);
        setError("");
        const baseUrl = "https://api.elevenlabs.io/v1/text-to-speech";
        const headers = {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
        };
        const requestBody = {
            text,
            voice_settings: voiceSettings,
        };
        try {
            console.log(`${baseUrl}/${voiceId}`);
            console.log(headers);
            console.log(requestBody);
            const response = await axios_1.default.post(`${baseUrl}/${voiceId}`, requestBody, {
                headers,
                responseType: "blob",
            });
            if (response.status === 200) {
                const audio = new Audio(URL.createObjectURL(response.data));
                audio.play();
            }
            else {
                console.log(response);
                setError("Error: Unable to stream audio.");
            }
        }
        catch (error) {
            console.log(error);
            setError("Error: Unable to stream audio.");
        }
        finally {
            setLoading(false);
        }
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("button", { onClick: startStreaming, disabled: loading }, "Start Streaming"),
        error && react_1.default.createElement("p", null, error)));
};
exports.default = AudioStream;
//# sourceMappingURL=AudioStream.js.map