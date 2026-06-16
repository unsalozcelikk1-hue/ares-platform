import json
import urllib.request
import urllib.error
import sys

OLLAMA_BASE = "http://localhost:11434"

def test_ollama():
    print("Checking Ollama status...")
    
    # 1. Check tags endpoint
    try:
        req = urllib.request.Request(f"{OLLAMA_BASE}/api/tags")
        with urllib.request.urlopen(req, timeout=3) as response:
            data = json.loads(response.read().decode('utf-8'))
            models = data.get("models", [])
            
            if not models:
                print("Ollama is running, but no models are installed.")
                print("Please run: ollama pull <model_name> (e.g., ollama pull llama3)")
                return False
                
            print(f"Ollama is ONLINE. Installed models:")
            for m in models:
                print(f"  - {m['name']} (Size: {m.get('size', 0)/(1024*1024*1024):.2f} GB)")
                
            active_model = models[0]["name"]
            print(f"\nTesting prompt generation using model '{active_model}'...")
            
            # 2. Test chat completion
            chat_payload = {
                "model": active_model,
                "messages": [
                    {"role": "user", "content": "Kıbrıs'ta hava nasıl?"}
                ],
                "stream": False
            }
            
            chat_req = urllib.request.Request(
                f"{OLLAMA_BASE}/api/chat",
                data=json.dumps(chat_payload).encode('utf-8'),
                headers={"Content-Type": "application/json"}
            )
            
            print("Sending test message...")
            with urllib.request.urlopen(chat_req, timeout=10) as chat_res:
                chat_data = json.loads(chat_res.read().decode('utf-8'))
                reply = chat_data["message"]["content"]
                print(f"\nOllama Response:\n{reply}\n")
                print("Verification SUCCESSFUL!")
                return True
                
    except urllib.error.URLError as e:
        print(f"\nOllama is OFFLINE or UNREACHABLE at {OLLAMA_BASE}.")
        print("Reason:", e.reason)
        print("ARES will automatically fall back to scripted template dialogues.")
        return False
    except Exception as e:
        print(f"\nAn unexpected error occurred during test: {e}")
        return False

if __name__ == "__main__":
    test_ollama()
