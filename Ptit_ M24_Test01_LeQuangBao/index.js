"use strict";
//  import { v4 as uuidv4 } from "uuid";
class Feedback {
    constructor() {
        this.scoreActive = 10;
        this.listFeedbackLocal = JSON.parse(localStorage.getItem("feedbacks")) || [];
        this.feedbackInput = document.querySelector("#feedbackInput");
        this.error = document.querySelector(".error");
        this.btnSend = document.querySelector(".btn-send");
        this.reviewNumber = document.querySelector(".review-number");
        this.averageRate = document.querySelector(".average-number");
        this.inputContainer = document.querySelector(".input-container");
        this.inputContainer.addEventListener("click", () => {
            this.feedbackInput.focus();
        });
        this.feedbackInput.focus();
        this.renderListButtonScore();
        this.handleScoreButtonClick();
        this.renderListFeedback();
        this.validateData();
        this.handleAverageRating();
        this.handleSendButtonClick();
    }
    renderListButtonScore() {
        let scores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let btnScoreGroup = document.querySelector(".btn-score-group");
        let scoreHtmls = scores.map((score) => {
            return `
                <button class="btn-score ${score === this.scoreActive ? "active" : ""}" data-score="${score}">${score}</button>
            `;
        });
        let scoreHtml = scoreHtmls.join("");
        btnScoreGroup.innerHTML = scoreHtml;
    }
    handleScoreButtonClick() {
        let btnScoreGroup = document.querySelector(".btn-score-group");
        btnScoreGroup.addEventListener("click", (e) => {
            let targetButton = e.target.closest(".btn-score");
            if (targetButton) {
                let allButtons = btnScoreGroup.querySelectorAll(".btn-score");
                allButtons.forEach((button) => button.classList.remove("active"));
                targetButton.classList.add("active");
                this.scoreActive = +targetButton.dataset.score;
            }
        });
    }
    renderListFeedback() {
        let listFeedbackContent = document.querySelector(".list-feedback-content");
        let feedbackHtmls = this.listFeedbackLocal.map((feedback) => {
            return `
                <div class="feedback-content">
                    <div class="feedback-content-header">
                        <i id="update_${feedback.id}" class="fa-solid fa-pen-to-square"></i>
                        <i id="delete_${feedback.id}" class="fa-solid fa-xmark"></i>
                    </div>
                    <div class="feedback-content-body">
                        <p class="content-feedback">${feedback.name}</p>
                    </div>
                    <button class="btn-score active">${feedback.score}</button>
                </div>
            `;
        });
        let feedbackHtml = feedbackHtmls.join("");
        listFeedbackContent.innerHTML = feedbackHtml;
        this.reviewNumber.innerHTML = this.listFeedbackLocal.length.toString();
        this.handleDeleteFeedback();
        this.handleUpdateFeedback();
    }
    handleDeleteFeedback() {
        let listFeedbackContent = document.querySelector(".list-feedback-content");
        listFeedbackContent.addEventListener("click", (e) => {
            const deleteButton = e.target.closest(".fa-xmark");
            if (deleteButton) {
                const idDelete = deleteButton.id.split("_")[1];
                // Hiển thị xác nhận bằng một cửa sổ thông báo đơn giản
                if (confirm("Are you sure?")) {
                    // Lọc ra những feedback không có id trùng với id cần xóa
                    this.listFeedbackLocal = this.listFeedbackLocal.filter((fb) => fb.id !== idDelete);
                    // Lưu lại danh sách feedback mới vào localStorage
                    localStorage.setItem("feedbacks", JSON.stringify(this.listFeedbackLocal));
                    // Render lại danh sách feedback và tính điểm trung bình
                    this.renderListFeedback();
                    this.handleAverageRating();
                }
            }
        });
    }
    handleUpdateFeedback() {
        let listFeedbackContent = document.querySelector(".list-feedback-content");
        listFeedbackContent.addEventListener("click", (e) => {
            if (e.target && e.target.matches(".fa-pen-to-square")) {
                let idUpdate = e.target.id.split("_")[1];
                let updatingFeedbackIndex = this.listFeedbackLocal.findIndex((fb) => fb.id === idUpdate);
                if (updatingFeedbackIndex !== -1) {
                    // Lấy ra feedback cần chỉnh sửa
                    let updatingFeedback = this.listFeedbackLocal[updatingFeedbackIndex];
                    // Gán thông tin phản hồi vào input và điểm số
                    this.feedbackInput.value = updatingFeedback.name;
                    this.scoreActive = updatingFeedback.score;
                    // Render lại danh sách điểm để active điểm
                    this.renderListButtonScore();
                    // Xóa phản hồi cũ khỏi mảng
                    this.listFeedbackLocal.splice(updatingFeedbackIndex, 1);
                }
            }
        });
    }
    handleSendButtonClick() {
        this.btnSend.addEventListener("click", () => {
            if (confirm("Are you sure?")) {
                const feedbackName = this.feedbackInput.value.trim();
                if (feedbackName) {
                    const updatingFeedbackIndex = this.listFeedbackLocal.findIndex(fb => fb.name === feedbackName);
                    if (updatingFeedbackIndex !== -1) {
                        // Nếu đã có phản hồi, hãy cập nhật điểm
                        this.listFeedbackLocal[updatingFeedbackIndex].score = this.scoreActive;
                    }
                    else {
                        // Nếu phản hồi không tồn tại, hãy tạo một phản hồi mới và thêm nó vào mảng
                        const newFeedback = {
                            id: uuidv4(),
                            name: feedbackName,
                            score: this.scoreActive,
                        };
                        this.listFeedbackLocal.unshift(newFeedback);
                    }
                    // lưu thông tin mới vào localstorage
                    localStorage.setItem("feedbacks", JSON.stringify(this.listFeedbackLocal));
                    // Cập nhật giao diện người dùng
                    this.renderListFeedback();
                    this.handleAverageRating();
                    // Đặt lại điểm thành 10
                    this.scoreActive = 10;
                    // Cập nhật giao diện người dùng để phản ánh sự thay đổi điểm số
                    this.renderListButtonScore();
                    // Xóa giá trị đầu vào
                    this.feedbackInput.value = "";
                    // Cập nhật số đánh giá
                    this.reviewNumber.innerHTML = this.listFeedbackLocal.length.toString();
                    // Xóa lớp "btn-dark" nếu có
                    this.btnSend.classList.remove("btn-dark");
                }
            }
        });
    }
    validateData() {
        let feedback = this.feedbackInput.value;
        this.feedbackInput.addEventListener("input", (e) => {
            if (!e.target.value.trim()) {
                this.error.style.display = "block";
                this.btnSend.classList.remove("btn-dark");
            }
            else {
                feedback = e.target.value;
                this.error.style.display = "none";
                this.btnSend.classList.add("btn-dark");
            }
        });
    }
    handleAverageRating() {
        if (this.listFeedbackLocal.length > 0) {
            let totalScoreFeedback = this.listFeedbackLocal.reduce((a, b) => {
                return a + b.score;
            }, 0.0);
            let averageRating = totalScoreFeedback / this.listFeedbackLocal.length;
            this.averageRate.innerHTML = averageRating.toFixed(1);
        }
        else {
            this.averageRate.innerHTML = "0.0";
        }
    }
}
new Feedback();
