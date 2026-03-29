# Quiz App (FastAPI + React)

## 1) Mục tiêu bài
Ứng dụng trắc nghiệm đơn giản, đúng yêu cầu môn học:
- Hiển thị danh sách câu hỏi
- Cho chọn đáp án
- Nộp bài
- Chấm điểm
- Hiển thị kết quả chi tiết từng câu

## 2) Công nghệ dùng
- Backend: **FastAPI** (cơ bản)
- Frontend: **React + Vite** (cơ bản, dùng `useState`, `useEffect`, `fetch`)

## 3) Cấu trúc source chính
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
  README.md
```

## 4) Mỗi file dùng để làm gì
| File | Mục đích |
|---|---|
| `backend/main.py` | Chứa dữ liệu câu hỏi, API `/questions`, API `/submit` |
| `backend/requirements.txt` | Danh sách thư viện backend |
| `frontend/src/App.jsx` | Logic quiz, gọi API, hiển thị câu hỏi/kết quả |
| `frontend/src/main.jsx` | Điểm vào React app |
| `frontend/src/index.css` | CSS giao diện đơn giản |
| `frontend/package.json` | Script chạy/build frontend |

## 5) Tra cứu nhanh: muốn sửa gì thì vào file nào
| Cần sửa nhanh khi đi kiểm tra | Vào file |
|---|---|
| Đổi câu hỏi/đáp án | `backend/main.py` (biến `QUIZ_QUESTIONS`) |
| Đổi thang điểm/cách tính điểm | `backend/main.py` (biến `score`) |
| Đổi URL backend | `frontend/src/App.jsx` (`API_BASE_URL`) |
| Đổi text hiển thị | `frontend/src/App.jsx` |
| Đổi màu, khoảng cách, kích thước | `frontend/src/index.css` |

## 6) Cách chạy project
### Bước 1: chạy backend (Terminal 1)
```powershell
cd D:\PTUD_PROJECT\GK_QUIZZ_APP\quiz-app\backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Backend chạy tại:
- `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`

### Bước 2: chạy frontend (Terminal 2)
```powershell
cd D:\PTUD_PROJECT\GK_QUIZZ_APP\quiz-app\frontend
$env:NPM_CONFIG_OFFLINE="false"
npm install
npm run dev
```

Frontend chạy tại:
- `http://127.0.0.1:5173`

## 7) API contract (frontend và backend khớp 100%)
### GET `/questions`
Mục đích:
- Lấy danh sách câu hỏi cho frontend
- **Không trả `correct_answer`**

Ví dụ response:
```json
[
  {
    "id": 1,
    "question": "React là thư viện của ngôn ngữ nào?",
    "options": ["Python", "JavaScript", "Java", "C#"]
  }
]
```

### POST `/submit`
Ví dụ request body:
```json
{
  "answers": [
    { "question_id": 1, "selected_answer": "JavaScript" },
    { "question_id": 2, "selected_answer": "HTML" }
  ]
}
```

Ví dụ response:
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

## 8) Luồng hoạt động của app
1. User mở app và bấm **Bắt đầu**
2. Frontend gọi `GET /questions`
3. User chọn đáp án từng câu
4. User bấm **Nộp bài**
5. Frontend gửi `POST /submit`
6. Backend chấm điểm và trả kết quả
7. Frontend hiển thị:
   - Số câu đúng
   - Điểm số
   - Đúng/sai từng câu
   - Đáp án đã chọn
   - Đáp án đúng

## 9) Checklist trước khi nộp
- [ ] Backend chạy ở cổng 8000
- [ ] Frontend chạy ở cổng 5173
- [ ] `GET /questions` không lộ `correct_answer`
- [ ] Mỗi câu có đúng 4 đáp án
- [ ] `POST /submit` trả đủ `total_questions`, `correct_count`, `score`, `details`
- [ ] Màn hình kết quả có đủ thông tin theo đề

## 10) Lỗi hay gặp và cách xử lý nhanh
### Lỗi: "Không tải được câu hỏi. Hãy kiểm tra backend."
Nguyên nhân:
- Backend chưa chạy hoặc chạy sai cổng

Cách xử lý:
1. Kiểm tra backend có đang chạy ở `127.0.0.1:8000` không
2. Mở `http://127.0.0.1:8000/questions` xem có JSON không
3. Nếu có JSON, quay lại frontend bấm lại **Bắt đầu**
