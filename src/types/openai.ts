export interface OpenAIContent {
  type: 'input_text' | 'input_image' | 'input_file' | 'output_text';
  text?: string;
  image_url?: string;
  filename?: string;
  file_data?: string;
}

export interface OpenAIMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: OpenAIContent[];
}

export interface OpenAIRequest {
  model: string;
  input: OpenAIMessage[];
  text: {
    format: {
      type: 'text';
    };
  };
  reasoning?: object;
  tools?: any[];
  temperature?: number;
  max_output_tokens?: number;
  top_p?: number;
  store?: boolean;
}

export interface OpenAIResponse {
  output: Array<{
    content: Array<{
      type: 'output_text';
      text: string;
    }>;
    role: string;
  }>;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}