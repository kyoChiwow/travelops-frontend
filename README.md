# 🌍 TravelOps Frontend

A modern **tour management frontend application** built with **React, TypeScript, and Vite**.
This project allows admins to create, manage, and organize tours with dynamic forms, image uploads, and structured data handling.

---

## 🚀 Features

* 🧾 Create and manage tours with rich form inputs
* 🖼️ Multiple image upload support
* 📅 Date selection with calendar picker
* 📍 Division & tour type selection (dynamic from API)
* ➕ Dynamic fields (Included, Excluded, Amenities, Tour Plan)
* 🔔 Toast notifications for actions
* ✅ Form validation using Zod + React Hook Form
* ⚡ Fast performance with Vite

---

## 🛠️ Tech Stack

**Frontend**

* React 19
* TypeScript
* Vite

**State Management**

* Redux Toolkit (RTK Query)

**UI & Styling**

* Tailwind CSS
* ShadCN UI
* Lucide Icons

**Forms & Validation**

* React Hook Form
* Zod

**Utilities**

* Axios
* date-fns
* Sonner (toast)

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/travelops-frontend.git

# Navigate to project
cd travelops-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

---

## 🧪 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 📁 Project Structure

```
src/
│
├── components/        # Reusable UI components
├── pages/             # Application pages
├── redux/             # Redux store & API slices
├── lib/               # Utility functions
├── hooks/             # Custom hooks
└── assets/            # Static files
```

---

## 🔌 API Integration

This project uses **RTK Query** for API communication.

Main features:

* Fetch divisions
* Fetch tour types
* Create tours (with FormData + images)

Make sure your backend is running and API base URL is correctly configured.

---

## 🖼️ Image Upload

* Supports multiple images
* Images are sent as `FormData`
* Backend should handle:

  * `files` (images)
  * `data` (stringified JSON)

---

## ⚙️ Environment Setup

Create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 📸 Screenshots

*Add your UI screenshots here*

---

## 📌 Future Improvements

* ✏️ Edit & update tours
* 🗑️ Delete tours
* 🔍 Search & filter tours
* 👤 Authentication & role-based access
* 📊 Dashboard analytics

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**MD. Shafiqul Islam**
Full Stack Web Developer

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
