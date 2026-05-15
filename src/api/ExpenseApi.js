const API_URL = "https://690ee5d2bd0fefc30a05f45d.mockapi.io/api/vi/users";

export async function getExpenses() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function addExpense(expense) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });

  return await res.json();
}

export async function deleteExpense(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}