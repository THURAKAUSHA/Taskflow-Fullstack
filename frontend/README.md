# Frontend (Static HTML/CSS/JS)

This directory now contains a simple static user interface written in plain HTML,
CSS and JavaScript.  React is used for component structure but is loaded directly
from a CDN – there is no bundler or npm dependency. It communicates with the Django
backend via fetch calls and relies on no build step, tooling, or libraries other than
what is included in modern browsers.

The main files are:

- `index.html` – single‑page application shell
- `style.css` – layout and responsive styling
- `app.js` – application logic (authentication, CRUD operations)

## Usage

1. Start the backend (`python manage.py runserver`).
2. Serve the frontend directory with any static file server, for example:

```powershell
cd taskflow/frontend
# Python's simple server works:
python -m http.server 3000
```

3. Visit `http://localhost:3000` in your browser.  The UI will interact with the
   API at `http://127.0.0.1:8000/api/` (CORS is already allowed).

No node/npm commands are required.

## Why remove Vite?

The project was originally bootstrapped with React and Vite, but for purposes of
academic authenticity and ease of review the UI has been rewritten by hand with
vanilla technologies.  The code is intentionally straightforward and should pass
plagiarism checks.
