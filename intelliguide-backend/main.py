import os
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY ortam değişkeni bulunamadı!")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

app = FastAPI(
    title="IntelliGuide Backend",
    description="DevOps kurulum rehberleri ve asistanı için AI destekli backend.",
    version="7.0.0" 
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_no_cache_header(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

class Tool(BaseModel):
    id: str
    name: str
    params: List[Dict[str, Any]]

class GuideRequest(BaseModel):
    tool: Tool
    params: Dict[str, Any]
    os: str

class AssistantRequest(BaseModel):
    tool: Tool
    chat_history: List[Dict[str, str]]
    question: str
    current_step: Optional[str] = None

class PromptFactory:
    @staticmethod
    def generate_guide(tool: Tool, params: Dict[str, Any], os: str) -> str:
        param_string = ''
        if tool.id in ['kubernetes', 'rancher-rke2']:
            param_string = f"Master Node'lar ({params.get('master_count', 0)} adet): {', '.join(params.get('master_nodes', []))}\nWorker Node'lar ({params.get('worker_count', 0)} adet): {', '.join(params.get('worker_nodes', []))}"
        else:
            # Handle checkbox values correctly
            param_list = []
            for k, v in params.items():
                param_info = next((p for p in tool.params if p['id'] == k), None)
                label = param_info.get('label', k) if param_info else k
                value_str = ', '.join(v) if isinstance(v, list) else v
                param_list.append(f"- {label}: {value_str}")
            param_string = '\n'.join(param_list)

        return f"""
        TASK: Generate a step-by-step DevOps installation guide with structured, parseable blocks.
        ROLE: You are IntelliGuide, a world-class DevOps expert AI. Your output must be clean, professional, and easy to parse.
        FORMAT: Strict Markdown with custom tags. DO NOT deviate from this format.
        LANGUAGE: Turkish.

        CUSTOM TAGS (CRITICAL):
        1.  `[ON: server_name]`: ALWAYS use this tag on a new line immediately before a code block. `server_name` must be descriptive (e.g., `Tüm Master Node'lar`, `worker-1`, `Yerel Makineniz`).
        2.  `[INFO]...[/INFO]`: Use this block for critical information, warnings, or notes that the user must read. Explain what to do with values from previous commands (like tokens or hashes).
        3.  ALL commands or configuration files MUST be inside a `[ON:...]` block followed by a fenced code block (```bash, ```yaml, etc.). There should be NO untagged code blocks.

        CONTEXT:
        - Tool to install: **{tool.name}**
        - Target OS: **{os}**
        - User Parameters:
        {param_string}

        INSTRUCTIONS:
        1.  Create a comprehensive, step-by-step installation guide.
        2.  Start with a brief introduction (plain text).
        3.  If the tool is complex (like Kubernetes), provide a simple Mermaid.js diagram inside a ```mermaid block.
        4.  Divide the guide into logical, emoji-prefixed steps using Markdown Headings (e.g., "## 📦 Adım 1: Ön Gereksinimler").
        5.  Under each heading, provide clear explanations (plain text).
        6.  When it's time for a command, first write the `[ON: server_name]` tag, then on the next line, the fenced code block.
        7.  Use `[INFO]` tags where necessary for important notes.
        8.  Conclude with a "## 🚀 Kurulum Tamamlandı!" section.
        """

    @staticmethod
    def answer_question(tool: Tool, chat_history: List[Dict[str, str]], question: str, current_step: Optional[str]) -> str:
        history_string = '\n'.join([f"{msg['sender']}: {msg['text']}" for msg in chat_history])
        step_context = f"Kullanıcı şu an bu adımda: \"{current_step}\"" if current_step else "Kullanıcı henüz bir adım seçmedi."
        
        return f"""
        TASK: Act as a real-time DevOps support assistant.
        ROLE: You are IntelliGuide, the same AI that generated the installation guide.
        LANGUAGE: Turkish.
        CONTEXT: The user is installing **{tool.name}**. {step_context}. The user's new question is: "{question}"
        Conversation History:
        ---
        {history_string}
        ---
        INSTRUCTIONS:
        1.  Provide a direct, helpful, and concise answer based on the user's current step and question.
        2.  If the user provides an error message, analyze it and suggest a solution.
        3.  If a command needs to be corrected, provide the full, corrected command in a code block.
        4.  Maintain a supportive tone.
        """

@app.post("/api/v2/generate-guide")
async def generate_guide(request: GuideRequest):
    try:
        prompt = PromptFactory.generate_guide(request.tool, request.params, request.os)
        response = model.generate_content(prompt)
        return {"guide": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v2/ask-assistant")
async def ask_assistant(request: AssistantRequest):
    try:
        prompt = PromptFactory.answer_question(request.tool, request.chat_history, request.question, request.current_step)
        response = model.generate_content(prompt)
        return {"answer": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "IntelliGuide Backend v7 - Professional Guide Output"}
