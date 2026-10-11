# DAMODAR JEWELLERS — Luxury E-Commerce Platform

> **"Crafted for Your Forever."**  
> *Every Detail Tells a Story.*

An editorial luxury jewellery e-commerce experience featuring real-time **Three.js** 3D WebGL rendering, **GSAP ScrollTrigger** cinematic storytelling, and a production-ready **Next.js App Router** architecture integrated with a typed **FastAPI REST API** contract.

---

## ✦ Key Highlights & Technical Capabilities

- **Cinematic Scroll-Driven Storyboard (10 Scenes)**:
  1. **Cinematic Opening**: Obsidian dark aesthetic, floating gold particles, pointer-driven parallax, and floating 3D jewellery hero.
  2. **Hero Transformation (Pinned GSAP)**: Smooth scrub transformation from wide angle to micro-faceting close-up with responsive text transitions ("A Moment of Gold" → "A Lifetime of Meaning").
  3. **Master Artisan Craftsmanship**: Interactive pinpoints highlighting 22K alloy, 6-prong solitaire setting, and BIS hallmark engravings.
  4. **The Four Foundations Gallery**: Dedicated luxury cards for Bridal Jewellery, Gold Essentials, Diamond Elegance, and Everyday Classics with 3D tilt effects.
  5. **Interactive 3D Product Spotlight**: Real-time turntable orbit drag, camera zoom, perspective switching (Angle, Front, Top, Macro), and instant precious metal finish toggles (22K Gold, Rose Gold, Platinum).
  6. **Bridal Haute Parure**: Warm gold lighting, atmospheric depth, and bridal storytelling.
  7. **Atelier Heritage Manifesto**: Magazine-inspired typography and ethical commitment.
  8. **Personalized Discovery**: Real-time multi-attribute filtering (category tabs, material pills, price sorting) updating a live product grid.
  9. **Final Brand Statement**: "Your Story. Your Signature."
  10. **Luxury Footer & Navigation**: Responsive mobile drawer, quick links, policies, and newsletter signup.

- **Production-Ready 3D Architecture**:
  - Physically based procedural masterwork geometries (`DiamondRing`, `GoldNecklace`, `HeritageBangles`).
  - Physically based materials (`MeshPhysicalMaterial`) with realistic metalness, roughness, clearcoat, and diamond dispersion/refraction (`ior: 2.417`).
  - Studio three-point lighting (warm key light, cool fill light, gold specular rim light, and contact shadow plane).
  - Graceful WebGL feature detection and non-WebGL fallback.
  - Full support for `prefers-reduced-motion`.

- **Comprehensive Route Structure**:
  - `/` — Homepage exhibition
  - `/collections` — Collections index
  - `/collections/[slug]` — Individual collection view with dynamic static params
  - `/products/[slug]` — Product detail page with 3D viewer, finish selector, specifications, and related items
  - `/search` — Multi-field search engine
  - `/cart` — Cart with quantity adjustments, promo codes, and pricing breakdown
  - `/checkout` — Checkout protocol with explicit separation of demonstration mode from live payment transactions
  - `/account` — Patron portal
  - `/about` — Brand heritage and manifesto
  - `/contact` — Bespoke consultation booking
  - `/wishlist` — Persistent client-side vault
  - `/policies/privacy`, `/policies/terms`, `/policies/returns`, `/policies/shipping` — Legal & logistics transparency

- **Backend Integration Contract**:
  - Frontend communicates exclusively via typed REST API client with FastAPI backend (`NEXT_PUBLIC_API_BASE_URL`).
  - PostgreSQL is never accessed directly from browser code.
  - Graceful Demonstration Mode fallback with realistic mock data when no backend is connected.

---

## ✦ Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node.js v24.19.0)
- npm or pnpm

### 2. Installation
```bash
cd frontend
npm install --legacy-peer-deps
```

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Production Build & Validation
```bash
npm run build
npm run start
```

---

## ✦ FastAPI REST API Contract

The frontend includes a typed API client in `src/lib/api/client.ts` designed to connect with the following FastAPI endpoints:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/products` | `GET` | List all products with optional `q`, `collection`, `material`, `min_price`, `max_price`, `sort` query params |
| `/api/products/{slug}` | `GET` | Retrieve single product details by slug |
| `/api/collections` | `GET` | Retrieve list of curated jewellery collections |
| `/api/collections/{slug}` | `GET` | Retrieve collection details by slug |
| `/api/orders` | `POST` | Submit a purchase order |
| `/api/auth/login` | `POST` | Authenticate customer credentials |
| `/api/auth/register` | `POST` | Register a new patron account |

---

## ✦ Vercel Deployment

1. Push code to your Git repository.
2. Import the project in Vercel.
3. Set the Root Directory to `frontend`.
4. Configure the environment variable:
   - `NEXT_PUBLIC_API_BASE_URL`: URL of your hosted FastAPI backend (leave blank to run in Demo Mode).
5. Deploy.

---

## ✦ Design System Tokens

- **Background**: `#080807` (Deep Obsidian)
- **Surface**: `#11100E`
- **Surface Raised**: `#191713`
- **Gold**: `#C9A45C` (Warm Champagne Gold)
- **Gold Light**: `#E9D5A0`
- **Ivory**: `#F5F0E7`
- **Muted**: `#A8A197`
- **Gold Border**: `rgba(201, 164, 92, 0.22)`
- **Serif Typography**: *Cormorant Garamond*
- **Sans-Serif Typography**: *Manrope*
