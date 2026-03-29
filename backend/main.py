from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Quiz App API")

# Bật CORS để frontend React gọi được API từ cổng khác.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dữ liệu câu hỏi hard-code theo đề (mỗi câu 4 đáp án).
QUIZ_QUESTIONS = [
    {
        "id": 1,
        "question": "Ngôn ngữ nào chạy trực tiếp trên trình duyệt web?",
        "options": ["Python", "Java", "JavaScript", "C#"],
        "correct_answer": "JavaScript",
    },
    {
        "id": 2,
        "question": "Thẻ nào dùng để tạo liên kết trong HTML?",
        "options": ["<a>", "<div>", "<p>", "<link>"],
        "correct_answer": "<a>",
    },
    {
        "id": 3,
        "question": "CSS viết tắt của cụm từ nào?",
        "options": [
            "Creative Style Sheets",
            "Computer Style System",
            "Cascading Style Sheets",
            "Colorful Style Syntax",
        ],
        "correct_answer": "Cascading Style Sheets",
    },
    {
        "id": 4,
        "question": "Lệnh nào dùng để tạo virtual environment trong Python?",
        "options": ["python -m venv .venv", "pip install venv", "venv create", "python create env"],
        "correct_answer": "python -m venv .venv",
    },
    {
        "id": 5,
        "question": "HTTP status code 404 có nghĩa là gì?",
        "options": ["Server Error", "Not Found", "Unauthorized", "Created"],
        "correct_answer": "Not Found",
    },
    {
        "id": 6,
        "question": "Trong React, hook nào dùng để quản lý state?",
        "options": ["useRef", "useMemo", "useState", "useEffect"],
        "correct_answer": "useState",
    },
]


# Mỗi phần tử answers frontend gửi lên sẽ có:
# - question_id: id câu hỏi
# - selected_answer: đáp án user chọn
class AnswerItem(BaseModel):
    question_id: int
    selected_answer: str


# Body tổng khi nộp bài:
# { "answers": [ ... ] }
class SubmitRequest(BaseModel):
    answers: List[AnswerItem]


@app.get("/questions")
def get_questions():
    # API cho frontend lấy câu hỏi khi bắt đầu làm bài.
    # Quan trọng: không trả correct_answer để tránh lộ đáp án.
    return [
        {
            "id": question["id"],
            "question": question["question"],
            "options": question["options"],
        }
        for question in QUIZ_QUESTIONS
    ]


@app.post("/submit")
def submit_quiz(payload: SubmitRequest):
    # Đổi mảng answers thành dạng map:
    # question_id -> selected_answer
    answer_by_question_id = {item.question_id: item.selected_answer for item in payload.answers}

    details = []
    correct_count = 0

    # Chấm từng câu và tạo chi tiết đúng/sai cho frontend hiển thị.
    # Nếu user bỏ trống câu nào, selected_answer sẽ là chuỗi rỗng.
    for question in QUIZ_QUESTIONS:
        selected_answer = answer_by_question_id.get(question["id"], "")
        is_correct = selected_answer == question["correct_answer"]

        if is_correct:
            correct_count += 1

        details.append(
            {
                "question_id": question["id"],
                "selected_answer": selected_answer,
                "correct_answer": question["correct_answer"],
                "is_correct": is_correct,
            }
        )

    total_questions = len(QUIZ_QUESTIONS)
    # Quy đổi điểm theo thang 10.
    score = round((correct_count / total_questions) * 10, 2)

    # Contract trả về đúng theo đề:
    # - total_questions
    # - correct_count
    # - score
    # - details: danh sách kết quả từng câu
    return {
        "total_questions": total_questions,
        "correct_count": correct_count,
        "score": score,
        "details": details,
    }
