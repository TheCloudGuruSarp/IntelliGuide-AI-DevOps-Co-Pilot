import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from dotenv import load_dotenv

# .env dosyasındaki değişkenleri yükle
load_dotenv()

# Gemini API anahtarını ortam değişkenlerinden al
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY ortam değişkeni bulunamadı!")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

app = FastAPI(
    title="IntelliGuide Backend",
    description="DevOps kurulum rehberleri ve asistanı için AI destekli backend.",
    version="2.0.0"
)

# --- NİHAİ CORS AYARLARI ---
# Bu ayar, tüm kaynaklardan gelen tüm isteklere izin verir.
# Bu, iletişim sorununu kesin olarak çözmelidir.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Modelleri (Veri Doğrulama için) ---
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

# --- Prompt Fabrikası (Prompt'ları oluşturmak için) ---
class PromptFactory:
    @staticmethod
    def generate_guide(tool: Tool, params: Dict[str, Any], os: str) -> str:
        param_string = ''
        if tool.id in ['kubernetes', 'rancher-rke2']:
            param_string = f"Master Node'lar ({params.get('master_count', 0)} adet): {', '.join(params.get('master_nodes', []))}\nWorker Node'lar ({params.get('worker_count', 0)} adet): {', '.join(params.get('worker_nodes', []))}"
        else:
            param_string = '\n'.join([f"- {p.get('label', k)}: {v}" for k, v in params.items() for p in tool.params if p['id'] == k])
        
        return f"""
        TASK: Generate a step-by-step DevOps installation guide.
        ROLE: You are IntelliGuide, a world-class DevOps expert AI.
        FORMAT: Strict Markdown. Use headings (##, ###), bold text, and fenced code blocks. Use relevant emojis to make steps clearer (e.g., 📦, 🔧, ⚙️, 🚀, ✅, 🔗, 🔑). For complex tools like Kubernetes, start with a Mermaid.js diagram inside a ```mermaid block.
        LANGUAGE: Turkish.
        CONTEXT: The user wants to install **{tool.name}**. The user's target operating system is **{os}**. All commands must be compatible.
        User-provided parameters:
        {param_string}

        INSTRUCTIONS:
        1. Create a comprehensive, step-by-step installation guide.
        2. Start with a brief introduction.
        3. If the tool is complex (like Kubernetes), provide a simple Mermaid.js diagram illustrating the setup.
        4. Divide the guide into logical, emoji-prefixed steps (e.g., "## 📦 Adım 1: Ön Gereksinimler").
        5. For each step, provide a clear explanation of *what* is being done and *why*.
        6. Provide **all** necessary commands and configuration file contents inside separate, copyable, fenced code blocks with language identifiers.
        7. Incorporate the user's parameters directly into the commands and configurations.
        8. Conclude with a "## 🚀 Kurulum Tamamlandı!" section.
        9. DO NOT ask any questions. Generate the complete guide.
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
        1. Provide a direct, helpful, and concise answer based on the user's current step and question.
        2. If the user provides an error message, analyze it and suggest a solution.
        3. If a command needs to be corrected, provide the full, corrected command in a code block.
        4. Maintain a supportive tone.
        """

# --- API Endpoint'leri ---
@app.post("/api/v1/generate-guide")
async def generate_guide(request: GuideRequest):
    try:
        prompt = PromptFactory.generate_guide(request.tool, request.params, request.os)
        response = model.generate_content(prompt)
        return {"guide": response.text}
    except Exception as e:
        print(f"Hata: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/ask-assistant")
async def ask_assistant(request: AssistantRequest):
    try:
        prompt = PromptFactory.answer_question(request.tool, request.chat_history, request.question, request.current_step)
        response = model.generate_content(prompt)
        return {"answer": response.text}
    except Exception as e:
        print(f"Hata: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "IntelliGuide Backend is running."}
