// Mock backend data structure with extensive data
const mockBackend = {
    users: JSON.parse(localStorage.getItem("users")) || [],
    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
    news: [
        {
            id: 1,
            title: "North American Tour Announced!",
            date: "February 15, 2024",
            content: "We're thrilled to announce our North American tour! Catch us live across Canada and the U.S., bringing the Fab Four magic everywhere we go!",
            imageUrl: "https://via.placeholder.com/600x300",
            comments: [
                { user: "fan1", comment: "Can't wait to see you guys!" },
                { user: "beatlesFan", comment: "Booked my tickets already!" }
            ]
        },
        {
            id: 2,
            title: "New Cover Release: Hey Jude",
            date: "February 10, 2024",
            content: "Our latest Beatles cover, 'Hey Jude,' is out now. Listen to our unique spin while honoring the classic!",
            imageUrl: "https://via.placeholder.com/600x300",
            comments: [
                { user: "musicLover92", comment: "Amazing rendition!" },
                { user: "johnnyBGood", comment: "You did it justice!" }
            ]
        },
        {
            id: 3,
            title: "Behind the Scenes: Recording Process",
            date: "January 25, 2024",
            content: "Ever wondered how we record our covers? Here's a sneak peek into our studio sessions.",
            imageUrl: "https://via.placeholder.com/600x300",
            comments: []
        }
    ],
    tourDates: [
        { location: "Toronto, ON", venue: "Maple Leaf Gardens", date: "March 15, 2024", time: "8:00 PM" },
        { location: "Montreal, QC", venue: "Bell Centre", date: "March 18, 2024", time: "7:30 PM" },
        { location: "Vancouver, BC", venue: "Rogers Arena", date: "March 22, 2024", time: "8:00 PM" },
        { location: "Calgary, AB", venue: "Scotiabank Saddledome", date: "March 25, 2024", time: "7:30 PM" },
        { location: "New York, NY", venue: "Madison Square Garden", date: "April 5, 2024", time: "8:00 PM" }
    ],
    fanForum: [
        { user: "beatlesFan92", post: "Who else loves the new cover?", replies: ["Absolutely!", "It's awesome!"] },
        { user: "johnnyBGood", post: "Favorite song by TDB so far?", replies: ["Hey Jude!", "Let it Be is top-notch!"] },
        { user: "musicLover92", post: "Where are you watching TDB perform?", replies: ["Toronto!", "See you in Vancouver!"] }
    ]
};

// Helper function for saving data to local storage
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

// Render Functions
function renderHome() {
    const homeContainer = document.querySelector("[x-show='activeTab === home']");
    homeContainer.innerHTML = `
        <h2 class="text-3xl font-bold">Welcome to The Band Stans</h2>
        <p class="mt-4 text-gray-600">The hottest new band, bringing the magic of the Fab Four to North America!</p>
        <div class="bg-yellow-100 p-4 rounded-lg mt-6">
            <h3 class="text-xl font-bold mb-2">Upcoming Show: ${mockBackend.tourDates[0].location}</h3>
            <p>Venue: ${mockBackend.tourDates[0].venue}</p>
            <p>Date: ${mockBackend.tourDates[0].date}</p>
            <button onclick="buyTicket('${mockBackend.tourDates[0].location}')" class="bg-yellow-500 text-white px-4 py-2 rounded mt-4">Buy Tickets</button>
        </div>
    `;
}

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

function renderFanForum() {
    const fanForumContainer = document.getElementById('fan-forum-container');
    fanForumContainer.innerHTML = '';

    mockBackend.fanForum.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = "bg-white p-6 rounded-lg shadow-lg mb-4";
        postElement.innerHTML = `
            <p><strong>${post.user}</strong>: ${post.post}</p>
            <button onclick="addFanPost('${post.user}', 'Me too!')" class="text-blue-500">Reply</button>
            <div class="replies">
                ${post.replies.map(reply => `<p>${reply}</p>`).join('')}
            </div>
        `;
        fanForumContainer.appendChild(postElement);
    });
}

// Initialize render functions on page load
document.addEventListener("DOMContentLoaded", function() {
    renderHome();
    renderNews();
    renderTourDates();
    renderFanForum();
    if (mockBackend.currentUser) {
        document.getElementById("loginBtn").innerText = "Logout";
        document.getElementById("loginBtn").onclick = logoutUser;
    }
});
