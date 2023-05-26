const API_URL = 'http://localhost:8000/user';

async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data && data.token) {
      return { email, role: "user", token: data.token };
    } else {
      throw new Error(data.error || 'Login failed');
    }
  } catch (err) {
    throw err;
  }
}

export { login };
