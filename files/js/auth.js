// Authentication utilities
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('currentUser');
    updateAuthUI();
    window.location.href = 'index.html';
}

// Sign up functionality
function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }

    const users = getUsers();

    // Check if user already exists
    if (users.find(user => user.email === email)) {
        alert('User with this email already exists!');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password // In a real app, this should be hashed
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);

    alert('Account created successfully! Welcome ' + name);
    window.location.href = 'index.html';
}

// Login functionality
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('Invalid email or password!');
        return;
    }

    setCurrentUser(user);
    alert('Welcome back, ' + user.name + '!');
    window.location.href = 'index.html';
}

// Update UI based on authentication state
function updateAuthUI() {
    const currentUser = getCurrentUser();
    const isLoggedIn = !!currentUser;

    // Update navbar user button
    const userBtn = document.getElementById('user-btn');
    if (userBtn) {
        if (isLoggedIn) {
            userBtn.innerHTML = `<i class="fa-solid fa-user-check"></i>`;
            userBtn.title = `Logged in as ${currentUser.name}`;
            userBtn.onclick = function() {
                if (confirm('Are you sure you want to logout?')) {
                    logout();
                }
            };
        } else {
            userBtn.innerHTML = `<i class="fa-solid fa-user"></i>`;
            userBtn.title = 'Login';
            userBtn.onclick = function() {
                window.location.href = 'login.html';
            };
        }
    }

    // Update side menu
    const mainList = document.getElementById('main-list');
    if (mainList) {
        // Remove existing auth items
        const existingAuthItems = mainList.querySelectorAll('.auth-item');
        existingAuthItems.forEach(item => item.remove());

        if (isLoggedIn) {
            const logoutItem = document.createElement('li');
            logoutItem.className = 'nav-item auth-item';
            logoutItem.innerHTML = `
                <a href="#" class="nav-link" onclick="logout()">
                    Logout
                </a>
            `;
            mainList.appendChild(logoutItem);
        } else {
            const loginItem = document.createElement('li');
            loginItem.className = 'nav-item auth-item';
            loginItem.innerHTML = `
                <a href="login.html" class="nav-link">
                    Login
                </a>
            `;
            mainList.appendChild(loginItem);

            const signupItem = document.createElement('li');
            signupItem.className = 'nav-item auth-item';
            signupItem.innerHTML = `
                <a href="signup.html" class="nav-link">
                   Sign Up
                </a>
            `;
            mainList.appendChild(signupItem);
        }
    }
}

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();

    // Setup signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Setup login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});