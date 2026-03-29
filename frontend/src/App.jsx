import React, { useEffect, useState } from "react";

// Backend FastAPI chạy local ở cổng 8000.
const API_BASE_URL = "http://127.0.0.1:8000";

function App() {
  // hasStarted: user đã bấm "Bắt đầu" hay chưa
  // questionList: danh sách câu hỏi lấy từ backend
  // selectedByQuestionId: lưu đáp án đã chọn theo question_id
  // quizResult: kết quả backend trả về sau khi nộp bài
  // isLoading: trạng thái đang gọi API
  // errorMessage: thông báo lỗi hiển thị cho user
  const [hasStarted, setHasStarted] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [selectedByQuestionId, setSelectedByQuestionId] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Khi bấm Bắt đầu thì gọi API lấy câu hỏi.
  useEffect(() => {
    if (!hasStarted) {
      return;
    }

    const loadQuestions = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${API_BASE_URL}/questions`);
        if (!response.ok) {
          throw new Error("Không gọi được API");
        }
        const data = await response.json();
        setQuestionList(data);
      } catch (error) {
        // Nếu backend đang tắt, hiện lại nút Bắt đầu để thử lại.
        setHasStarted(false);
        setErrorMessage("Không tải được câu hỏi. Hãy kiểm tra backend.");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [hasStarted]);

  // Bắt đầu lượt làm bài mới: reset kết quả và đáp án cũ.
  const handleStartQuiz = () => {
    setQuizResult(null);
    setSelectedByQuestionId({});
    setQuestionList([]);
    setErrorMessage("");
    setHasStarted(true);
  };

  // Lưu đáp án user chọn cho từng câu.
  const handleChooseAnswer = (questionId, answer) => {
    setSelectedByQuestionId((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Gửi đáp án lên backend để chấm điểm.
  const handleSubmitQuiz = async () => {
    setIsLoading(true);
    setErrorMessage("");

    // Đổi dữ liệu sang đúng contract backend yêu cầu:
    // { answers: [{ question_id, selected_answer }, ...] }
    const answersPayload = questionList.map((question) => ({
      question_id: question.id,
      selected_answer: selectedByQuestionId[question.id] || "",
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: answersPayload }),
      });
      if (!response.ok) {
        throw new Error("Không gọi được API");
      }
      const data = await response.json();
      setQuizResult(data);
    } catch (error) {
      setErrorMessage("Nộp bài thất bại. Hãy thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Tìm nội dung câu hỏi theo question_id để hiển thị trong phần kết quả.
  const findQuestionText = (questionId) => {
    const question = questionList.find((item) => item.id === questionId);
    return question ? question.question : "";
  };

  return (
    <div className="app-container">
      <h1>Quiz App</h1>

      {!hasStarted && (
        <button className="primary-btn" onClick={handleStartQuiz}>
          Bắt đầu
        </button>
      )}

      {/* Phần làm bài: hiển thị câu hỏi + chọn đáp án + nút nộp bài */}
      {hasStarted && !quizResult && (
        <div>
          {isLoading && <p>Đang tải...</p>}

          {!isLoading &&
            questionList.map((question, index) => (
              <div key={question.id} className="question-card">
                <p>
                  <strong>
                    Câu {index + 1}: {question.question}
                  </strong>
                </p>

                {question.options.map((option) => (
                  <label key={option} className="option-row">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={selectedByQuestionId[question.id] === option}
                      onChange={() => handleChooseAnswer(question.id, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            ))}

          {!isLoading && questionList.length > 0 && (
            <button className="primary-btn" onClick={handleSubmitQuiz}>
              Nộp bài
            </button>
          )}
        </div>
      )}

      {errorMessage && <p className="error-text">{errorMessage}</p>}

      {/* Phần kết quả sau khi nộp bài */}
      {quizResult && (
        <div className="result-box">
          <h2>Kết quả</h2>
          <p>
            Số câu đúng: {quizResult.correct_count}/{quizResult.total_questions}
          </p>
          <p>Điểm số: {quizResult.score}</p>

          <h3>Chi tiết từng câu</h3>
          {quizResult.details.map((detail) => (
            <div
              key={detail.question_id}
              className={detail.is_correct ? "detail-item correct" : "detail-item wrong"}
            >
              <p>
                <strong>
                  Câu {detail.question_id}: {findQuestionText(detail.question_id)}
                </strong>
              </p>
              <p>Bạn chọn: {detail.selected_answer || "(chưa chọn)"}</p>
              <p>Đáp án đúng: {detail.correct_answer}</p>
              <p>Kết quả: {detail.is_correct ? "Đúng" : "Sai"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
