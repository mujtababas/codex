const userInput = document.getElementById("userInput");
        const sendBtn = document.getElementById("sendBtn");
        const chatbox = document.getElementById("chatbox");
        const apiKey = "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";

        function addMessage(role, message) {
            const div = document.createElement("div");
            div.classList.add(role);

            if (message.includes('```')) {
                const codeBlocks = message.split('```').filter((_, i) => i % 2 === 1);
                const nonCodeBlocks = message.split('```').filter((_, i) => i % 2 === 0);

                nonCodeBlocks.forEach((block, i) => {
                    div.innerHTML += block;
                    if (i < codeBlocks.length) {
                        const pre = document.createElement("pre");
                        const code = document.createElement("code");
                        code.className = "hljs";
                        code.textContent = codeBlocks[i];
                        pre.appendChild(code);
                        hljs.highlightElement(code);
                        div.appendChild(pre);
                    }
                });
            } else {
                div.textContent = message;
            }

            chatbox.appendChild(div);
            chatbox.scrollTop = chatbox.scrollHeight;
        }

        async function getAIResponse(message) {
            addMessage("ai", "Thinking...");
            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "qwen/qwen2.5-vl-72b-instruct:free",
                        messages: [{ role: "user", content: message }]
                    })
                });
                const data = await response.json();
                if (data.choices && data.choices.length > 0) {
                    const aiMessage = data.choices[0].message.content;
                    addMessage("ai", aiMessage);
                } else {
                    addMessage("ai", "Sorry, I couldn't generate a response.");
                }
            } catch (error) {
                console.error("Error fetching AI response:", error);
                addMessage("ai", "An error occurred while processing your request.");
            }
        }

        function sendMessage() {
            const message = userInput.value.trim();
            if (message === "") return;
            addMessage("user", message);
            userInput.value = "";
            getAIResponse(message);
        }

        sendBtn.addEventListener("click", sendMessage);
        userInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendMessage();
        });