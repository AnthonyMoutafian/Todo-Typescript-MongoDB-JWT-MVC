const API = import.meta.env.VITE_API_URL;

function authHeaders(token = localStorage.getItem("token")) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

async function refreshAccessToken() {
  const res = await fetch(`${API}/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("force-logout"));
    throw new Error("SESSION_EXPIRED");
  }

  const data = await res.json();

  localStorage.setItem("token", data.accessToken);

  return data.accessToken;
}

async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      ...authHeaders(token),
    },
  });

  if (res.status === 401) {
    window.dispatchEvent(new Event("session-expired"));
    throw new Error("ACCESS_TOKEN_EXPIRED");
  }

  return res;
}

export async function registerUser(data) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  return result;
}

export async function getCurrentUser() {
  const res = await apiFetch(`${API}/todo`);

  return res.json();
}

export async function addTodo(todo) {
  const res = await apiFetch(`${API}/todo/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todo }),
  });

  return res.json();
}

export async function editTodo(id) {
  const res = await apiFetch(`${API}/todo/edit/${id}`, {
    method: "POST",
  });

  return res.json();
}

export async function saveTodo(id, todo) {
  const res = await apiFetch(`${API}/todo/save/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todo }),
  });

  return res.json();
}

export async function doneTodo(id) {
  const res = await apiFetch(`${API}/todo/done/${id}`, {
    method: "POST",
  });

  return res.json();
}

export async function deleteTodo(id) {
  const res = await apiFetch(`${API}/todo/delete/${id}`, {
    method: "POST",
  });

  return res.json();
}

export async function logoutUser() {
  const res = await apiFetch(`${API}/logout`, {
    method: "POST",
  });

  localStorage.removeItem("token");

  return res.json();
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await apiFetch(`${API}/avatar`, {
    method: "PUT",
    body: formData,
  });

  return res.json();
}

export async function deleteAvatar() {
  const res = await apiFetch(`${API}/avatar`, {
    method: "DELETE",
  });

  return res.json();
}

export async function uploadTodoImage(id, file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await apiFetch(`${API}/todo/${id}/image`, {
    method: "PUT",
    body: formData,
  });

  return res.json();
}

export async function deleteTodoImage(id) {
  const res = await apiFetch(`${API}/todo/${id}/image`, {
    method: "DELETE",
  });

  return res.json();
}
