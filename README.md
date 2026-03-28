# Quiz App (FastAPI + React)

## 1) Mô tả ngắn gọn
Ứng dụng trắc nghiệm đơn giản gồm:
- Backend: FastAPI
- Frontend: React (Vite)

Chức năng:
- Hiển thị câu hỏi
- Chọn đáp án
- Nộp bài
- Chấm điểm
- Hiển thị kết quả chi tiết

## 2) Cấu trúc source chính
```text
quiz-app/
  backend/
    main.py
    requirements.txt
  frontend/
    package.json
    index.html
    src/
      App.jsx
      main.jsx
      index.css
```

## 3) Tra cứu nhanh: muốn sửa gì thì vào file nào
| Cần sửa | File |
|---|---|
| Bộ câu hỏi, đáp án đúng | `backend/main.py` (`QUIZ_QUESTIONS`) |
| Công thức tính điểm | `backend/main.py` (biến `score`) |
| API frontend gọi tới backend | `frontend/src/App.jsx` (`API_BASE_URL`) |
| Text hiển thị trên giao diện | `frontend/src/App.jsx` |
| Màu sắc, khoảng cách UI | `frontend/src/index.css` |

## 4) Cách chạy
### Backend (Terminal 1)
```powershell
cd D:\PTUD_PROJECT\GK_QUIZZ_APP\quiz-app\backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend (Terminal 2)
```powershell
cd D:\PTUD_PROJECT\GK_QUIZZ_APP\quiz-app\frontend
$env:NPM_CONFIG_OFFLINE="false"
npm install
npm run dev
```

Mở trình duyệt:
- `http://127.0.0.1:5173`

## 5) API contract
### GET /questions
- Trả về danh sách câu hỏi cho frontend
- **Không trả `correct_answer`**

Mẫu:
```json
{
  "id": 1,
  "question": "React là thư viện của ngôn ngữ nào?",
  "options": ["Python", "JavaScript", "Java", "C#"]
}
```

### POST /submit
Body:
```json
{
  "answers": [
    { "question_id": 1, "selected_answer": "JavaScript" },
    { "question_id": 2, "selected_answer": "HTML" }
  ]
}
```

Response:
```json
{
  "total_questions": 6,
  "correct_count": 3,
  "score": 5,
  "details": [
    {
      "question_id": 1,
      "selected_answer": "Python",
      "correct_answer": "JavaScript",
      "is_correct": false
    }
  ]
}
```

## 6) Checklist trước khi nộp
- [ ] Backend chạy ở cổng 8000
- [ ] Frontend chạy ở cổng 5173
- [ ] `GET /questions` không lộ `correct_answer`
- [ ] Mỗi câu có đúng 4 đáp án
- [ ] `POST /submit` trả đủ `total_questions`, `correct_count`, `score`, `details`
- [ ] Giao diện hiển thị được số câu đúng, điểm, đúng/sai từng câu, đáp án đã chọn và đáp án đúng
