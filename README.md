# 📘 Assignly

**Assignly** is a role-based EdTech platform that simplifies assignment tracking and submission for teachers and students. It enables teachers to post assignments and review student submissions, while students can upload their work and track pending tasks — all with clear deadlines, access control, and intuitive dashboards.

---

## 🧩 System Design

### 🧱 Core Entities and Relationships

#### 📘 User

| Field            | Type       | Description                         |
|------------------|------------|-------------------------------------|
| `id`             | int        | Primary key                         |
| `username`       | str        | Unique username                     |
| `hashed_password`| str        | Hashed password for authentication  |
| `role`           | enum       | Either `teacher` or `student`       |

- Relationships:
  - A **teacher** can create many **assignments**
  - A **student** can make many **submissions**

---

#### 📘 Assignment

| Field            | Type       | Description                                |
|------------------|------------|--------------------------------------------|
| `id`             | int        | Primary key                                |
| `title`          | str        | Assignment title                           |
| `description`    | str        | Description of the assignment              |
| `created_at`     | datetime   | Time of creation                           |
| `deadline`       | datetime   | Due date for the assignment                |
| `attachment_url` | str?       | (Optional) File uploaded by teacher        |
| `teacher_id`     | int        | Foreign key → `User.id` (teacher)          |

- Relationships:
  - Linked to one **teacher**
  - Can have many **submissions**

---

#### 📘 Submission

| Field             | Type       | Description                                  |
|-------------------|------------|----------------------------------------------|
| `id`              | int        | Primary key                                  |
| `submitted_at`    | datetime   | Timestamp of the submission                  |
| `attachment_url`  | str?       | (Optional) Submitted file                    |
| `assignment_id`   | int        | Foreign key → `Assignment.id`                |
| `student_id`      | int        | Foreign key → `User.id` (student)            |

- Relationships:
  - Belongs to one **assignment**
  - Belongs to one **student**

---

#### 🔗 Relationships Overview

- **User** (`teacher`) ⟶ **Assignment** (1:N)
- **User** (`student`) ⟶ **Submission** (1:N)
- **Assignment** ⟶ **Submission** (1:N)

---

### 🔐 Authentication Strategy

- Role-based JWT authentication:
  - Users authenticate and receive a token
  - The token includes role claims (`teacher` or `student`)
- Routes are protected using FastAPI dependencies:
  - Teachers can access routes like assignment creation and viewing submissions
  - Students can access submission-related routes only

---

## 🛠 Prototype Implementation

### Features

#### 🔐 Authentication & Access Control
- Role-based signup and login (Teacher / Student)
- Secure access to resources based on user roles

#### 🧑‍🏫 Teacher Functionality
- Create assignments with:
  - Title, description, deadline
  - File attachments (e.g., PDFs, Docs)
- View all submissions per assignment
- Filter submissions by:
  - Student name
  - Late submissions
- Dashboard with:
  - **Active** and **Past** assignment tabs
  - Assignment detail view with submission status

#### 🎓 Student Functionality
- View list of **Active** and **Past** assignments
- Submit assignments with file uploads
- See submission status:
  - **Pending** tag if not submitted
  - **Late** tag if submitted past the deadline

#### 📂 File Management
- File uploads supported for both assignment creation and submission
- Proper file storage and access handling

#### 🧠 Smart Labels & Tracking
- Automatic tagging of **late** submissions
- Visual indicators for **pending** work on student dashboard

##### ⚠️ Note on File Uploads (Production Limitation)

> File uploads (assignment attachments and submissions) are stored in a local `uploads/` directory.

- This works **locally**, but **does not work on Render** (or similar platforms) because:
  - Render’s filesystem is **ephemeral and read-only after build**.
  - The `uploads/` folder cannot retain files or be written to during runtime.

**Current Limitation**: Uploads silently fail or are inaccessible in production.

##### Recommended Solution
To support uploads in production, integrate with a cloud-based storage service like:
- [Amazon S3](https://aws.amazon.com/s3/)
- [Cloudinary](https://cloudinary.com/)
- [Firebase Storage](https://firebase.google.com/docs/storage)

Until then, uploads are only supported when running the backend **locally**.

---

## Tech Stack

#### Backend
- **Python** with **FastAPI** 
- **SQLite** for local database, and **PostgreSQL** on **Neon**
- **JWT Authentication** for secure role-based access
- **Pydantic** and **SQLModel** for request/response validation

#### Frontend
- **React** with **Vite**
- **Axios** for API requests
- **React Router** for navigation
- **Tailwind CSS** for styling

#### Dev & Deployment
- **Git** & **GitHub** for version control
- Deployment via **Render**

---

## API Reference

Assignly provides a full set of RESTful APIs for authentication, assignment creation, and submissions.

Interactive API documentation is available via **Swagger UI**:

🔗 [https://assignly.onrender.com/docs](https://assignly.onrender.com/docs)



## Using the App

Try out Assignly live here:  
🔗 [https://assignly-frontend.onrender.com/](https://assignly-frontend.onrender.com/)

---

## Installing Locally

Follow these steps to run Assignly on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/manasvihow/assignly.git
cd assignly
```
#### 2. Create and Activate a Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Run The Backend Server
```bash
cd ..
uvicorn backend.main:app --reload
```

#### 5. Run The Frontend
```bash
cd frontend
npm install
npm run dev
```

This will run the frontend at: [http://localhost:5173](http://localhost:5173)

---

## Author

#### Manasvi Bathula 
**GitHub:** [@manasvihow](https://github.com/manasvihow)  
**LinkedIn:** [linkedin.com/in/manasvi-bathula](https://linkedin.com/in/manasvi-bathula/)   

> Feel free to reach out for feedback, collaboration, or questions!


