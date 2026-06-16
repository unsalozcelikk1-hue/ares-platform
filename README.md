# ARES — Cyprus Luxury Lead-Gen Platform

> AI ajanları aracılığıyla Kuzey Kıbrıs gayrimenkul yatırımcılarını tespit eden, iletişim kuran ve yönlendiren otomatik komisyon platformu.

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js >= 18
- npm >= 9

### 1. Backend'i Başlat

```bash
cd backend
npm install
cp ../.env.example .env    # veya manuel olarak oluştur
npm start
```

Backend `http://localhost:5000` adresinde çalışır.

### 2. Frontend'i Aç

`index.html` dosyasını doğrudan tarayıcıda açın **veya** bir statik sunucu kullanın:

```bash
# Proje kökünde (opsiyonel — live server)
npx serve . -p 3000
```

Ardından `http://localhost:3000` adresine gidin.

### 3. Sadece Frontend (Backend olmadan)

Backend çalışmıyorsa uygulama otomatik olarak **localStorage fallback** moduna geçer — tüm simülasyon tarayıcıda çalışır.

---

## 📁 Proje Yapısı

```
ares-platform/
├── index.html          # Ana uygulama arayüzü
├── style.css           # Global stiller
├── app.js              # Frontend uygulama mantığı (SPA)
├── Dockerfile          # Container build
├── deploy-ec2.sh       # AWS EC2 deploy scripti
└── backend/
    ├── server.js       # Express REST API + Simülasyon döngüsü
    ├── db.js           # SQLite Promise wrapper
    ├── database.sqlite # Kalıcı veri (otomatik oluşur)
    ├── package.json
    └── .env            # Ortam değişkenleri (bkz. .env.example)
```

---

## ⚙️ Ortam Değişkenleri

`.env.example` dosyasını kopyalayıp düzenleyin:

```bash
cp .env.example backend/.env
```

| Değişken | Varsayılan | Açıklama |
|----------|-----------|----------|
| `PORT` | `5000` | Backend port numarası |
| `CORS_ORIGIN` | `*` | İzin verilen frontend origin |

---

## 🤖 AI Ajan Mimarisi

| Ajan | Görev | Yükseltme |
|------|-------|-----------|
| **Scraper** | Forum & LinkedIn taraması, yatırımcı sinyali tespiti | GPT-4o Mini → Claude 3.5 → o1 Pro |
| **Negotiator** | İlk temas, bütçe doğrulama, Kıbrıs tanıtımı | GPT-4o Mini → Claude 3.5 → o1 Pro |
| **Closer** | Kalifikasyon, acente yönlendirme, komisyon garantisi | GPT-4o Mini → Claude 3.5 → o1 Pro |

---

## 🏗️ API Endpoint'leri

| Method | Path | Açıklama |
|--------|------|----------|
| `GET` | `/api/state` | Oyun durumunu getir |
| `POST` | `/api/state/reset` | Tüm veriyi sıfırla |
| `POST` | `/api/state/upgrade` | Donanım/gayrimenkul satın al |
| `POST` | `/api/state/swap` | GBP → USDT OTC swap |
| `GET` | `/api/leads` | Tüm lead'leri listele |
| `POST` | `/api/leads/generate` | Manuel lead üret |
| `POST` | `/api/leads/:id/qualify` | Lead'i yönlendir, komisyon al |
| `GET` | `/api/prompts` | Müşteri şablonlarını getir |
| `POST` | `/api/prompts` | Şablon güncelle |
| `POST` | `/api/agents/upgrade` | AI ajan modeli yükselt |
| `POST` | `/api/agents/region` | Hedef pazar bölgesi değiştir |

---

## 🐳 Docker ile Çalıştırma

```bash
docker build -t ares-platform .
docker run -p 5000:5000 ares-platform
```

---

## 📜 Lisans

Özel kullanım. Tüm haklar saklıdır.
