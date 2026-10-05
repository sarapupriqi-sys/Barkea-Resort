# Barkea Resort

**Residential and touristic website for the luxury villa complex Barkea Resort, Lundër–Farkë, Tirana.**

Barkea Resort is a residential complex with **37 private villas** (15 completed, 22 under construction), organized into typologies A, B, and C. This project presents the complex through a modern, multilingual website featuring an interactive 3D masterplan, gallery, architectural floor plans, and a contact form connected to a Django backend.

> *"A place to live first, an investment second."*

---

## Table of Contents

- [Technologies Used](#technologies-used)
- [Main Features](#main-features)
- [Website Pages](#website-pages)
- [Project Structure](#project-structure)
- [Installation and Local Execution](#installation-and-local-execution)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Development Notes](#development-notes)
- [Contact](#contact)

---

## Technologies Used

| Layer | Technology |
|---|---|
| **Backend** | Python, [Django](https://www.djangoproject.com/) (template engine, routing, static files), Django REST Framework (contact messages API) |
| **Frontend** | HTML5, CSS3 (custom CSS), JavaScript (Vanilla JS) |
| **UI Framework** | [Bootstrap 5.3](https://getbootstrap.com/) (navbar, dropdown, responsive grid) |
| **3D** | [Three.js r128](https://threejs.org/) + `OrbitControls` |
| **Icons** | [Font Awesome 6](https://fontawesome.com/) |
| **Fonts** | Google Fonts: *Luxurious Script*, *PT Serif*, *Playfair Display*, *Plus Jakarta Sans* |
| **Maps** | Google Maps Embed |

---

## Main Features

### Multilingual Interface (EN / AL / IT)
- Instant language switching between **English**, **Albanian**, and **Italian** from the navbar without page refresh.
- Translations are applied on the client side (JavaScript) for all content, including Privacy, FAQ, and Legal pages.
- The selected language is stored in the browser's `localStorage` (`barkea_lang`) and automatically restored on the next visit.
- The page's `lang` attribute (`en`, `sq`, `it`) is also updated automatically.

### Interactive 3D Masterplan (Three.js)
- 3D model of the complex with **37 villas**, clubhouse, sports fields (basketball, football, tennis), roads, and landscaping.
- Orbit controls: rotation, zoom, and movement via mouse or touch.
- Distinct colors for each typology (A, B, C) and customizable plots with a legend.
- **Tooltip** that appears when hovering over a villa.
- Lighting modes **DAY / DUSK / NIGHT**, with windows lighting up at night.
- Integrated into the homepage via `iframe` and also accessible on a full-page view.

### Villa Catalog
- Cards for every unit (A1–A8, B1–B7, C1–C7, and the 15 villas of Phase 1).
- **Filters** by typology and status (Completed / In Progress / Sold out), with a results counter and URLs preserving filters (`?type=A&status=completed`).
- **Detail modal** with photos, description, and floor plans.
- Photo sliders for each series on the homepage.

### Design and Architecture
- Dedicated page showcasing the masterplan concept and tabs for Villa A, B, and C floor plans.
- Lightbox to view the master plan in large dimensions.

### Gallery and Interactive Sections
- Horizontal scrolling gallery on the homepage and grid view on the gallery page.
- "Why Barkea" section with vertical scroll and autoplay.
- Interactive circular diagram of project phases and developer (Dijon Albania).
- Hero video, construction progress video, and footer video.
- Transparent navbar over the hero section that becomes visible on scroll.

### Contact Section with Django Backend
- Form with fields: first name, last name, email, phone, country, and message.
- **Frontend validation** (required fields, email/phone format, mandatory consent) with translated error messages.
- Submission via `fetch` (POST + Django CSRF token) to the `contactmessage-list` endpoint (`/api/contacts/`), with a "SENDING..." state and success/error messages.
- The endpoint is rate-limited (5 requests/minute for anonymous users).
- Consent checkbox (GDPR) and newsletter option.
- Downloadable project PDF brochure.

### Legal Pages
- Comprehensive **Privacy Policy** (data collection, rights under Albanian law and GDPR, retention period).
- **FAQ** and **Legal** pages (in preparation).

---

## Website Pages

| Page | Description |
|---|---|
| `/` | Homepage: hero, location, concept, 3D masterplan, villas, architecture, developer, contact |
| `/villas/` | Full villa catalog with filters |
| `/design/` | Architecture, masterplan, and floor plans |
| `/gallery/` | Project gallery |
| `/contact/` | Contact form |
| `/faq/` | Frequently asked questions |
| `/legal/` | Legal information |
| `/privacy/` | Privacy policy |
| `/masterplan-3d/` | Full-page 3D masterplan |
| `/admin/` | Django admin (contact messages, villas) |

> Exact routes are defined in `barkea-backend/core/urls.py`.

---

## Project Structure

```text
barkea-resort/
├── README.md
├── LICENSE
├── requirements.txt
├── .env.example
├── .gitignore
└── barkea-backend/
    ├── manage.py
    ├── core/                # Django configuration: settings, urls, wsgi/asgi
    ├── api/                 # App: models, serializers, views, urls, tests
    ├── templates/           # base, navbar, footer and page templates
    └── static/
        ├── css/style.css
        ├── js/function.js
        └── images/          # photos, videos, and the PDF brochure
```

---

## Installation and Local Execution

### Prerequisites
- [Python 3.10+](https://www.python.org/downloads/)
- [Git](https://git-scm.com/)
- `pip` (comes with Python)

### 1. Clone the repository

```bash
git clone https://github.com/sarapupriqi-sys/Barkea-Resort.git
cd Barkea-Resort
```

### 2. Create and activate a virtual environment

macOS / Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Enter the backend folder

`manage.py` is inside `barkea-backend/`, so run the next commands from there.

```bash
cd barkea-backend
```

### 5. Run database migrations

This creates a local `db.sqlite3` (it is not part of the repository).

```bash
python3 manage.py migrate
```

### 6. (Optional) Create a superuser

Needed to read messages submitted through the form in `/admin/`.

```bash
python3 manage.py createsuperuser
```

### 7. Start the local server

```bash
python3 manage.py runserver
```

Open your browser at http://127.0.0.1:8000/

---

## Environment Variables

For local development no configuration is needed. For production, set these as real environment variables (see `.env.example`):

| Variable | Description | Default |
|---|---|---|
| `DJANGO_SECRET_KEY` | Secret key. **Required** when `DJANGO_DEBUG=False` | dev-only key |
| `DJANGO_DEBUG` | `True` or `False` | `True` |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated hostnames | `localhost,127.0.0.1` |

---

## Running Tests

```bash
cd barkea-backend
python3 manage.py test
```

---

## Development Notes

- **Static files:** stored in `static/` and loaded with `{% load static %}`.
- **Three.js:** loaded via CDN (cdnjs and jsdelivr), so an internet connection is required for the 3D masterplan.
- **Translations:** located in `static/js/function.js` (`NAV_I18N` and `CONTENT_I18N` objects).
- **Production:** set `DJANGO_DEBUG=False`, `DJANGO_SECRET_KEY` and `DJANGO_ALLOWED_HOSTS`, run `python3 manage.py collectstatic`, and serve the `staticfiles/` folder with your web server (with `DEBUG=False` Django does not serve static files itself).

---

## Contact

- Barkea Resort — Lundër, Farkë, Tirana, Albania
- Email: barkealbania@gmail.com
- WhatsApp: +355 69 202 8516
- Facebook: Barkea Albania
- Instagram: (coming soon)
- Developer: Dijon Albania