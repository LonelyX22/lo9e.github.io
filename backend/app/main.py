from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Cloud Scanner AI Pro API", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["GET","POST"], allow_headers=["*"])

class HealthResponse(BaseModel):
    status: str
    model_ready: bool
    message: str

@app.get("/api/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="ok", model_ready=False, message="Dedicated cloud model has not been trained and deployed yet.")

@app.get("/api/model-info")
def model_info():
    return {"model_ready": False, "classes": [], "accuracy": None, "message": "No validated V2 model is installed. Predictions are intentionally disabled."}