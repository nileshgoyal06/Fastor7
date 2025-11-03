# Fastor CRM Backend

**Fastor CRM Backend** — simple CRM REST API built with **Node.js**, **Express**, and **MongoDB** (Mongoose).  
Implements public enquiry capture and employee workflows to claim leads. Authentication uses **JWT stored in cookies**.

---

## 🧾 Overview
- Tech: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, cookie-parser, CORS  
- Port: `7777` (default)  

Features:
- Employee register / login / logout
- Public enquiry submission (no auth)
- View unclaimed enquiries (auth required)
- Claim an enquiry (auth required)
- View enquiries claimed by logged-in employee (auth required)
