import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware


class Chat(BaseModel):
    message: str
    conversation_id: str


# ============================================================
# Environment
# ============================================================

load_dotenv()

# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
# SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "audio-files")


# DATABASE_URL = os.getenv("DATABASE_URL")


# ============================================================
# Validation
# ============================================================

# required_env = {
#     "SUPABASE_URL": SUPABASE_URL,
#     "SUPABASE_SERVICE_ROLE_KEY": SUPABASE_SERVICE_ROLE_KEY,
#     "SARVAM_API_KEY": SARVAM_API_KEY,
#     "DATABASE_URL": DATABASE_URL,
# }

# missing_env = [name for name, value in required_env.items() if not value]

# if missing_env:
#     raise RuntimeError(
#         "Missing required environment variables: " + ", ".join(missing_env)
#     )


# ============================================================
# Clients
# ============================================================
from openai import OpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

endpoint = "https://jayprakashsharma225-6101-resourc.services.ai.azure.com/openai/v1"
deployment_name = "gpt-5-mini"
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), "https://ai.azure.com/.default"
)

client = OpenAI(base_url=endpoint, api_key=token_provider)


def askAI(user_input: str) -> str:
    response = client.responses.create(model=deployment_name, input=user_input)
    # Get the clean generated text directly
    text = response.output_text
    return text


# ============================================================
# Logging
# ============================================================

# logging.basicConfig(level=logging.INFO)

# logger = logging.getLogger("Agentic AI Workflow")


# ============================================================
# FastAPI
# ============================================================

app = FastAPI(
    title="Agentic AI Workflow",
    version="1.0.0",
)

# Setting up CORS
origins = [
    "http://localhost:8080",
    "http://localhost:5173",
    "https://nrega.jay9874.in",
    "https://nrega-2-0.vercel.app",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Health
# ============================================================
@app.get("/")
async def main():
    return {"status": "ok", "message": "hello world"}


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "Agentic server",
    }


@app.post("/api/chat")
async def handleChat(chat: Chat):
    agent_response = askAI(chat.message)
    return {"status": "ok", "message": "Got your input.", "answer": agent_response}
