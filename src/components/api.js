const url = "https://mesto.nomoreparties.co/v1";
const token = "9cfe8ba5-4a8f-48c8-a36e-8500fb2455cf";
const groupId = "wff-cohort-18";

export let profileId = null;

async function request(address, type = "POST", body = null) {
  const path = `${url}/${groupId}/${address}`;
  const result = await fetch(path, {
    method: type,
    headers: {
      authorization: token,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  }).then((res) => {
    if (res.ok) return res.json();
    else throw `Ошибка ${res.status}`;
  });

  return result ?? null;
}

async function getAllCards() {
  return (await request("cards", "GET")) ?? [];
}

async function getUser() {
  try {
    const result = await request("users/me", "GET");
    if (!result) return null;
    if (profileId == null || profileId !== result._id) {
      profileId = result._id;
    }
    return result;
  } catch (err) {
    throw err;
  }
}

async function updateUser(name, about) {
  return await request("users/me", "PATCH", { name, about });
}

async function addNewCard(name, link) {
  return await request("cards", "POST", { name, link });
}

async function deleteCard(id) {
  return await request(`cards/${id}`, "DELETE");
}

async function setLikeCard(id, like) {
  return await request(`cards/likes/${id}`, like ? "PUT" : "DELETE");
}

async function updateUserAvatar(avatar) {
  return await request(`users/me/avatar`, "PATCH", { avatar });
}

export default {
  getAllCards,
  getUser,
  updateUser,
  addNewCard,
  deleteCard,
  setLikeCard,
  updateUserAvatar,
};
