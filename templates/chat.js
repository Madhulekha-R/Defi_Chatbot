const socket = io("http://localhost:5005");
const messages = document.getElementById("messages");
const form = document.getElementById("form");
const messageInput = document.getElementById("message-input");

function appendMessage(msg, type) {
    const div = document.createElement("div");
    div.classList.add("message-wrapper", `message-wrapper_${type}`);

    const icon = document.createElement("div");
    icon.classList.add("chat-icon", `chat-icon_${type}`);
    icon.innerHTML = type === "user" ? "🧍" : "🤖";

    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble", `chat-bubble_${type}`);
    bubble.innerText = msg;

    div.appendChild(icon);
    div.appendChild(bubble);
    messages.appendChild(div);

    setTimeout(() => {
        messages.scrollTop = messages.scrollHeight;
    }, 10); 
}


window.onload = function () {
    appendMessage("Hello! I am Defi, a virtual assistant. How can I help you?", "bot");
};

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const msg = messageInput.value.trim();
    if (!msg) return;

    appendMessage(msg, "user");
    messageInput.value = "";

    socket.emit("user_uttered", { message: msg });
});

socket.on("bot_uttered", function (response) {
    if (response.text) {
        appendMessage(response.text, "bot");
    }
});

socket.on("connect", function () {
    console.log("Connected to the server");
});

socket.on("connect_error", function (err) {
    console.error("Connection error:", err);
});
