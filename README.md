# 🏰 Death Knights Codex

*A Wiki & Management Platform for a Swordplay Clan*

A full-stack wiki platform designed for a **swordplay clan (Death Knights)**, combining structured knowledge management with a **medieval-themed interface**.

This project focuses on **content organization, role-based administration, and immersive UI design**, while maintaining clean architecture and real-world usability.

---

## ⚔️ Overview

The Death Knights Codex serves as a central hub for:

* 📖 Techniques and combat knowledge
* 🛡️ Clan structure and organization
* 📚 Categorized articles and guides
* 🧭 Internal documentation for members

All wrapped in a **custom parchment-style UI** inspired by medieval manuscripts and RPG codices.

---

## ✨ Features

### 📚 Article System

* Markdown-powered articles (`react-markdown` + GFM)
* Clean, readable codex-style layout
* Dynamic routing (`/article/:id`)
* Last updated timestamps

### 🗂️ Categories & Article Groups

* Hierarchical organization of knowledge
* Create, edit, and delete categories
* Group related articles together
* Custom icons for categories

### 🛠️ Manager Hub (Admin Panel)

* Role-based access (admin-only tools)
* Create/update/delete categories and groups
* Modal-based editing system
* Expandable parchment dropdown UI

### 🔐 Authentication & Permissions

* Token-based authentication
* Role validation (`hasRole`)
* Protected destructive actions (delete, edit)

---

## 🎨 Design Philosophy

This project intentionally avoids generic UI frameworks and instead focuses on a **custom medieval aesthetic**:

* 📜 Scroll / parchment-inspired dropdowns
* 🪶 Textured background with vignette + grain
* ⚔️ Minimalist but thematic controls
* 📖 Codex-style article presentation

The goal is to create something that feels like:

> *a game codex or guild archive, not a corporate dashboard*

---

## 🧱 Tech Stack

### Frontend

* React
* TypeScript
* React Router
* Context API (state management)
* Custom CSS (no UI libraries)

### Backend

* REST API (custom)
* Token-based authentication

### Libraries

* `react-markdown`
* `remark-gfm`

---

## 🧠 Architecture

The app uses a **context-based architecture** to keep logic modular:

* `AuthContext` → authentication & roles
* `CategoryContext` → category state & CRUD
* `ArticleGroupContext` → group organization
* `ArticleContext` → article fetching & management

This ensures:

* Separation of concerns
* Reusable logic
* Scalable structure

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the frontend

```bash
npm run dev
```

### 4. Backend

Ensure your API is running at:

```
http://localhost:5119
```

---

## 🔑 Environment Notes

* Authentication requires a token stored in `localStorage`
* Admin features require role `1`

---

## 📌 Future Improvements

* [ ] Rich text / WYSIWYG editor for articles
* [ ] Search system (by title/content)
* [ ] Mobile UI improvements
* [ ] Image uploads for articles
* [ ] Syntax highlighting for code blocks
* [ ] Pagination / lazy loading
* [ ] Expanded role system (officers, members, etc.)

---

## 🎯 Project Goals

This project was built to:

* Simulate a **real-world content management system**
* Practice **React architecture and state management**
* Build a **custom-designed UI from scratch**
* Create a **themed application with strong identity**
* Showcase **full-stack integration**

---

## 📄 License

Proprietary License (All Rights Reserved)

---

## 👤 Author

Luis Felipe (Kokai)

---

## 💬 Final Note

This project blends **practical software engineering** with **creative design**.

It’s not just a CRUD app — it’s an attempt to build something that feels like it belongs inside the world it serves.
