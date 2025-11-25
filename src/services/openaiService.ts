import { OpenAIRequest, OpenAIResponse, OpenAIMessage } from '@/types/openai';
import { Message } from '@/types/chat';
import { PromptConfig } from '@/utils/promptBuilder';

export class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      console.error('VITE_OPENAI_API_KEY not found in environment variables');
    }
    this.apiKey = apiKey || '';
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    console.log('Starting audio transcription:', {
      size: audioBlob.size,
      type: audioBlob.type,
      model: 'whisper-1'
    });

    const formData = new FormData();
    
    // Determine file extension based on blob type
    let fileName = 'audio.webm';
    if (audioBlob.type.includes('wav')) {
      fileName = 'audio.wav';
    } else if (audioBlob.type.includes('mp3')) {
      fileName = 'audio.mp3';
    } else if (audioBlob.type.includes('webm')) {
      fileName = 'audio.webm';
    }
    
    formData.append('file', audioBlob, fileName);
    formData.append('model', 'whisper-1');

    console.log('Sending transcription request with:', {
      fileName,
      modelUsed: 'whisper-1',
      endpoint: `${this.baseUrl}/audio/transcriptions`
    });

    try {
      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData
      });

      console.log('Transcription response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Transcription API error details:', errorData);
        throw new Error(`OpenAI Transcription API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Transcription successful:', { textLength: data.text?.length });
      return data.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  async textToSpeech(text: string, voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'fable'): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/audio/speech`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: voice
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI TTS API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  private formatMessagesForOpenAI(messages: Message[], promptConfig: PromptConfig): OpenAIMessage[] {
    const formattedMessages: OpenAIMessage[] = [];

    // Add system message
    formattedMessages.push({
      role: 'system',
      content: [{
        type: 'input_text',
        text: promptConfig.systemPrompt
      }]
    });

    // Add conversation history - include text, transcribed audio, and file messages
    messages.forEach((message, index) => {
      if (message.type === 'text') {
        formattedMessages.push({
          role: message.sender === 'user' ? 'user' : 'assistant',
          content: [{
            type: message.sender === 'user' ? 'input_text' : 'output_text',
            text: message.content
          }]
        });
      } else if (message.type === 'audio' && message.transcribedText) {
        // Include transcribed audio messages as text in the conversation
        formattedMessages.push({
          role: message.sender === 'user' ? 'user' : 'assistant',
          content: [{
            type: message.sender === 'user' ? 'input_text' : 'output_text',
            text: message.transcribedText
          }]
        });
      } else if (message.type === 'file' && message.sender === 'user') {
        // Include file messages in the conversation
        const isImage = message.fileType?.startsWith('image/');
        if (isImage) {
          formattedMessages.push({
            role: 'user',
            content: [{
              type: 'input_image',
              image_url: message.content
            }]
          });
        } else {
          formattedMessages.push({
            role: 'user',
            content: [{
              type: 'input_file',
              filename: message.fileName || 'file',
              file_data: message.content
            }]
          });
        }
      }
    });

    console.log('Formatted messages for OpenAI:', formattedMessages.length, 'messages (including system)');
    console.log('Message types included:', formattedMessages.slice(1).map(m => m.role).join(', '));

    return formattedMessages;
  }

  async generateResponse(
    messages: Message[], 
    promptConfig: PromptConfig,
    options: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
    } = {}
  ): Promise<string> {
    const {
      temperature = 0.8,
      maxTokens = 2048,
      topP = 1
    } = options;

    const formattedMessages = this.formatMessagesForOpenAI(messages, promptConfig);

    const requestBody = {
      model: 'gpt-5.1',
      input: formattedMessages,
      text: {
        format: {
          type: 'text'
        }
      },
      reasoning: {},
      tools: [],
      temperature,
      max_output_tokens: maxTokens,
      top_p: topP,
      store: true
    };

    try {
      const response = await fetch(`${this.baseUrl}/responses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.output || data.output.length === 0) {
        throw new Error('No response from OpenAI API');
      }

      const outputContent = data.output[0].content;
      if (!outputContent || outputContent.length === 0) {
        throw new Error('No content in OpenAI response');
      }

      return outputContent[0].text;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }

}