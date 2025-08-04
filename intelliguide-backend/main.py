import os
from fastapi import FastAPI, HTTPException, Response
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
    version="4.0.0" # Versiyonu güncelledik
)

# --- NİHAİ CORS AYARLARI ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ÖNBELLEĞİ KIRMAK İÇİN ARA KATMAN (MIDDLEWARE) ---
@app.middleware("http")
async def add_no_cache_header(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

# --- Pydantic Modelleri ---
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

# --- Prompt Fabrikası ---
class PromptFactory:
    # ... (PromptFactory içeriği değişmedi, aynı kalabilir)
    @staticmethod
    def generate_guide(tool: Tool, params: Dict[str, Any], os: str) -> str:
        param_string = ''
        if tool.id in ['kubernetes', 'rancher-rke2']:
            param_string = f"Master Node'lar ({params.get('master_count', 0)} adet): {', '.join(params.get('master_nodes', []))}\nWorker Node'lar ({params.get('worker_count', 0)} adet): {', '.join(params.get('worker_nodes', []))}"
        else:
            param_string = '\n'.join([f"- {p.get('label', k)}: {v}" for k, v in params.items() for p in tool.params if p['id'] == k])
        return f"TASK: Generate a step-by-step DevOps installation guide..." # Prompt'un geri kalanı aynı

    @staticmethod
    def answer_question(tool: Tool, chat_history: List[Dict[str, str]], question: str, current_step: Optional[str]) -> str:
        history_string = '\n'.join([f"{msg['sender']}: {msg['text']}" for msg in chat_history])
        step_context = f"Kullanıcı şu an bu adımda: \"{current_step}\"" if current_step else "Kullanıcı henüz bir adım seçmedi."
        return f"TASK: Act as a real-time DevOps support assistant..." # Prompt'un geri kalanı aynı

# --- API Endpoint'leri ---
@app.post("/api/v1/generate-guide")
async def generate_guide(request: GuideRequest):
    try:
        prompt = PromptFactory.generate_guide(request.tool, request.params, request.os)
        response = model.generate_content(prompt)
        return {"guide": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/ask-assistant")
async def ask_assistant(request: AssistantRequest):
    try:
        prompt = PromptFactory.answer_question(request.tool, request.chat_history, request.question, request.current_step)
        response = model.generate_content(prompt)
        return {"answer": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "IntelliGuide Backend v4 - CACHE BUSTED"}
