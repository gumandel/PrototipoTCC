const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variável para guardar a mensagem do usuário;
const API_KEY = "SUA_API_KEY_AQUI"; // API KEY da OpenAI
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Cria um chat com elemento <li> com a mensagem e o nome da classe -className- repassados
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // Retorna um elemento <li> do chat
}

const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    // Define as mensagens e propriedades da API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // Não é o modelo com maior taxa de acerto, mas é bem econômico
            messages: [{role: "user", content: userMessage}],
        })
    }

    // Envia a solicitação POST para a API, obtém e define a resposta como texto de parágrafo
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content.trim();
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops, algo deu errado, por favor tente novamente.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Obtém a mensagem inserida pelo usuário e remove o espaço em branco

    if(!userMessage) return;

    // Limpa a área de texto de entrada e define sua altura como padrão
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Anexa a mensagem do usuário ao chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Exibe a mensagem "Pensando..." enquanto aguarda a resposta
        const incomingChatLi = createChatLi("Pensando...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Ajuste a altura da área de texto de entrada com base em seu conteúdo
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // Se a tecla Enter for pressionada sem a tecla Shift e a largura
    // da janela é maior que 800px, manuseie o chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
