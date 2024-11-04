// Mock backend data structure and current session
const mockBackend = {
    users: JSON.parse(localStorage.getItem("users")) || [],
    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
    news: [
        {
            id: 1,
            title: "North American Tour Announced!",
            date: "February 15, 2024",
            content: "We're thrilled to announce our upcoming North American tour!",
            imageUrl: "https://via.placeholder.com/600x300",
            comments: []
        }
    ],
    tourDates: [
        {
            location: "Toronto, ON",
            venue: "Maple Leaf Gardens",
            date: "March 15, 2024",
            time: "8:00 PM"
        }
    ],
    fanForum: []
};

// Helper functions for local storage
function saveMockData() {
    localStorage.setItem("users", JSON.stringify(mockBackend.users));
    localStorage.setItem("currentUser", JSON.stringify(mockBackend.currentUser));
}

// Registration function
function registerUser() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    if (!username || !password) {
        document.getElementById("auth-message").textContent = "Username and password required!";
        return;
    }

    const userExists = mockBackend.users.some(user => user.username === username);
    if (userExists) {
        document.getElementById("auth-message").textContent = "User already exists!";
        return;
    }

    mockBackend.users.push({ username, password });
    saveMockData();
    document.getElementById("auth-message").textContent = "Registration successful!";
    document.getElementById("register-form").reset();
}

// Login function
function loginUser() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const user = mockBackend.users.find(user => user.username === username && user.password === password);

    if (user) {
        mockBackend.currentUser = user;
        saveMockData();
        document.getElementById("auth-message").textContent = "Login successful!";
        setTimeout(() => location.reload(), 1000);  // Refresh page to load user session
    } else {
        document.getElementById("auth-message").textContent = "Invalid credentials!";
    }
}

// Logout function
function logoutUser() {
    mockBackend.currentUser = null;
    saveMockData();
    location.reload();
}

// Add Comment Function
function addComment(postId, commentText) {
    if (!mockBackend.currentUser) {
        alert("Please login to comment.");
        return;
    }

    const post = mockBackend.news.find(post => post.id === postId);
    post.comments.push({ user: mockBackend.currentUser.username, comment: commentText });
    renderNews();
}

// Add Ticket Purchase Function (Dummy)
function buyTicket(location) {
    if (!mockBackend.currentUser) {
        alert("Please login to purchase tickets.");
        return;
    }
    alert(`Ticket for ${location} purchased by ${mockBackend.currentUser.username}`);
}

// Add Fan Forum Post
function addFanPost(postContent) {
    if (!mockBackend.currentUser) {
        alert("Please login to post in the forum.");
        return;
    }
    mockBackend.fanForum.push({ user: mockBackend.currentUser.username, post: postContent, replies: [] });
    renderFanForum();
}

// Render Functions (Existing functions with slight adjustments to allow user actions)
function renderNews() {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    mockBackend.news.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = "bg-white p-6 rounded-lg shadow-lg mb-4";
        postElement.innerHTML = `
            <h3 class="text-xl font-bold">${post.title}</h3>
            <p class="text-gray-500 text-sm">${post.date}</p>
            <p>${post.content}</p>
            <img src="${post.imageUrl}" alt="${post.title}" class="w-full h-48 object-cover mt-4 mb-4"/>
            <input type="text" placeholder="Add a comment" id="comment-${post.id}" class="p-2 border w-full mb-2"/>
            <button onclick="addComment(${post.id}, document.getElementById('comment-${post.id}').value)" class="text-blue-500">Post Comment</button>
            <div class="mt-4">
                ${post.comments.map(comment => `<p><strong>${comment.user}:</strong> ${comment.comment}</p>`).join('')}
            </div>
        `;
        newsContainer.appendChild(postElement);
    });
}

function renderTourDates() {
    const tourDatesContainer = document.getElementById('tour-dates-container');
    tourDatesContainer.innerHTML = '';

    mockBackend.tourDates.forEach(date => {
        const dateElement = document.createElement('div');
        dateElement.className = "bg-white p-6 rounded-lg shadow-lg mb-4";
        dateElement.innerHTML = `
            <h3 class="font-bold text-xl">${date.location}</h3>
            <p>Venue: ${date.venue}</p>
            <p>Date: ${date.date} at ${date.time}</p>
            <button onclick="buyTicket('${date.location}')" class="bg-yellow-500 text-white px-4 py-2 rounded mt-2">Buy Ticket</button>
        `;
        tourDatesContainer.appendChild(dateElement);
    });
}

// Run Render Functions on Page Load
document.addEventListener("DOMContentLoaded", function() {
    renderNews();
    renderTourDates();
    renderFanForum();
    if (mockBackend.currentUser) {
        document.getElementById("loginBtn").innerText = "Logout";
        document.getElementById("loginBtn").onclick = logoutUser;
    }
});
