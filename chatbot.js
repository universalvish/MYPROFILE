// Multilingual Chatbot with Voice Support
class MultilingualChatbot {
    constructor() {
        this.currentLanguage = 'en';
        this.messages = [];
        this.isListening = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.initSpeechRecognition();
        this.setupEventListeners();
        this.loadKnowledgeBase();
    }

    // Initialize Speech Recognition
    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = this.currentLanguage;

            this.recognition.onstart = () => {
                this.isListening = true;
                document.getElementById('micBtn').classList.add('listening');
                this.updateVoiceStatus('🎤 Listening...');
            };

            this.recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (finalTranscript) {
                    document.getElementById('chatInput').value = finalTranscript.trim();
                }
            };

            this.recognition.onend = () => {
                this.isListening = false;
                document.getElementById('micBtn').classList.remove('listening');
                this.updateVoiceStatus('');
            };

            this.recognition.onerror = (event) => {
                this.updateVoiceStatus(`❌ Error: ${event.error}`);
                document.getElementById('micBtn').classList.remove('listening');
                this.isListening = false;
            };
        }
    }

    // Setup Event Listeners
    setupEventListeners() {
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        document.getElementById('micBtn').addEventListener('click', () => this.toggleVoiceInput());
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
    }

    // Toggle Voice Input
    toggleVoiceInput() {
        if (!this.recognition) {
            alert('Speech Recognition not supported in this browser');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.lang = `${this.currentLanguage}-${this.getCountryCode(this.currentLanguage)}`;
            this.recognition.start();
        }
    }

    // Get Country Code for Language
    getCountryCode(lang) {
        const codes = {
            'en': 'US',
            'hi': 'IN',
            'mr': 'IN',
            'gu': 'IN',
            'ta': 'IN',
            'te': 'IN',
            'kn': 'IN',
            'ml': 'IN'
        };
        return codes[lang] || 'US';
    }

    // Change Language
    changeLanguage(lang) {
        this.currentLanguage = lang;
        if (this.recognition) {
            this.recognition.lang = `${lang}-${this.getCountryCode(lang)}`;
        }
    }

    // Update Voice Status
    updateVoiceStatus(status) {
        document.getElementById('voiceStatus').textContent = status;
    }

    // Load Knowledge Base
    loadKnowledgeBase() {
        this.knowledgeBase = {
            'profile': {
                'en': ['Who are you', 'Tell me about yourself', 'What is your name', 'Your profile', 'About Vishvanath'],
                'hi': ['तुम कौन हो', 'अपने बारे में बताओ', 'तुम्हारा नाम क्या है', 'तुम्हारी प्रोफाइल'],
                'mr': ['तुम कोण आहात', 'आपल्या बद्दल सांगा', 'आपले नाव काय आहे', 'आपली प्रोफाइल']
            },
            'skills': {
                'en': ['What are your skills', 'Technical skills', 'Programming languages', 'What do you know', 'Your expertise'],
                'hi': ['आपकी कौशल क्या हैं', 'तकनीकी कौशल', 'प्रोग्रामिंग भाषाएं', 'आप क्या जानते हैं'],
                'mr': ['तुम्हाला काय कौशल्य आहे', 'तांत्रिक कौशल्य', 'प्रोग्रामिंग भाषा', 'तुम्हाला काय माहित आहे']
            },
            'projects': {
                'en': ['What projects have you done', 'Show your work', 'Your portfolio', 'Projects', 'What have you built'],
                'hi': ['आपने कौन सी परियोजनाएं की हैं', 'अपना काम दिखाओ', 'तुम्हारा पोर्टफोलियो', 'परियोजनाएं'],
                'mr': ['तुम्ही कोणत्या प्रकल्पावर काम केलात', 'तुमचे काम दाखवा', 'तुमचा पोर्टफोलिओ', 'प्रकल्प']
            },
            'education': {
                'en': ['Where do you study', 'Your education', 'Education background', 'College', 'University'],
                'hi': ['तुम कहां पढ़ते हो', 'आपकी शिक्षा', 'शिक्षा की पृष्ठभूमि', 'कॉलेज'],
                'mr': ['तुम कुठे शिक्षण घेतात', 'तुम्हाची शिक्षा', 'शिक्षेची पार्श्वभूमी', 'महाविद्यालय']
            },
            'experience': {
                'en': ['What is your experience', 'Work experience', 'Have you worked', 'Experience', 'Internship'],
                'hi': ['आपका अनुभव क्या है', 'कार्य अनुभव', 'क्या आपने काम किया है', 'अनुभव', 'इंटर्नशिप'],
                'mr': ['तुम्हाचा अनुभव काय आहे', 'कार्य अनुभव', 'तुम्ही काम केलात का', 'अनुभव', 'इंटर्नशिप']
            },
            'interests': {
                'en': ['What are your interests', 'What do you like', 'Your passion', 'What excites you', 'Hobbies'],
                'hi': ['आपकी रुचियां क्या हैं', 'आपको क्या पसंद है', 'आपका जुनून', 'आपको क्या उत्तेजित करता है'],
                'mr': ['तुम्हाला काय आवडते', 'तुम्हाला काय पसंद आहे', 'तुम्हाचा आवेग', 'तुम्हाला काय आनंद देते']
            }
        };
    }

    // Get AI Response
    getResponse(userMessage) {
        const messageLower = userMessage.toLowerCase();
        
        // Determine category
        for (const [category, keywords] of Object.entries(this.knowledgeBase)) {
            const langKeywords = keywords[this.currentLanguage] || keywords['en'];
            for (const keyword of langKeywords) {
                if (messageLower.includes(keyword.toLowerCase())) {
                    return this.getResponseForCategory(category);
                }
            }
        }

        // Default response
        return this.getDefaultResponse();
    }

    // Get Response for Category
    getResponseForCategory(category) {
        const responses = {
            'profile': {
                'en': "I'm Vishvanath Mokashi, a Computer Science Engineering student. I'm passionate about AI, Full Stack Development, and building impactful software solutions.",
                'hi': "मैं विश्वनाथ मोकाशी हूं, एक कंप्यूटर विज्ञान इंजीनियरिंग के छात्र। मैं AI, Full Stack Development और प्रभावशाली सॉफ्टवेयर समाधान बनाने के बारे में भावुक हूं।",
                'mr': "मी विश्वनाथ मोकाशी आहे, कंप्यूटर विज्ञान अभियांत्रिकी विद्यार्थी. मी AI, Full Stack Development आणि प्रभावशाली सॉफ्टवेअर समाधान बनविण्याबद्दल उत्साही आहे."
            },
            'skills': {
                'en': "My technical skills include: Java, Python, C, C++, HTML, CSS, JavaScript, React, MySQL, SQL, Git, and GitHub. I also have strong knowledge of Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, and OOP concepts.",
                'hi': "मेरे तकनीकी कौशल में शामिल हैं: Java, Python, C, C++, HTML, CSS, JavaScript, React, MySQL, SQL, Git, और GitHub। मेरे पास डेटा स्ट्रक्चर्स और एल्गोरिदम, DBMS, ऑपरेटिंग सिस्टम, कंप्यूटर नेटवर्क्स और OOP अवधारणाओं का दृढ़ ज्ञान है।",
                'mr': "माझे तांत्रिक कौशल्य यांमध्ये समाविष्ट आहे: Java, Python, C, C++, HTML, CSS, JavaScript, React, MySQL, SQL, Git, आणि GitHub। मला डेटा स्ट्रक्चर्स आणि अल्गोरिदम, DBMS, ऑपरेटिंग सिस्टम्स, कंप्यूटर नेटवर्क्स आणि OOP संकल्पनांचे मजबूत ज्ञान आहे."
            },
            'projects': {
                'en': "I've built several projects including: 1) AI Powered PDF to JSON Engine - converts PDFs to structured JSON using AI, 2) AI Lab Builder Platform - interactive platform for AI models, 3) E-Commerce Website - full-featured online store, 4) Student Management System - comprehensive academic system, and 5) This Portfolio Website with AI chatbot.",
                'hi': "मैंने कई परियोजनाएं बनाई हैं जिनमें शामिल हैं: 1) AI Powered PDF to JSON Engine - AI का उपयोग करके PDFs को structured JSON में परिवर्तित करता है, 2) AI Lab Builder Platform - AI मॉडल के लिए इंटरैक्टिव प्लेटफॉर्म, 3) E-Commerce Website - पूरी तरह विकसित ऑनलाइन स्टोर, 4) Student Management System - व्यापक शैक्षणिक प्रणाली, और 5) यह पोर्टफोलियो वेबसाइट AI चैटबॉट के साथ।",
                'mr': "मी अनेक प्रकल्पांवर काम केलो आहे ज्यात समाविष्ट आहे: 1) AI Powered PDF to JSON Engine - AI वापरून PDFचे structured JSON मध्ये रूपांतर करते, 2) AI Lab Builder Platform - AI मॉडेल्सचे इंटरैक्टिव प्लॅटफॉर्म, 3) E-Commerce Website - पूर्ण ऑनलाइन स्टोर, 4) Student Management System - व्यापक शैक्षणिक प्रणाली, आणि 5) हे पोर्टफोलियो वेबसाइट AI चॅटबॉटसह."
            },
            'education': {
                'en': "I'm pursuing B.Tech in Computer Science & Engineering. I've also completed certifications from IBM SkillsBuild, Microsoft Learn, HP LIFE, and Web Development programs.",
                'hi': "मैं कंप्यूटर विज्ञान और इंजीनियरिंग में B.Tech का पीछा कर रहा हूं। मैंने IBM SkillsBuild, Microsoft Learn, HP LIFE और Web Development programs से प्रमाणपत्र भी पूरा किए हैं।",
                'mr': "मी कंप्यूटर विज्ञान आणि अभियांत्रिकी मध्ये B.Tech चे अनुसरण करत आहे. मी IBM SkillsBuild, Microsoft Learn, HP LIFE आणि Web Development programs मधील प्रमाणपत्र पूर्ण केले आहेत."
            },
            'interests': {
                'en': "I'm passionate about Artificial Intelligence, Full Stack Development, Software Engineering, Cybersecurity, and Cloud Computing. I love exploring new technologies and building solutions that make a real impact.",
                'hi': "मैं कृत्रिम बुद्धिमत्ता, Full Stack Development, सॉफ्टवेयर इंजीनियरिंग, साइबर सुरक्षा और क्लाउड कंप्यूटिंग के बारे में भावुक हूं। मुझे नई प्रौद्योगिकियों की खोज करना और ऐसे समाधान बनाना पसंद है जो वास्तविक प्रभाव डालते हैं।",
                'mr': "मी कृत्रिम बुद्धिमत्ता, Full Stack Development, सॉफ्टवेयर अभियांत्रिकी, साइबरसुरक्षा आणि क्लाउड कंप्यूटिंग बद्दल उत्साही आहे. मला नवीन तंत्रज्ञान शोधायला आणि वास्तविक प्रभाव टाकणारे समाधान बनविणे आवडते."
            }
        };

        return responses[category][this.currentLanguage] || responses[category]['en'];
    }

    // Get Default Response
    getDefaultResponse() {
        const defaults = {
            'en': "That's a great question! I'm here to help you learn more about Vishvanath's profile, skills, projects, and interests. Feel free to ask me anything!",
            'hi': "यह एक शानदार सवाल है! मैं विश्वनाथ की प्रोफाइल, कौशल, परियोजनाओं और रुचियों के बारे में और जानने में आपकी मदद करने के लिए यहां हूं।",
            'mr': "हे एक शानदार प्रश्न आहे! मी विश्वनाथ यांच्या प्रोफाइल, कौशल्य, प्रकल्प आणि रुचींबद्दल अधिक जाणून घेण्यात आपल्याला मदत करण्यासाठी येथे आहे."
        };

        return defaults[this.currentLanguage] || defaults['en'];
    }

    // Send Message
    sendMessage() {
        const inputElement = document.getElementById('chatInput');
        const userMessage = inputElement.value.trim();

        if (!userMessage) return;

        // Add user message
        this.addMessage(userMessage, 'user');
        inputElement.value = '';

        // Get and add bot response
        const response = this.getResponse(userMessage);
        setTimeout(() => {
            this.addMessage(response, 'bot');
            this.speakMessage(response);
        }, 500);
    }

    // Add Message to Chat
    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;

        const contentElement = document.createElement('div');
        contentElement.className = 'message-content';
        contentElement.textContent = text;

        messageElement.appendChild(contentElement);
        messagesContainer.appendChild(messageElement);

        // Auto scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Speak Message using Text-to-Speech
    speakMessage(text) {
        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = `${this.currentLanguage}-${this.getCountryCode(this.currentLanguage)}`;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        this.synthesis.speak(utterance);
    }

    // Stop speaking
    stopSpeaking() {
        this.synthesis.cancel();
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new MultilingualChatbot();

    // Chat toggle functionality
    const chatToggle = document.getElementById('chatToggle');
    const chatFab = document.getElementById('chatFab');
    const closeChat = document.getElementById('closeChat');
    const chatbotContainer = document.getElementById('chatbotContainer');

    function openChat() {
        chatbotContainer.classList.add('active');
    }

    function closeChats() {
        chatbotContainer.classList.remove('active');
    }

    chatToggle.addEventListener('click', openChat);
    chatFab.addEventListener('click', openChat);
    closeChat.addEventListener('click', closeChats);

    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatbotContainer.contains(e.target) && 
            e.target !== chatToggle && 
            e.target !== chatFab &&
            !chatToggle.contains(e.target) &&
            !chatFab.contains(e.target)) {
            closeChats();
        }
    });

    // Make openChat globally available
    window.openChat = openChat;
});
