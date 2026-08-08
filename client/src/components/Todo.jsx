import { useEffect, useState } from "react";
import {
  getCurrentUser,
  addTodo,
  editTodo,
  saveTodo,
  doneTodo,
  deleteTodo,
  logoutUser,
  uploadTodoImage,
  deleteTodoImage,
} from "../services/api";
import { useNavigate } from "react-router-dom";

const NO_IMAGE = "https://placehold.co/120x120?text=No+Image";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [value, setValue] = useState("");
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  async function loadTodos() {
    if (!localStorage.getItem("token")) {
      setLoggedIn(false);
      navigate("/login");
      return;
    }

    try {
      const data = await getCurrentUser();

      setTodos(data.user.todos || []);
    } catch (err) {
      if (err?.message === "ACCESS_TOKEN_EXPIRED") return;

      localStorage.removeItem("token");

      setLoggedIn(false);

      navigate("/login");
    }
  }

  useEffect(() => {
    loadTodos();

    function handleTokenRefreshed() {
      setLoggedIn(true);
      loadTodos();
    }

    window.addEventListener("token-refreshed", handleTokenRefreshed);

    return () => {
      window.removeEventListener("token-refreshed", handleTokenRefreshed);
    };
  }, []);

  async function createTodo(e) {
    e.preventDefault();

    try {
      await addTodo(value);

      setValue("");

      loadTodos();
    } catch (err) {
      if (err?.message === "ACCESS_TOKEN_EXPIRED") return;
      navigate("/login");
    }
  }

  async function handleEdit(id) {
    try {
      await editTodo(id);

      loadTodos();
    } catch (err) {
      if (err?.message === "ACCESS_TOKEN_EXPIRED") return;
      navigate("/login");
    }
  }

  async function handleSave(id, todo) {
    try {
      await saveTodo(id, todo);

      loadTodos();
    } catch (err) {
      if (err?.message === "ACCESS_TOKEN_EXPIRED") return;
      navigate("/login");
    }
  }

  async function handleDone(id) {
    try {
      await doneTodo(id);

      loadTodos();
    } catch (err) {
      if (err?.message === "ACCESS_TOKEN_EXPIRED") return;
      navigate("/login");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id);

      loadTodos();
    } catch (err) {
      if (err?.message === "ACCESS_TOKEN_EXPIRED") return;
      navigate("/login");
    }
  }

  async function logout() {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem("token");

      setLoggedIn(false);
      setTodos([]);

      navigate("/login");
    }
  }

  async function handleImageUpload(todoId, file) {
    if (!file) return;

    try {
      await uploadTodoImage(todoId, file);

      loadTodos();
    } catch (err) {
      if (err?.message === "ACCESS_TOKEN_EXPIRED") return;
      navigate("/login");
    }
  }

  async function handleDeleteImage(todoId) {
    try {
      await deleteTodoImage(todoId);

      loadTodos();
    } catch (err) {
      if (err?.message === "ACCESS_TOKEN_EXPIRED") return;
      navigate("/login");
    }
  }

  if (!loggedIn) {
    return (
      <div className="todoContainer">
        <div className="todoBox">
          <h2>You need to login first</h2>
          <a href="/login">Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="todoContainer">
      <div className="todoBox">
        <form className="todoForm" onSubmit={createTodo}>
          <input
            placeholder="Add Todo"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <button type="submit">+</button>
        </form>

        <div className="todosBox">
          {todos.map((todo) => (
            <div className="todo" key={todo._id}>
              <div className="todoLeft">
                <div className="todoImageBox">
                  <img
                    className="todoImage"
                    src={todo.image?.url || NO_IMAGE}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                </div>
                {todo.isEditing && !todo.isChecked && (
                  <label className="uploadImageBtn">
                    +
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(todo._id, e.target.files[0])
                      }
                    />
                  </label>
                )}
                {todo.isEditing && todo.image && (
                  <button
                    className="deleteImageBtn"
                    onClick={() => handleDeleteImage(todo._id)}
                  >
                    -
                  </button>
                )}
              </div>
              <div className="todoMiddle">
                <input
                  className={`todoInput
                ${todo.isEditing ? "editableTodo" : ""}
                ${todo.isChecked ? "checkedTodo" : ""}`}
                  type="text"
                  value={todo.todo}
                  disabled={!todo.isEditing || todo.isChecked}
                  onChange={(e) => {
                    setTodos(
                      todos.map((t) =>
                        t._id === todo._id
                          ? {
                              ...t,
                              todo: e.target.value,
                            }
                          : t,
                      ),
                    );
                  }}
                />
              </div>

              <div className="todoRight">
                {!todo.isChecked && (
                  <button
                    className="editBtn"
                    onClick={() =>
                      todo.isEditing
                        ? handleSave(todo._id, todo.todo)
                        : handleEdit(todo._id)
                    }
                  >
                    {todo.isEditing ? (
                      <i className="bi bi-floppy"></i>
                    ) : (
                      <i className="bi bi-pencil-fill"></i>
                    )}
                  </button>
                )}

                <div>
                  {!todo.isChecked && (
                    <button
                      className="doneBtn"
                      onClick={() => handleDone(todo._id)}
                    >
                      <i className="bi bi-check-circle-fill"></i>
                    </button>
                  )}

                  <button
                    className="deleteBtn"
                    onClick={() => handleDelete(todo._id)}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="profileBtn" onClick={() => navigate("/profile")}>
          Profile
        </button>
        <button className="logOutBtn" onClick={logout}>
          LogOut
        </button>
      </div>
    </div>
  );
}
